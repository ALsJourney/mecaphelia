"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";
import { ExpenseType } from "../types";

export async function createExpense(
  carId: string,
  data: {
    description: string;
    amount: number;
    type: ExpenseType;
    date?: Date;
    imageUrl?: string;
  }
) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const car = await prisma.car.findFirst({
    where: { id: carId, userId: user.id },
  });

  if (!car) throw new Error("Fahrzeug nicht gefunden");

  const expense = await prisma.expense.create({
    data: {
      description: data.description || ExpenseType[data.type],
      amount: Math.round(data.amount * 100),
      date: data.date || new Date(),
      type: data.type,
      imageUrl: data.imageUrl || null,
      carId,
      userId: user.id,
    },
  });

  revalidatePath(`/cars/${carId}`);
  revalidatePath("/dashboard");
  return expense;
}

export async function deleteExpense(expenseId: string) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId: user.id },
  });

  if (!expense) throw new Error("Ausgabe nicht gefunden");

  await prisma.expense.delete({ where: { id: expenseId } });

  revalidatePath(`/cars/${expense.carId}`);
  revalidatePath("/dashboard");
}
