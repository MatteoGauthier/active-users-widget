import { Project } from "@prisma/client";
import { useClipboard } from "../../hooks/useClipboard";
import CopyIcon from "../svgx/CopyIcon";

type Props = {
  codeSnippet?: {
    highlighted: string;
    raw: string;
  };
  project: Project;
};

export default function ProjectCard({ codeSnippet, project }: Props) {
  const clipboard = useClipboard();

  const cleanedHighlightedCode =
    project.key &&
    codeSnippet?.highlighted?.replace("%PROJECT_ID%", project.key);
  const cleanedRawCode =
    project.key && codeSnippet?.raw?.replace("%PROJECT_ID%", project.key);

  const copy = () => {
    clipboard.copy(cleanedRawCode);
  };

  return (
    <article className="grid grid-cols-6 gap-4 rounded-md border border-slate-100 p-4">
      <div className="col-span-2">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col items-start">
            <span className="rounded-lg font-sans font-medium">
              {project.name}
            </span>
            <span className="py-.5 mt-1 rounded-sm bg-slate-200 px-1 font-mono text-xs font-medium">
              {project.key}
            </span>
          </div>

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
      {cleanedHighlightedCode && (
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
                dangerouslySetInnerHTML={{ __html: cleanedHighlightedCode }}
              ></div>
              <button
                onClick={copy}
                className="flex items-center space-x-1 rounded-lg bg-slate-800 px-2 py-1 text-white"
              >
                <span>Copy</span>
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
