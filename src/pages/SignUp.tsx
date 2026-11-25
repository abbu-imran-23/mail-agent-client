import { SignUp as ClerkSignUp } from "@clerk/react";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClerkSignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
};

export default SignUp;
