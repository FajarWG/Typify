import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-row items-center justify-center p-4 gap-4">
      <div className="relative w-[424px] h-[424px] mb-0">
        <Image src="/vercel.svg" alt="Hero" fill />
      </div>
      <div className="flex flex-col gap-2 max-w-[340px]">
        <p className="text-lg text-gray-500 font-semibold text-center">
          Belajar mengetik sambil mengenal budaya indonesia
        </p>
        <div className="flex flex-col gap-2 items-center w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <Button
                size="md"
                className="bg-primary text-white cursor-pointer w-full"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="md"
                  className="bg-primary text-white w-full cursor-pointer"
                >
                  Mulai Buat Akun
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  size="md"
                  variant="light"
                  className=" font-bold text-primary w-full cursor-pointer"
                >
                  Sudah punya akun?
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};

export default Page;
