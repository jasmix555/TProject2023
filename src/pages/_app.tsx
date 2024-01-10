// Assuming initializeFirebaseApp returns a Promise
import "../styles/global.css";
import type { AppProps } from "next/app";
import { initializeFirebaseApp } from "@/lib/firebase/firebase";
import { AuthProvider } from "@/feature/provider/AuthProvider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

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
    // You can render a loading spinner or other UI while Firebase is initializing
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <motion.div key={router.pathname}>
        <Component {...pageProps} />
      </motion.div>
    </AuthProvider>
  );
}

export default App;
