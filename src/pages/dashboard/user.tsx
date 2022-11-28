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
import { toast } from "react-toastify";

export default function dashboard() {
  const { data: userData, status } = useSession();
  const { data: meData, refetch } = trpc.user.me.useQuery();

  const [user, setUser] = useState<User | null | undefined>(meData);
  const [userRole, setUserRole] = useState<string | null | undefined>(
    meData?.role
  );

  const router = useRouter();

  const userId = userData?.user?.id as string;
  const updateUserRole = trpc.user.updateRole.useMutation();
  const getAllItem = trpc.items.getAll.useQuery();
  // if user is merchant redirect to merchant dashboard
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
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
      <div className="bg-primary-500 card w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <h2>Change role</h2>

          {/* make change role form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                role: { value: string };
              };
              const role = target.role.value;
              updateUserRole.mutateAsync(
                {
                  id: userId,
                  role: role as "MERCHANT" | "USER",
                },
                {
                  onSuccess: () => {
                    refetch();
                    setUserRole(role);
                    if (role === "MERCHANT") {
                      router.push("/dashboard/merchant");
                    }
                  },
                  onError: (err) => {
                    toast.error(err.message);
                  },
                }
              );
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                className="select-bordered select w-full max-w-xs"
                name="role"
              >
                <option value="USER">User</option>
                <option value="MERCHANT">Merchant</option>
              </select>
            </div>
            <div className="form-control">
              <button type="submit" className="btn-primary btn-block btn">
                Change role
              </button>
            </div>
          </form>
        </div>
      </div>
      {getAllItem.data && (
        <div className="bg-primary-500 card w-96 shadow-xl">
          <div className="card-body items-center text-center">
            <h2>Items</h2>
            <div className="flex flex-col gap-4">
              {getAllItem.data.map((item) => (
                <div key={item.id}>
                  <p>{item.itemName}</p>
                  <p>{item.price}</p>
                  <Image
                    src={item.image || ""}
                    width={100}
                    height={100}
                    alt={`Auction item for ${item.itemName}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={userData ? () => signOut() : () => signIn()}
      >
        {userData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session?.user || session?.user?.role === "MERCHANT") {
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
