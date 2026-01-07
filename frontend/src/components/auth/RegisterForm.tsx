"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
];

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const failedRequirements = passwordRequirements.filter(
        (req) => !req.test(formData.password)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="John Doe"
        error={touched.name ? errors.name : undefined}
        leftIcon={<User className="w-4 h-4" />}
        autoComplete="name"
        disabled={isLoading}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="you@example.com"
        error={touched.email ? errors.email : undefined}
        leftIcon={<Mail className="w-4 h-4" />}
        autoComplete="email"
        disabled={isLoading}
      />

      {/* Password */}
      <div>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Create a password"
            error={touched.password ? errors.password : undefined}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Password requirements */}
        {formData.password && (
          <div className="mt-2 space-y-1">
            {passwordRequirements.map((req, index) => {
              const passed = req.test(formData.password);
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    passed ? "text-green-600" : "text-gray-500"
                  )}
                >
                  {passed ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  {req.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm your password"
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showConfirmPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Submit button */}
      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Create Account
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
