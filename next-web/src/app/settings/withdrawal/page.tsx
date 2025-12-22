import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";
import { ClientWithdrawal } from "./ClientWithdrawal";

export const metadata: Metadata = {
  title: "退会手続き",
};

export default async function WithdrawalPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }
  return <ClientWithdrawal />;
}
