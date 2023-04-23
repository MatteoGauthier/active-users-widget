import { api } from "@/utils/api";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  avatar: File[];
  followProductUpdates: boolean;
  acceptPolicy: boolean;
  project: {
    name: string;
    allowedOrigin: string;
  };
};

export default function SetupPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>("");
  const { data: sessionData } = useSession();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();
  const { mutateAsync: fetchPresignedUpload } =
    api.bucket.getPresignedUpload.useMutation();

  const { mutateAsync: setupUser } = api.user.setup.useMutation();

  const { data: isKnownUser } = api.user.knownUser.useQuery();

  if (isKnownUser && sessionData?.user.role !== "ADMIN") {
    router.replace("/dashboard");
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let avatar;
    if (data.avatar[0]) {
      // @todo
      const presignedUpload = await fetchPresignedUpload({
        fileName: data.avatar[0].name,
        fileType: data.avatar[0].type,
      });
      const formData = new FormData();
      formData.append("file", data.avatar[0]);
      const upload = await fetch(presignedUpload.signedUploadUrl, {
        method: "PUT",
        body: data.avatar[0],
        headers: {
          "Content-Type": data.avatar[0].type,
        },
      });
      if (upload.ok) {
        avatar = presignedUpload.publicObjectUrl;
      }
    }
    await setupUser({
      email: data.email,
      name: data.name,
      avatar: avatar,
      followProductUpdates: data.followProductUpdates,
      project: {
        name: data.project.name,
        // @todo Include allowed origin to the RPC payload when the feature is available
        // allowedOrigin: data.project.allowedOrigin,
      },
    });
    router.replace({
      pathname: "/dashboard",
      query: { setup: true },
    });
  };

  const handleImageImport = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        setAvatar(event?.target?.result as string);
      });
      if (e.currentTarget && e.currentTarget.files && e.currentTarget.files[0])
        reader.readAsDataURL(e.currentTarget.files[0]);
    },
    []
  );

  const avatarImg = avatar || sessionData?.user?.image || "/avatar.svg";

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="not-prose mb-16 space-y-6"
          >
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
                        id="name"
                        autoComplete="given-name"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Tim Cook"
                        defaultValue={sessionData?.user?.name || ""}
                        {...register("name", { required: true })}
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
                        id="email"
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="tim@apple.com"
                        defaultValue={sessionData?.user?.email || ""}
                        {...register("email", { required: true })}
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
                    <Image
                      src={avatarImg}
                      className="h-12 w-12 rounded-full object-cover text-gray-300"
                      alt="User avatar"
                      width={48}
                      height={48}
                    />

                    <input
                      className="block w-full text-sm text-slate-500
                     file:mr-4 file:rounded-md file:border-0 file:bg-gray-50
                     file:py-2 file:px-4 file:text-sm
                     file:font-semibold file:text-gray-700
                     hover:file:bg-gray-100"
                      type="file"
                      id="formFile"
                      {...register("avatar")}
                      onChange={handleImageImport}
                    />
                  </div>
                </div>

                <div className="col-span-full space-y-3">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="followProductUpdates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        {...register("followProductUpdates")}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="followProductUpdates"
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
                        id="acceptPolicy"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        {...register("acceptPolicy", { required: true })}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="acceptPolicy"
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
                        id="project.name"
                        autoComplete=""
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Tim Cook"
                        {...register("project.name", { required: true })}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col-span-3">
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
                        id="project.allowedOrigin"
                        autoComplete=""
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="example.com, localhost:3000, *"
                        {...register("project.allowedOrigin", {
                          required: true,
                        })}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
              {/* @todo Add loading state */}
              <button
                type="submit"
                className={clsx(
                  "rounded-md bg-indigo-600 px-6 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  isSubmitting && "opacity-50"
                )}
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
