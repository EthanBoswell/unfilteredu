import { createClient } from "@/lib/supabase/server";
import NavClient from "./NavClient";

interface NavProps {
  schoolName?: string;
  schoolColor?: string;
  schoolTextColor?: string;
}

export default async function Nav(props: NavProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NavClient {...props} userEmail={user?.email ?? null} />;
}
