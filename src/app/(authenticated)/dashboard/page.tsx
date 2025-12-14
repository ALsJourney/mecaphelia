import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getCars } from "@/features/cars/actions/car-actions";
import { DashboardContent } from "@/features/cars/components/dashboard-content";
import { Country } from "@/features/cars/types";

type UserWithCountry = {
  country?: Country;
};

export default async function DashboardPage() {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  const cars = await getCars();
  const userCountry = ((user as unknown as UserWithCountry)?.country as Country) || Country.DEUTSCHLAND;

  return <DashboardContent cars={cars} country={userCountry} />;
}
