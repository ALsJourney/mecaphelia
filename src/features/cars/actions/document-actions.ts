"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";

export async function createDocument(
  carId: string,
  data: {
    name: string;
    fileType: string;
    content: string;
  }
) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const car = await prisma.car.findFirst({
    where: { id: carId, userId: user.id },
  });

  if (!car) throw new Error("Fahrzeug nicht gefunden");

  const document = await prisma.document.create({
    data: {
      name: data.name,
      fileType: data.fileType,
      content: data.content,
      carId,
      userId: user.id,
    },
  });

  revalidatePath(`/cars/${carId}`);
  return document;
}

export async function deleteDocument(documentId: string) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: user.id },
  });

  if (!document) throw new Error("Dokument nicht gefunden");

  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath(`/cars/${document.carId}`);
}
