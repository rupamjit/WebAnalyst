"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { checkUser } from "@/actions/user";
import { toast } from "sonner";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      try {
        await checkUser();
      } catch (error) {
        toast("Error in storing data");
      }
    };

    if (user) {
      storeUserData();
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", bounce: 0, duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      filter: "blur(10px)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between relative">
        <Link
          href={"/"}
          className="flex items-center gap-2 group transition-opacity hover:opacity-90 z-[60]"
        >
          <div className="relative w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center p-1.5 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            WebAnalyst
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton forceRedirectUrl="/dashboard">
                <Button className="shadow-lg shadow-primary/20 rounded-full px-6">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="mr-2 text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/billing">
                <Button
                  variant="ghost"
                  className="mr-2 text-muted-foreground hover:text-foreground"
                >
                  Billing
                </Button>
              </Link>
              <div className="h-8 w-8 rounded-full ring-2 ring-primary/10 overflow-hidden">
                <UserButton
                  appearance={{ elements: { avatarBox: "w-full h-full" } }}
                />
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4 z-[60]">
          <SignedIn>
            <div className="h-8 w-8 rounded-full ring-2 ring-primary/10 overflow-hidden">
              <UserButton
                appearance={{ elements: { avatarBox: "w-full h-full" } }}
              />
            </div>
          </SignedIn>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Card */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-4 right-4 mt-2 p-2 bg-background/98 backdrop-blur-3xl border border-border/60 rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-2 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 hover:bg-muted/50 rounded-xl text-base font-medium transition-colors flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  Home
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 hover:bg-muted/50 rounded-xl text-base font-medium transition-colors flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  Pricing
                </Link>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 hover:bg-muted/50 rounded-xl text-base font-medium transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 hover:bg-muted/50 rounded-xl text-base font-medium transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                    Billing
                  </Link>
                </SignedIn>
                <div className="h-px bg-border/50 my-2 mx-2"></div>
                <SignedOut>
                  <div className="grid grid-cols-2 gap-3 p-1">
                    <SignInButton forceRedirectUrl="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl bg-background/50 border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton forceRedirectUrl="/dashboard">
                      <Button className="w-full rounded-xl shadow-lg shadow-primary/20">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <div className="px-4 py-2 text-xs text-muted-foreground text-center">
                  © 2026 WebAnalyst Inc.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
