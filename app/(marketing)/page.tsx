"use client";

import { FlipWords } from "@/components/molecules/flip-words";
import { InfiniteMovingCards } from "@/components/molecules/infiniteMoving";
import { StickyScroll } from "@/components/molecules/sticky-scroll";
import { getUser } from "@/utils/getUser";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { Button } from "@nextui-org/react";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { content, testimonials } from "./data";

const Page = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (isPending) return;

    startTransition(() => {
      getUser()
        .then(() => {
          router.push("/belajar");
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const words = ["Mengetik", "Budaya", "Game"];

  return (
    <div className="flex flex-col gap-52 ">
      <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-row items-center justify-center p-4 gap-2 mt-[13rem]">
        <div className="flex w-[424px] h-[424px] mb-0 items-center align-middle">
          <Image src="/img/Typify.png" alt="Hero" width={250} height={250} />
        </div>
        <div className="flex flex-col gap-2 max-w-[390px]">
          <div className="text-3xl mx-auto font-semibold text-neutral-600 dark:text-neutral-400">
            Belajar
            <FlipWords words={words} /> <br />
            dengan aplikasi Typify
          </div>
          <div className="flex flex-col gap-2 items-center w-full">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <Button
                  size="md"
                  className="bg-primary text-white cursor-pointer w-full"
                  onClick={onClick}
                >
                  Dashboard
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
      <StickyScroll content={content} />
    </div>
  );
};

export default Page;
