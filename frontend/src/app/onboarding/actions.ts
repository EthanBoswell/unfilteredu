"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingInput = {
  role: "parent" | "student";
  stage: "high_school" | "college";
  gradYear: number;
  next?: string;
};

export async function completeOnboarding(input: OnboardingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    role: input.role,
    stage: input.stage,
    grad_year: input.gradYear,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(input.next || "/profile");
}
