import { useRouter } from "next/router";
import React from "react";
import { api } from "../../utils/api";

export default function NewProjectPage() {
  const router = useRouter()
  const mutation = api.project.create.useMutation({
    onSuccess(data, variables, context) {
      router.push(`/dashboard/${data.id}`)
      console.log("onSuccess", data, variables, context);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    mutation.mutate({
      name: data.name as string,
    });
  };

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="mt-6 mb-4 font-display text-4xl font-semibold text-slate-800">
        Create new project
      </h1>

      <form onSubmit={handleSubmit} method="POST">
        <div className="max-w-screen-sm overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="flex flex-col space-y-6">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
