import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import shiki from "shiki";
import CopyIcon from "../components/svgx/CopyIcon";

export default function DashboardPage({
  code,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1">
        <div>
          <h2>Projects</h2>
          <ul>
            <li className="grid grid-cols-6 gap-4 rounded-md border border-slate-100 p-4">
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
                      dangerouslySetInnerHTML={{ __html: code }}
                    ></div>
                    <button className="flex items-center space-x-1 rounded-lg bg-slate-800 px-2 py-1 text-white">
                      <span>Copy</span>
                      <CopyIcon />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
    langs: ["html"],
  });
  return {
    props: {
      code: highlighter.codeToHtml(
        `<script src="https://cdn.jsdelivr.net/npm/active-users-widget" data-active-users-project-id="HEY" type="module" defer async></script>`,
        {
          lang: "html",
        }
      ),
    },
  };
};
