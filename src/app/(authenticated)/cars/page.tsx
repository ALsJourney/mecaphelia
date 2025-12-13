import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getCars } from "@/features/cars/actions/car-actions";
import { CarListContent } from "@/features/cars/components/car-list-content";

export default async function CarsPage() {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  const cars = await getCars();

  return <CarListContent cars={cars} />;
}
