import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { ItemForm } from "../../components/itemForm";

export default function dashboard() {
  const { data: userData, status } = useSession();
  const { data: meData, refetch } = trpc.user.me.useQuery();

  const [user, setUser] = useState<User | null | undefined>(meData);
  const [userRole, setUserRole] = useState<string | null | undefined>(
    meData?.role
  );

  const merchantId = userData?.user?.id as string;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 ">
      <p className="text-center text-2xl ">
        {userData && <span>Logged in as {userData.user?.name}</span>}
        {userData && <span>{userData.user?.id}</span>}
        {userData && <span>you are a {userRole}</span>}
      </p>
      {userData && (
        <Image
          src={userData?.user?.image || ""}
          width={100}
          height={100}
          className="rounded-full"
          alt="User avatar"
        />
      )}
      {/* pass userData to ItemForm */}
      <ItemForm merchantId={merchantId} />

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={userData ? () => signOut() : () => signIn()}
      >
        {userData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
