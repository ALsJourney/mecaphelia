import { redirect, notFound } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getCarById } from "@/features/cars/actions/car-actions";
import { CarDetailContent } from "@/features/cars/components/car-detail-content";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

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

  return <CarDetailContent car={car} />;
}
