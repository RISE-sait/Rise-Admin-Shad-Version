"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerDisplayData {
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    profilePicture: string;
  } | null;
  membership: {
    membership_name?: string;
    membership_plan_name?: string;
    membership_renewal_date?: string;
  } | null;
  timestamp: number;
}

// Animated text component with word-by-word stagger
function AnimatedWords({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-3 ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariant}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Animated text component for single block animations
function AnimatedText({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "fadeIn" | "scale";
}) {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.8, delay } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay } },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={variants[variant]}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.span>
  );
}

// Pulse ring component for idle state
function PulseRings() {
  return (
    <div className="relative h-96 w-96">
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500" />

      {/* Static inner ring */}
      <div className="absolute inset-[20%] rounded-full border-2 border-yellow-500 opacity-30" />

      {/* Animated rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-yellow-500"
          animate={{
            scale: [0.2, 1.1],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: 2.4,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "linear",
            times: [0, 1],
          }}
        />
      ))}
    </div>
  );
}

export default function CustomerDisplayPage() {
  const [displayData, setDisplayData] = useState<CustomerDisplayData | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Listen for check-in events from the admin page
    const channel = new BroadcastChannel("checkin-display");

    channel.onmessage = (event) => {
      if (event.data.type === "CHECKIN") {
        setDisplayData(event.data.payload);
        setShowWelcome(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowWelcome(false);
        }, 5000);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const hasMembership = displayData?.membership !== null;
  const membershipName =
    displayData?.membership?.membership_name ||
    displayData?.membership?.membership_plan_name;
  const renewalDate = displayData?.membership?.membership_renewal_date
    ? new Date(displayData.membership.membership_renewal_date).toLocaleDateString()
    : null;

  return (
    <motion.div
      className="flex min-h-screen w-full flex-col bg-gradient-to-b from-[#0a1628] to-[#0d1f35]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">RISE</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <motion.div
              className="h-2 w-2 rounded-full bg-yellow-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-base">System Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          {showWelcome && displayData?.customer ? (
            <motion.div
              key="welcome"
              className="flex flex-col items-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                <Avatar className="h-32 w-32 border-4 border-yellow-500 shadow-lg">
                  <AvatarImage
                    src={displayData.customer.profilePicture || ""}
                    alt={`${displayData.customer.first_name} ${displayData.customer.last_name}`}
                  />
                  <AvatarFallback className="bg-yellow-500/20 text-5xl text-yellow-500">
                    {displayData.customer.first_name?.[0]}
                    {displayData.customer.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Greeting */}
              <AnimatedText className="text-4xl text-slate-400" delay={0.2}>
                Welcome back,
              </AnimatedText>

              {/* Name */}
              <AnimatedWords
                className="text-8xl font-bold text-white"
                delay={0.4}
              >
                {`${displayData.customer.first_name} ${displayData.customer.last_name}`}
              </AnimatedWords>

              {/* Membership Badge */}
              <motion.div
                className={`mt-4 rounded-full px-8 py-3 ${
                  hasMembership ? "bg-green-500/20" : "bg-red-500/20"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span
                  className={`text-2xl font-medium uppercase tracking-wider ${
                    hasMembership ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {hasMembership ? membershipName : "No Active Membership"}
                </span>
              </motion.div>

              {/* Renewal Info */}
              {hasMembership && renewalDate && (
                <motion.div
                  className="mt-4 flex items-center gap-2 text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <span className="text-base">Renews: {renewalDate}</span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="flex flex-col items-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pulse Rings */}
              <PulseRings />

              {/* Idle Text */}
              <h2 className="text-6xl font-light text-white">Ready for Check-In</h2>
              <p className="text-2xl text-slate-400">
                Scan your member ID to check in
              </p>

              {/* Status Indicator */}
              <div className="mt-8 flex items-center gap-2 text-slate-500">
                <motion.div
                  className="h-2 w-2 rounded-full bg-yellow-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-base">Waiting for scan...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8">
        <div className="text-center text-slate-500">
          <p className="text-xl">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-4xl font-light text-slate-400">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
