"use server";

import { redirect } from "next/navigation";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";
import { env } from "@/config";

export async function withdrawal(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }

  const logoutReturnTo = encodeURIComponent(
    new URL("/", env.APP_BASE_URL).toString(),
  );

  const user = await prisma.user.findUnique({
    where: { auth0UserId: session!.user.sub },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const reasonValue = formData.get("reason");
  const reason = typeof reasonValue === "string" ? reasonValue : null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        archivedAt: new Date(),
        email: `deleted+${user.id}@example.com`,
      },
    }),
    prisma.userWithdrawal.create({
      data: {
        userId: user.id,
        reason: reason ?? undefined,
      },
    }),
  ]);

  const auth0UserId = session.user.sub;
  await deleteAuth0User(auth0UserId);

  redirect(`/auth/logout?returnTo=${logoutReturnTo}`);
}

async function getManagementToken() {
  const res = await fetch(`https://${env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: env.API_CLIENT_ID,
      client_secret: env.API_CLIENT_SECRET,
      audience: `https://${env.AUTH0_DOMAIN}/api/v2/`,
    }),
  });

  if (!res.ok) throw new Error("Failed to get management token");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function deleteAuth0User(auth0UserId: string) {
  const token = await getManagementToken();
  const res = await fetch(
    `https://${env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to delete Auth0 user");
}
