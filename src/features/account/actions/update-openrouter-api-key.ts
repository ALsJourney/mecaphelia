"use server";

import { z } from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

const openrouterApiKeySchema = z.object({
  openrouterApiKey: z.string().optional(),
});

export const updateOpenrouterApiKey = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { user } = await getAuth();

    if (!user) {
      return toActionState("ERROR", "User not found", formData);
    }

    const { openrouterApiKey } = openrouterApiKeySchema.parse(
      Object.fromEntries(formData),
    );

    const normalizedApiKey = openrouterApiKey?.trim() || null;

    const prismaWithOpenrouterApiKey = prisma as unknown as {
      user: {
        update: (args: {
          where: { id: string };
          data: { openrouterApiKey: string | null };
        }) => Promise<unknown>;
      };
    };

    await prismaWithOpenrouterApiKey.user.update({
      where: { id: user.id },
      data: { openrouterApiKey: normalizedApiKey },
    });

    return toActionState("SUCCESS", "Openrouter API Key gespeichert", formData);
  } catch (error) {
    console.error(error);
    return fromErrorToActionState(error, formData);
  }
};
