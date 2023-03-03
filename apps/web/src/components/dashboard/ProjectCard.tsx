import React from "react";
import CopyIcon from "../svgx/CopyIcon";

type Props = {
  codeSnippet: string;
};

export default function ProjectCard({ codeSnippet }: Props) {
  return (
    <article className="grid grid-cols-6 gap-4 rounded-md border border-slate-100 p-4">
      <div className="col-span-2">
        <div className="flex items-center justify-between space-x-2">
          <span className="rounded-lg bg-slate-200 py-1 px-2 font-mono font-medium">
            matteogauthier.fr
          </span>

          <div className="inline-flex items-center space-x-1 rounded-sm border border-gray-200 px-2 py-1">
            <span className="text-xs text-gray-800">Active</span>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <span className="text-sm text-slate-600">
              Visits in the last 30 minutes :{" "}
              <span className="font-bold">0</span>
            </span>
          </div>
          <div>
            <span className="text-sm text-slate-600">
              Total visits : <span className="font-bold">0</span>
            </span>
          </div>
        </div>{" "}
      </div>
      <div className="col-span-4">
        <div className=" rounded-md bg-gradient-to-br from-slate-50 to-slate-200 px-3 py-3">
          <h3 className="mb-2 text-lg font-medium leading-none text-slate-700">
            Integrate the widget
          </h3>
          <p>
            Add the following code to the <code>&lt;head&gt;</code> tag
          </p>
          <div className="mt-2 flex space-x-2">
            <div
              className="code-block"
              dangerouslySetInnerHTML={{ __html: codeSnippet }}
            ></div>
            <button className="flex items-center space-x-1 rounded-lg bg-slate-800 px-2 py-1 text-white">
              <span>Copy</span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
