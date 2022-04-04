import React from "react";
import Link from "next/link";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div>
      <div className="w-full h-12 bg-white text-lg font-bold flex justify-center items-center">
        {title}
      </div>
      {children}
    </div>
  );
}
