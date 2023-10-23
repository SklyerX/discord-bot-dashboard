"use client";

import Navbar from "@/components/misc/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { DEVELOPER_URL, GITHUB_URL } from "@/utils/constants";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mt-20">
        <Link
          href={DEVELOPER_URL}
          className="w-80 rounded-2xl font-medium animate-bounce bg-input/40 py-1"
        >
          See what else I do 🚀
        </Link>
        <h1 className="font-heading font-semibold text-3xl sm:text-5xl md:text-6xl">
          A simple counting bot with a minimalistic dashboard
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          I built this project in order to get a better grasp of working with
          discord oauth. I have an upcoming project that requires me to build a
          discord dashboard so I thought I'd experiment.
        </p>
        <div className="space-x-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "default" })}
          >
            Get Started
          </Link>
          <Link
            href={GITHUB_URL}
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Github
          </Link>
        </div>
      </div>
    </>
  );
}
