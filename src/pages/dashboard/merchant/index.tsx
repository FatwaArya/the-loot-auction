import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { ItemForm } from "../../../components/itemForm";
import { NextPageWithLayout } from "../../_app";
import { MerchantLayout } from "../../../components/merchantLayout";
import ItemTable from "../../../components/itemTable";

const Merchant: NextPageWithLayout = () => {
  const { data: userData, status } = useSession();
  const { data: meData, refetch } = trpc.user.me.useQuery();

  const [user, setUser] = useState<User | null | undefined>(meData);
  const [userRole, setUserRole] = useState<string | null | undefined>(
    meData?.role
  );

  const merchantId = userData?.user?.id as string;

  return (
    <>
      <Head>
        <title>Merchant Item | Watching your Item</title>
      </Head>
      <div>
        {/* pass userData to ItemForm */}

        <ItemTable merchantId={merchantId} />
      </div>
    </>
  );
};

Merchant.getLayout = function getLayout(page: ReactElement) {
  return <MerchantLayout>{page}</MerchantLayout>;
};

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

export default Merchant;
