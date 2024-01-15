import { useAuthContext } from "@/feature/provider/AuthProvider";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext();
  const { push } = useRouter();

  if (typeof user === "undefined") {
    return (
      <div
        style={{
          fontSize: "5rem",
          textAlign: "center",
          display: "flex",
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </div>
    );
  }

  if (user === null) {
    push("/welcome");
    return null;
  }

  return <>{children}</>;
};
