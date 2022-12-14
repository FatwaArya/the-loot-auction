//make component

import React, { Fragment } from "react";
import Router from "next/router";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = ({
  role,
  profileSrc,
}: {
  role?: string | undefined;
  profileSrc?: string | undefined | null;
}) => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white-100 navbar mt-2 py-2 px-6">
        <div className="flex-1">
          <span className="font-silk text-4xl normal-case text-black">
            The Loot
          </span>
        </div>

        <div className="flex-none gap-2">
          <div className="dropdown-end dropdown">
            {/* if doesnt login show login button */}
            {!profileSrc ? (
              <button
                onClick={() => {
                  Router.push("/auth/signin");
                }}
                className="inline-flex items-center rounded-md border border-transparent bg-secondary px-4 py-2 text-base font-medium text-white shadow-sm hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Login
              </button>
            ) : (
              <div>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      {profileSrc && (
                        <Image
                          src={profileSrc}
                          width={250}
                          height={250}
                          alt="User avatar"
                          className="h-12 w-12 rounded-full"
                        />
                      )}{" "}
                    </Menu.Button>
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
                      <div className=" px-4 py-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium lowercase text-green-800">
                          {role}
                        </span>
                      </div>

                      <Menu.Item>
                        {({ active }) =>
                          // use
                          role === "MERCHANT" ? (
                            <Link
                              href="/dashboard/merchant"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Dashboard{" "}
                            </Link>
                          ) : (
                            <Link
                              href="/dashboard/user"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Dashboard{" "}
                            </Link>
                          )
                        }
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              signOut();
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block py-2 pl-4 pr-[122px] text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
