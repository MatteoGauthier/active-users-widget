import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React from "react";

export default function SetupPage() {
  const { data: sessionData } = useSession();

  return (
    <div>
      <div className="mx-auto mt-8 max-w-screen-lg">
        <div className="mx-auto">
          <header className="mb-6">
            <h2 className="mt-8 mb-2 font-display text-3xl font-semibold">
              Welcome ! 🚀
            </h2>
            <p className="text-lg text-slate-700">
              Setup your project and start counting users on your website
            </p>
          </header>
          <form className="not-prose mb-16 space-y-6">
            <div className="rounded-md  border border-gray-900/10 px-6 py-4 pb-8">
              <div className="-mx-6 -my-4 rounded-t-md border-b border-gray-900/10 bg-slate-100/40 px-6 py-4">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Simple infos about you, and your preferences
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Tim Cook"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="tim@apple.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <UserCircleIcon
                      className="h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="col-span-full space-y-3">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-900"
                      >
                        Want to follow product updates ?
                      </label>
                      <p className="text-gray-500">
                        Product updates, news (not spammy I promise)
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        required
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="candidates"
                        className="font-medium text-gray-900"
                      >
                        Usage Policy (Required){" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <p className="text-gray-500">
                        To use Active User Widget you must accept the CGU
                        avalaible here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md  border border-gray-900/10 px-6 py-4 pb-12">
              <div className="-mx-6 -my-4 rounded-t-md border-b border-gray-900/10 bg-slate-100/40 px-6 py-4">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Your project
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Details about the website where you want to track users
                  presences
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-3">
                  <label
                    htmlFor="project.name"
                    className="inline-flex flex-col"
                  >
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Project name
                    </span>
                    <span className="font-sans text-xs text-gray-500">
                      In order to recognize your site in the dashboard
                    </span>
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="project.name"
                        id="project.name"
                        autoComplete=""
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Tim Cook"
                        defaultValue={sessionData?.user.name || ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="project.allowedOrigin"
                    className="inline-flex flex-col "
                  >
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Allowed Origin
                    </span>
                    <span className="font-sans text-xs text-gray-500">
                      Domain name allowed to capture user presence event
                    </span>
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="project.allowedOrigin"
                        id="project.allowedOrigin"
                        autoComplete=""
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-6 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Let&apos;s start 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
