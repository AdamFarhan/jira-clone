import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { SignInCard } from "@/features/auth/components/SignInCard";

export default async function SignInPage() {
  const user = await getAuthedUser();

  if (user) redirect("/");

  return <SignInCard />;
}
