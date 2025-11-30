"use client";
import { useActionState, useState } from "react";

import { Form } from "./form/form-component";
import { SubmitButton } from "./form/submit-button";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState | void>;
  trigger: React.ReactNode;
};

const ConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  action,
  trigger,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Wrap the action to make it compatible with useActionState
  const wrappedAction = async () //_prevState: ActionState,
  //_formData: FormData,
  : Promise<ActionState> => {
    const result = await action();
    // If the action returns void (due to redirect), return the previous state
    return result || EMPTY_ACTION_STATE;
  };

  const [actionState, formAction] = useActionState(
    wrappedAction,
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Form
              action={formAction}
              actionState={actionState}
              onSuccess={handleSuccess}
            >
              <SubmitButton label="Confirm" />
            </Form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmDialog };
