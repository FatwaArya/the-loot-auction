//import providers,sigin,getSession,csrftoken
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
  NextPageContext,
} from "next";
import Image from "next/image";
import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import Head from "next/head";

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to The Loot</title>
      </Head>
      <div className=" flex h-screen flex-col items-center justify-center bg-[#f0f0d8] bg-[url('/image/topography.svg')]">
        <div className="card w-96 bg-[#f0f0d8] shadow-xl outline-[#f0f0d8]">
          <div className="card-body items-center text-center">
            <h2 className="card-title mb-2 text-black">
              {" "}
              Welcome to <span className="font-silk">The Loot</span>
            </h2>
            <p className="mb-8">We bring the auction to you.</p>
            <div className="card-actions mb-4 justify-center gap-5">
              <button
                className="btn-primary btn outline outline-2"
                onClick={() => {
                  signIn("google");
                }}
              >
                <FaGoogle style={{ marginRight: "8px" }} /> Login with google
              </button>
              <button
                className="btn-primary btn outline outline-2"
                onClick={() => {
                  signIn(
                    "discord"
                    // if error show message
                  );
                }}
              >
                <FaDiscord style={{ marginRight: "8px" }} /> Login with Discord
              </button>
            </div>
          </div>
        </div>
        {/* if failed  to login show toast error */}
      </div>
    </>
  );
};

export default SignIn;
//redirect to specify page if user is logged in
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (session?.user?.role === "MERCHANT") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard/merchant",
      },
    };
  }

  if (session?.user?.role === "USER") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard/user",
      },
    };
  }

  return { props: {} };
}
