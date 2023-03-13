import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

export default function UserInfoMenu() {
  const { data: sessionData } = useSession();

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        {sessionData ? (
          <div className="flex items-center justify-center ">
            <span className="mr-3 text-white">
              Hey {sessionData.user.name}!
            </span>
            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src={sessionData.user.image || ""}
                alt=""
              />
            </Menu.Button>
          </div>
        ) : (
          <button onClick={() => signIn()} className="text-white">
            Sign in
          </button>
        )}
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/dashboard/my-account"
                className={clsx(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                My Account
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={clsx(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
