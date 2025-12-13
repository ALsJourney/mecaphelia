"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";
import { ProblemStatus, ProblemSeverity } from "../types";
import { analyzeCarProblem } from "../services/gemini-service";

export async function createProblem(
  carId: string,
  data: {
    title: string;
    description: string;
  }
) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const car = await prisma.car.findFirst({
    where: { id: carId, userId: user.id },
  });

  if (!car) throw new Error("Fahrzeug nicht gefunden");

  let aiResult: { analysis: string; estimatedCost: number; severity: ProblemSeverity } = {
    analysis: "",
    estimatedCost: 0,
    severity: ProblemSeverity.MEDIUM,
  };

  if (data.description) {
    aiResult = await analyzeCarProblem(
      {
        make: car.make,
        model: car.model,
        year: car.year,
        currentMileage: car.currentMileage,
      },
      data.description
    );
  }

  const problem = await prisma.problem.create({
    data: {
      title: data.title,
      description: data.description,
      status: ProblemStatus.OPEN,
      severity: aiResult.severity,
      estimatedCost: aiResult.estimatedCost,
      aiAnalysis: aiResult.analysis || null,
      carId,
      userId: user.id,
    },
  });

  revalidatePath(`/cars/${carId}`);
  revalidatePath("/dashboard");
  return problem;
}

export async function updateProblemStatus(problemId: string, status: ProblemStatus) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const problem = await prisma.problem.findFirst({
    where: { id: problemId, userId: user.id },
  });

  if (!problem) throw new Error("Problem nicht gefunden");

  const updated = await prisma.problem.update({
    where: { id: problemId },
    data: { status },
  });

  revalidatePath(`/cars/${problem.carId}`);
  revalidatePath("/dashboard");
  return updated;
}

export async function toggleProblemStatus(problemId: string) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const problem = await prisma.problem.findFirst({
    where: { id: problemId, userId: user.id },
  });

  if (!problem) throw new Error("Problem nicht gefunden");

  let newStatus: ProblemStatus = ProblemStatus.OPEN;
  if (problem.status === ProblemStatus.OPEN) {
    newStatus = ProblemStatus.IN_PROGRESS;
  } else if (problem.status === ProblemStatus.IN_PROGRESS) {
    newStatus = ProblemStatus.RESOLVED;
  }

  const updated = await prisma.problem.update({
    where: { id: problemId },
    data: { status: newStatus },
  });

  revalidatePath(`/cars/${problem.carId}`);
  revalidatePath("/dashboard");
  return updated;
}

export async function deleteProblem(problemId: string) {
  const { user } = await getAuth();
  if (!user) throw new Error("Nicht authentifiziert");

  const problem = await prisma.problem.findFirst({
    where: { id: problemId, userId: user.id },
  });

  if (!problem) throw new Error("Problem nicht gefunden");

  await prisma.problem.delete({ where: { id: problemId } });

  revalidatePath(`/cars/${problem.carId}`);
  revalidatePath("/dashboard");
}
