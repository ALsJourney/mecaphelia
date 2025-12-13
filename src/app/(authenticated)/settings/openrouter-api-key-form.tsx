"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form-component";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateOpenrouterApiKey } from "@/features/account/actions/update-openrouter-api-key";

type OpenrouterApiKeyFormProps = {
  defaultValue?: string | null;
};

export const OpenrouterApiKeyForm = ({
  defaultValue,
}: OpenrouterApiKeyFormProps) => {
  const [actionState, action] = useActionState(
    updateOpenrouterApiKey,
    EMPTY_ACTION_STATE,
  );

  const valueFromActionState = actionState.payload?.get("openrouterApiKey");

  return (
    <Form action={action} actionState={actionState}>
      <div className="space-y-2">
        <Label htmlFor="openrouterApiKey">Openrouter API Key</Label>
        <Input
          id="openrouterApiKey"
          name="openrouterApiKey"
          type="password"
          placeholder="or-..."
          autoComplete="off"
          defaultValue={
            (valueFromActionState as string | null) ?? defaultValue ?? ""
          }
        />
        <FieldError actionState={actionState} name="openrouterApiKey" />
        <p className="text-xs text-muted-foreground">
          Wird in deiner Datenbank gespeichert. Leere das Feld und speichere, um den
          Key zu entfernen.
        </p>
      </div>

      <div className="pt-2">
        <SubmitButton label="Speichern" />
      </div>
    </Form>
  );
};
