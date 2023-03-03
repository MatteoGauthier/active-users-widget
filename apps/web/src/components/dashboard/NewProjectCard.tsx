import Link from "next/link";
import React from "react";
import PackagePlusIcon from "../svgx/PackagePlusIcon";

export default function NewProjectCard() {
  return (
    <Link
      href="/dashboard/new-project"
      className="flex w-full items-center justify-center space-x-2 rounded-md border border-slate-100 bg-slate-50/40 p-4 py-14 text-slate-800 hover:bg-slate-100"
    >
      <PackagePlusIcon />
      <span>Create new project</span>
    </Link>
  );
}
