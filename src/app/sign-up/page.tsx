import Link from "next/link";

import { CardCompact } from "@/components/card-compact";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { signInPath } from "@/path";

const SignUpPage = () => {
  return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Sign Up"
          description="Create a new account"
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<SignUpForm />}
          footer={
            <Link href={signInPath()} className="text-sm text-muted-foreground" >
              Have an account? Sign in now.
            </Link>
          }
        />
      </div>
  );
};

export default SignUpPage;
