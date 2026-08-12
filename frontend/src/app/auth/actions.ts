"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/events";

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  after(() => logEvent(supabase, data.user.id, "login", { method: "password" }));

  if (!profile) {
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

function redirectToLoginForExistingAccount(email: string, next: string): never {
  const message = "An account with that email already exists. Log in instead.";
  redirect(
    `/login?error=${encodeURIComponent(message)}&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
  );
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/";
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  // Signing up with an email/phone-confirmation project already returns no
  // error for an existing confirmed user — instead it hands back a fake user
  // with an empty identities array. When confirmation is off, Supabase just
  // errors with code "user_already_exists" instead.
  if (error?.code === "user_already_exists") {
    redirectToLoginForExistingAccount(email, next);
  }

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user?.identities?.length === 0) {
    redirectToLoginForExistingAccount(email, next);
  }

  redirect("/signup?checkEmail=1");
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const next = (formData.get("next") as string) || "/";
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}
