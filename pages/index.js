import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect } from "react";
import AuthContext from "../hooks/useAuth";
import Dash from "../components/dash";
import cookie from 'cookie';

export default function Home({user}) {

  const {setUser} = useContext(AuthContext)

  useEffect(() => {
    setUser(user);
  }, [])


  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!user ? (  
      <div className="h-screen flex justify-center items-center space-x-20">
        <Link href="/registerpage">
          <a className="text-links text-md font-bold font-inter">Register</a>
        </Link>
        <h1 className="font-bold text-inter text-2xl">|</h1>
        <Link href="/loginpage">
          <a className="text-links text-md font-bold font-inter">Login</a>
        </Link>
      </div> ) : ( <Dash /> )}
    </div>
  );
}

export let getServerSideProps = async ({ req }) => {
  const cookies = cookie.parse(req.headers.cookie);
  if (cookies.refresh) {
    const body = {
      refresh: cookies.refresh,
    };
    const { data } = await axios.post(
      "http://127.0.0.1:8000/users/dj-rest-auth/token/refresh/",
      body
    );
    if (data && data.access) {
      const userConfig = {
        headers: {
          Authorization: "Bearer " + data.access,
        },
      };
      console.log(userConfig);
      const { data: userData } = await axios.get(
        "http://127.0.0.1:8000/users/dj-rest-auth/user/",
        userConfig
      );
      return {
        props: {
          user: userData,
        },
      };
    }
  } else {
    return {
      props: {
        user: null,
      },
    };
  }
  // return {
  //   props: {
  //     user: userData
  //   },
  // }
};
