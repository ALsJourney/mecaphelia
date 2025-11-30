"use server";

import { hash, verify } from "@node-rs/argon2";
import z from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const changePassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const validatedData = passwordSchema.parse(Object.fromEntries(formData));

    const { user } = await getAuth();

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!userWithPassword?.passwordHash) {
      return toActionState("ERROR", "User not found");
    }

    const isValidPassword = await verify(
      userWithPassword.passwordHash,
      validatedData.currentPassword,
    );

    if (!isValidPassword) {
      return toActionState("ERROR", "Current password is incorrect");
    }

    const hashedPassword = await hash(validatedData.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return toActionState("SUCCESS", "Password changed successfully");
  } catch (error) {
    console.error(error);
    return fromErrorToActionState(error, formData);
  }
};

export { changePassword };
