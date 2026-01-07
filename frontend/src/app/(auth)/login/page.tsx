import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-8">
        Enter your credentials to access your account
      </p>
      <LoginForm />
    </div>
  );
}
