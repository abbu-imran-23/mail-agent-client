import { SignIn as ClerkSignIn } from "@clerk/react";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    </div>
  );
};

export default SignIn;
