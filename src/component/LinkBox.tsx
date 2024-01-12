import { ReactElement } from "react";
import style from "@/styles/_Box.module.scss";
import Link from "next/link";

type Props = {
  icon?: ReactElement;
  link: string;
  query?: string;
  planet?: string; // Add planet prop
};

export default function LinkBox({ icon, link, query, planet }: Props) {
  return (
    <>
      <button className={style.homeBtn} style={{ zIndex: 1 }}>
        <Link
          href={{
            pathname: link,
            query: {
              planet: planet || query, // Use planet if provided, otherwise use query
            },
          }}
          className={style.icon}
        >
          <i className={style.icon}>{icon}</i>
        </Link>
      </button>
    </>
  );
}
