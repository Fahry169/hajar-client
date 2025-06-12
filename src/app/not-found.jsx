"use client";

import { Button, Image } from "@heroui/react";

const Page = () => {
  return (
    <div className="flex flex-col-reverse gap-8 sm:flex-row h-[calc(100vh_-84px)] w-full max-w-4xl mx-auto items-center justify-center text-slate-800 text-opacity-90">
      <div className="w-1/2 space-y-2">
        <h1 className="text-4xl font-bold">Ooops...</h1>
        <h2 className="text-3xl font-thin">Page not found</h2>
        <p className="">
          The page you are looking for doesn't exist or something went wrong, go
          back to home page
        </p>
        <Button
          variant="flat"
          className="bg-gradient-to-r from-red-400 to-red-600 text-white"
          onPress={() => window.location.replace("/dashboard")}
        >
          Home
        </Button>
      </div>
      <div className="w-1/2 flex items-center justify-center h-auto">
        <Image
          src="/others/not-found.png"
          width={250}
          alt="not-found image"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default Page;
