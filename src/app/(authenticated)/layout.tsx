import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
