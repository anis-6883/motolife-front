import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";

const NotFound = () => {
  return (
    <main className="mt-10 flex min-h-[50vh] flex-col items-center justify-center px-6 text-center lg:mt-12">
      <div className="relative mb-6 aspect-square w-60 sm:w-72 md:w-96">
        <ImageWithFallback
          fallbackSrc="/images/shared/errors/404.png"
          src="/images/shared/errors/404.png"
          alt="Page not found illustration"
          fill
        />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Page Not Found</h1>

      <p className="text-muted-foreground mt-3 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved. Let’s get you back to somewhere familiar.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button className="cool">
            <AiOutlineHome className="text-2xl" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
