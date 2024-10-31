import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/SignUpCard";

async function SignUpPage() {
  const user = await getAuthedUser();

  if (user) redirect("/");

  return <SignUpCard />;
}

export default SignUpPage;
