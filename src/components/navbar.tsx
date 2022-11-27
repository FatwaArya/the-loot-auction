//make component

import React from "react";
import Router from "next/router";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
                className=" px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
                onClick={() => {
                  Router.push("/auth/login");
                }}
              >
                Login
              </button>
            ) : (
              <div>
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  <div className="w-15 rounded-full">
                    {profileSrc && (
                      <Image
                        src={profileSrc}
                        width={250}
                        height={250}
                        alt="User avatar"
                      />
                    )}{" "}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                >
                  <li className="disabled text-primary">
                    <span className="lowercase ">{role}</span>
                  </li>
                  <li>
                    {/* button redirect to dashboard according to role */}
                    {role === "MERCHANT" ? (
                      <button
                        onClick={() => Router.push("/dashboard/merchant")}
                      >
                        Dashboard
                      </button>
                    ) : (
                      <button onClick={() => Router.push("/dashboard/user")}>
                        Dashboard
                      </button>
                    )}
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex flex-row items-center">
          <ul className="menu menu-compact menu-horizontal flex p-0 ">
            <li tabIndex={0}>
              {role ? (
                <button
                  className="btn-outline btn rounded px-4 font-montserrat text-black "
                  onClick={() => {
                    signOut();
                    Router.push("/");
                  }}
                >
                  Sign out
                </button>
              ) : (
                <button
                  className="btn-outline btn rounded px-4 font-montserrat text-black"
                  onClick={() => {
                    Router.push("/auth/login");
                  }}
                >
                  Sign in
                </button>
              )}
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};
