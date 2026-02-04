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

const Navbar = () => {
  const { user } = useUser();
  // console.log(user);

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


  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <div className="relative w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center p-1.5 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
             <Image src={"/logo.png"} alt="logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            WebAnalyst
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:flex"
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
              <Button variant="ghost" className="mr-2 text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
            <div className="h-8 w-8 rounded-full ring-2 ring-primary/10 overflow-hidden">
               <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
