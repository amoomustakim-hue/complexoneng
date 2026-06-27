import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <SignIn
        appearance={{
          variables: { colorPrimary: "#0D3B2E" },
        }}
      />
    </div>
  );
}
