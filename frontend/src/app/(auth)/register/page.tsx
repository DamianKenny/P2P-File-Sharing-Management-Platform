import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Create an account
      </h1>
      <p className="text-gray-600 mb-8">
        Get started with your free account today
      </p>
      <RegisterForm />
    </div>
  );
}
