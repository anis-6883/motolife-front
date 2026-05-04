"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { RxReload } from "react-icons/rx";

export default function Error() {
  return (
    <main className="mt-10 flex min-h-[50vh] flex-col items-center justify-center px-6 text-center lg:mt-12">
      <div className="relative mb-6 aspect-473/406 w-72 sm:w-96">
        <ImageWithFallback
          fallbackSrc="/images/shared/errors/500.png"
          src="/images/shared/errors/500.png"
          alt="Server error illustration"
          fill
        />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Something went wrong in Server!</h1>

      <p className="text-muted-foreground mt-3 max-w-md">
        We’re having trouble processing your request right now. Please try again, or come back later!
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => window.location.reload()} className="cool">
          <RxReload /> Try Again
        </Button>

        <Link href="/">
          <Button variant="outline">
            <AiOutlineHome className="text-2xl" /> Go to Homepage
          </Button>
        </Link>
      </div>
    </main>
  );
}
