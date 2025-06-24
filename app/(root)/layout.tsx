import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout">
      <nav className="mt-[-26px]">
        <Link href="/HomePage" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-lg border-2 border-primary-100 p-1 hover:border-primary-200 transition-colors"
          />
          <h2 className="text-xl font-bold text-primary-100 tracking-tight hover:text-primary-200 transition-colors">
            FastPrep.ai
          </h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
