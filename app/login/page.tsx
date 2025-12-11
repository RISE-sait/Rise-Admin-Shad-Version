"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useSignInWithEmailAndPassword,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { auth } from "@/configs/firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, Code2, Eye, EyeOff, Dumbbell, Users, Calendar, TrendingUp } from "lucide-react";
import { loginWithFirebaseToken } from "@/services/auth";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailPwdLoading, setIsEmailPwdLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { toast } = useToast();

  const router = useRouter();

  const [signInWithEmailPassword, , emailLoading, emailError] =
    useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, sendingReset] = useSendPasswordResetEmail(auth);

  const { setUser } = useUser();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      toast({
        status: "error",
        description: "Please enter your email address.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(resetEmail);
      toast({
        status: "success",
        description: "Password reset email sent! Check your inbox and spam folder.",
      });
      setForgotPasswordOpen(false);
      setResetEmail("");
    } catch (err) {
      toast({
        status: "error",
        description: "Failed to send reset email. Please try again.",
      });
      console.error(err);
    }
  };

  const handleEmailPasswordLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email || !password) {
      toast({ status: "error", description: "Please fill in all fields." });
      return;
    }

    setIsEmailPwdLoading(true);

    try {
      const result = await signInWithEmailPassword(email, password);

      if (result?.user) {
        const idToken = await result.user.getIdToken();

        const user = await loginWithFirebaseToken(idToken);

        if (user === null) {
          throw new Error("Backend authentication failed");
        }

        localStorage.setItem("jwt", user.Jwt);
        const isSecure = window.location.protocol === 'https:';
        document.cookie = `jwt=${user.Jwt}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax${isSecure ? '; Secure' : ''}`;

        setUser(user);

        toast({ status: "success", description: "Successfully logged in!" });
        router.push(user.Role === StaffRoleEnum.COACH ? "/calendar" : "/");
      } else {
        toast({
          status: "error",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (err) {
      toast({
        status: "error",
        description: "An error occurred during login. Please try again.",
      });
      console.error(err);
    } finally {
      setIsEmailPwdLoading(false);
    }
  };

  const getErrorMessage = () => {
    if (emailError) return emailError.message;
    return null;
  };

  const isSubmitButtonDisabled =
    isEmailPwdLoading || emailLoading || sendingReset;

  return (
    <div className="min-h-svh flex bg-zinc-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/90 to-zinc-950/95" />

        {/* Accent glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Top - Logo & Welcome */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Image
                src="/RiseLogo1.png"
                alt="Rise Logo"
                width={160}
                height={160}
                priority
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:100ms]">
              Rise Admin
            </h1>
            <p className="text-lg text-zinc-400 text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms]">
              Complete gym management solution for modern fitness businesses
            </p>

            {/* Feature cards */}
            <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="group bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/60 hover:border-amber-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:300ms]">
                <Users className="h-6 w-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white text-sm">Members</h3>
                <p className="text-xs text-zinc-500">Track & manage</p>
              </div>
              <div className="group bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/60 hover:border-amber-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:400ms]">
                <Calendar className="h-6 w-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white text-sm">Scheduling</h3>
                <p className="text-xs text-zinc-500">Classes & bookings</p>
              </div>
              <div className="group bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/60 hover:border-amber-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:500ms]">
                <Dumbbell className="h-6 w-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white text-sm">Equipment</h3>
                <p className="text-xs text-zinc-500">Inventory control</p>
              </div>
              <div className="group bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/60 hover:border-amber-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:600ms]">
                <TrendingUp className="h-6 w-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white text-sm">Analytics</h3>
                <p className="text-xs text-zinc-500">Growth insights</p>
              </div>
            </div>
          </div>

          {/* Bottom - Havenz Tech Credit */}
          <div className="pt-8 border-t border-zinc-800/50 animate-in fade-in duration-1000 [animation-delay:700ms]">
            <div className="flex items-center justify-center gap-2 text-zinc-500">
              <Code2 className="h-4 w-4" />
              <span className="text-sm">
                Crafted by{" "}
                <a
                  href="https://havenztech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Havenz Tech
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Image
              src="/RiseLogo1.png"
              alt="Rise Logo"
              width={80}
              height={80}
              priority
            />
            <h1 className="mt-4 text-xl font-bold">Rise Admin</h1>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-right-4 duration-500 lg:animate-none">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailPasswordLogin} className="space-y-5">
            <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500 [animation-delay:100ms] lg:animate-none">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitButtonDisabled}
                  className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500 [animation-delay:200ms] lg:animate-none">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-sm text-amber-600 hover:text-amber-500 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitButtonDisabled}
                  className="pl-10 pr-12 h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {getErrorMessage() && (
              <div className="text-sm text-red-600 dark:text-red-400 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in shake duration-300">
                {getErrorMessage()}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 animate-in fade-in slide-in-from-right-4 duration-500 [animation-delay:300ms] lg:animate-none disabled:opacity-70"
              disabled={isSubmitButtonDisabled}
            >
              {isEmailPwdLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                  <span>Signing you in...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Mobile Havenz Credit */}
          <div className="lg:hidden pt-8 text-center animate-in fade-in duration-700 [animation-delay:400ms]">
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Code2 className="h-4 w-4" />
              <span className="text-sm">
                Crafted by{" "}
                <a
                  href="https://havenztech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Havenz Tech
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={sendingReset}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all hover:shadow-lg hover:shadow-amber-500/25"
              disabled={sendingReset}
            >
              {sendingReset ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending link...</span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-black/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 bg-black/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 bg-black/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
