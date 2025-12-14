import { redirect, notFound } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getCarById } from "@/features/cars/actions/car-actions";
import { CarDetailContent } from "@/features/cars/components/car-detail-content";
import { Country } from "@/features/cars/types";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

type UserWithCountry = {
  country?: Country;
};

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  const userCountry = ((user as unknown as UserWithCountry)?.country as Country) || Country.DEUTSCHLAND;

  return <CarDetailContent car={car} country={userCountry} />;
}
