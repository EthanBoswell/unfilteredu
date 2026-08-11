"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleSavedSchool(schoolId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/schools/${slug}`);
  }

  const { data: existing } = await supabase
    .from("saved_schools")
    .select("id")
    .eq("user_id", user.id)
    .eq("school_id", schoolId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_schools").delete().eq("id", existing.id);
  } else {
    await supabase.from("saved_schools").insert({ user_id: user.id, school_id: schoolId });
  }

  revalidatePath(`/schools/${slug}`);
  revalidatePath("/profile");
}
