"use server";

import { redirect } from "next/navigation";
import z, { email } from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { accountProfilePath } from "@/path";

const accountSchema = z.object({
  newUsername: z.string().min(2).max(32).optional(),
  newEmail: email().optional(),
});

const changeAccountData = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { newUsername, newEmail } = accountSchema.parse(
      Object.fromEntries(formData),
    );

    const { user } = await getAuth();

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: newUsername ?? user.username,
        email: newEmail ?? user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return fromErrorToActionState(error, formData);
  }

  redirect(accountProfilePath());
};

export { changeAccountData };
