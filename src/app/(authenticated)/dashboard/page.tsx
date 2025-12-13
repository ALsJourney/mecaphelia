import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getCars } from "@/features/cars/actions/car-actions";
import { DashboardContent } from "@/features/cars/components/dashboard-content";

export default async function DashboardPage() {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  const cars = await getCars();

  return <DashboardContent cars={cars} />;
}
