"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from "@/configs/firebase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { loginWithFirebaseToken } from "@/services/auth";
import { useUser } from "@/contexts/UserContext";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isEmailPwdLoading, setIsEmailPwdLoading] = useState(false)

  const router = useRouter()

  const [signInWithEmailPassword, , emailLoading, emailError] = useSignInWithEmailAndPassword(auth)
  const [signInWithGoogle, , googleLoading, googleError] = useSignInWithGoogle(auth)

  const { setUser } = useUser();

  const handleEmailPasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.")
      return
    }

    setIsEmailPwdLoading(true)

    try {
      const result = await signInWithEmailPassword(email, password);

      if (result?.user) {
        const idToken = await result.user.getIdToken();

        // First authenticate with Firebase, then with your backend
        const user = await loginWithFirebaseToken(idToken);

        if (user === null) {
          throw new Error("Backend authentication failed");
        }

        // Update user context
        setUser(user);

        toast.success("Successfully logged in!");
        router.push("/");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsEmailPwdLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {

    try {

      const result = await signInWithGoogle();

      if (result?.user) {
        // Get Firebase token
        const idToken = await result.user.getIdToken();
        console.log(idToken);

        const user = await loginWithFirebaseToken(idToken)

        if (user === null) {
          throw new Error("Backend authentication failed");
        }

        // Update user context
        setUser(user);

        toast.success("Successfully logged in with Google!");
        router.push("/");
      } else {
        toast.error("Invalid email or password. Please try again.")
      }
    } catch (err) {
      toast.error("An error occurred during Google sign-in. Please try again.");
      console.error(err);
    } 
  };

  // Display error messages from Firebase
  const getErrorMessage = () => {
    if (emailError) return emailError.message
    if (googleError) return googleError.message
    return null
  }

  const isSubmitButtonDisabled = isEmailPwdLoading || emailLoading || googleLoading

  return (
    <div className={cn("min-h-svh max-w-sm flex items-center mx-auto p-6 md:p-10")}>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitButtonDisabled}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitButtonDisabled}
              />
            </div>

            {getErrorMessage() && (
              <div className="text-sm text-red-500 p-2 rounded bg-red-50">
                {getErrorMessage()}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitButtonDisabled}
            >
              {isEmailPwdLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isSubmitButtonDisabled}
          >
            {(googleLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}