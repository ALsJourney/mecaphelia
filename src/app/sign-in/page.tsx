import Link from "next/link";

import { CardCompact } from "@/components/card-compact";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { passwordResetPath, signUpPath } from "@/path";

const SignInPage = () => {
  // const [actionState, action] = useActionState(signIn, EMPTY_ACTION_STATE);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="flex w-full justify-between  ">
            <Link href={signUpPath()} className="text-sm text-muted-foreground">
              No account yet?
            </Link>
            <Link
              href={passwordResetPath()}
              className="text-sm text-muted-foreground"
            >
              Forgot password?
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default SignInPage;
