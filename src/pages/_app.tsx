import "../styles/global.css";
import type { AppProps } from "next/app";
import { initializeFirebaseApp } from "@/lib/firebase/firebase";
import { AuthProvider } from "@/feature/provider/AuthProvider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeFirebaseApp();
        setFirebaseInitialized(true);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };

    initializeApp();
  }, []);

  if (!isFirebaseInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Head>
        <title>SpaceLang</title>
        <link rel="icon" href="/Logo/Logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <motion.div key={router.pathname}>
        <Component {...pageProps} />
      </motion.div>
    </AuthProvider>
  );
}

export default App;
