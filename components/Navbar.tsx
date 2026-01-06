"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user } = useUser();
  console.log(user);

  return (
    <div className="flex items-center justify-between p-4 mx-2">
      <Link href={"/"}>
        <div className="flex items-center gap-2 cursor-pointer">
          <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          <h1 className="text-xl font-extrabold hover:text-gray-700">
            WebAnalyst
          </h1>
        </div>
      </Link>
      <div className="flex items-center gap-5">
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button
              variant="outline"
              className="cursor-pointer text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton forceRedirectUrl="/dashboard">
            <Button className="cursor-pointer text-sm sm:text-base px-3 sm:px-4 py-2">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
