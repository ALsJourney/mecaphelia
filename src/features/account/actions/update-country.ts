"use server";

import { revalidatePath } from "next/cache";

import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { Country } from "@/features/cars/types";

export async function updateCountry(country: Country) {
  const { user } = await getAuth();

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { country },
  });

  revalidatePath("/settings");
  revalidatePath("/cars");
  revalidatePath("/dashboard");
}
