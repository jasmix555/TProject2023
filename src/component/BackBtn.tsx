import { useRouter } from "next/router";
import { FaRocket } from "react-icons/fa6";

export default function BackBtn() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <button
        onClick={handleBack}
        style={{
          color: "var(--white)",
          fontSize: "2.4rem",
          display: "flex",
          alignItems: "center",
          fontWeight: "500",
          margin: "0 auto",
          padding: "0.8rem 0",
        }}
      >
        <FaRocket style={{ transform: "rotate(225deg)" }} />
        BACK
      </button>
    </>
  );
}
