"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from "@/configs/firebase"
import { useRouter } from "next/navigation"

export default function Login() {

  const [error, setError] = useState<string | null>(null);
  const [signInWithGoogle, , googleLoading, googleError] = useSignInWithGoogle(auth);
  const [signInWithEmailPassword] = useSignInWithEmailAndPassword(auth);

  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signInWithEmailPassword(email, password);

      if (result?.user) {
        const idToken = await result.user.getIdToken()

        window.location.href = "/home"

        return;
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null); // Clear previous errors

    try {
      const result = await signInWithGoogle();
      if (result?.user) {

        const idToken = await result.user.getIdToken()

        console.log(idToken)
        // Redirect to dashboard or home page after successful Google sign-in
        router.push("/");
      }
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
    }
  };


  return (
    <div className={cn("gap-6 min-h-svh max-w-sm flex items-center mx-auto p-6 md:p-10")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input name="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={googleLoading} // Disable button while loading
              >
                {googleLoading ? "Signing in..." : "Login with Google"}
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {googleError && <p className="text-red-500 text-sm">{googleError.message}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
