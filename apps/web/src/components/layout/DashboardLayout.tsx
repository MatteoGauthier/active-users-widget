import React from "react";
import Navbar from "../dashboard/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-lg">{children}</div>
    </>
  );
}
