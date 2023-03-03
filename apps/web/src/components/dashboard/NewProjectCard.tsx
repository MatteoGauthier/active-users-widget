import React from "react";
import PackagePlusIcon from "../svgx/PackagePlusIcon";

export default function NewProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hover:bg-slate-100 space-x-2 text-slate-800 flex w-full items-center justify-center rounded-md border border-slate-100 bg-slate-50/40 p-4 py-14"
    >
      <PackagePlusIcon />
      <span>Create new project</span>
    </button>
  );
}
