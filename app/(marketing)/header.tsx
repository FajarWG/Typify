import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-2 z-10">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between h-full ">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          {/* <Image src={"/next.svg"} alt="Logo" width={40} height={40} /> */}
          <h1 className="text-2xl font-extrabold text-primary tracking-wide">
            Typify
          </h1>
        </div>
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="md" className="bg-primary text-white">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};

export default Header;
