"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";

export async function getCars() {
  const { user } = await getAuth();
  if (!user) return [];

  return prisma.car.findMany({
    where: { userId: user.id },
    include: {
      problems: true,
      expenses: true,
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCarById(id: string) {
  const { user } = await getAuth();
  if (!user) return null;

  return prisma.car.findFirst({
    where: { id, userId: user.id },
    include: {
      problems: {
        orderBy: { createdAt: "desc" },
      },
      expenses: {
        orderBy: { date: "desc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createCar(data: {
  make: string;
  model: string;
  year: number;
  vin?: string;
  purchasePrice: number;
  purchaseDate: Date;
  currentMileage: number;
  nextInspectionDate: Date;
  nextServiceDate?: Date;
  imageUrl?: string;
}) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const car = await prisma.car.create({
    data: {
      ...data,
      userId: user.id,
    },
    include: {
      problems: true,
      expenses: true,
      documents: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/cars");
  return car;
}

export async function updateCar(
  id: string,
  data: {
    make?: string;
    model?: string;
    year?: number;
    vin?: string;
    purchasePrice?: number;
    purchaseDate?: Date;
    currentMileage?: number;
    nextInspectionDate?: Date;
    nextServiceDate?: Date | null;
    imageUrl?: string;
  }
) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const existingCar = await prisma.car.findFirst({
    where: { id, userId: user.id },
  });

  if (!existingCar) throw new Error("Fahrzeug nicht gefunden");

  const car = await prisma.car.update({
    where: { id },
    data,
    include: {
      problems: true,
      expenses: true,
      documents: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/cars");
  revalidatePath(`/cars/${id}`);
  return car;
}

export async function deleteCar(id: string) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const existingCar = await prisma.car.findFirst({
    where: { id, userId: user.id },
  });

  if (!existingCar) throw new Error("Fahrzeug nicht gefunden");

  await prisma.car.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/cars");
}
