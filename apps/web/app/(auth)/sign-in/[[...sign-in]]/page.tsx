import { ThemedClerkSignIn } from "@/app/(auth)/themed-clerk-sign-in";
import { GuestLoginButton } from "./guest-login-button";

export default function SignInPage() {
  return (
    <div className="flex w-full flex-col">
      <ThemedClerkSignIn />
      <GuestLoginButton />
    </div>
  );
}
