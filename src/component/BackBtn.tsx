// import { useRouter } from "next/router";
import { FaRocket } from "react-icons/fa6";
import Link from "next/link";

type BackBtnProps = {
  link: string;
};

export default function BackBtn({ link }: BackBtnProps) {
  return (
    <>
      <Link href={link}>
        <button
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
      </Link>
    </>
  );
}
