import style from "@/styles/book.module.scss";
import { FaCaretDown, FaPlus } from "react-icons/fa";

export function BookHeader() {
  return (
    <>
      <FilterLanguage />
      <AddWord />
    </>
  );
}

export function FilterLanguage() {
  return (
    <>
      <button className={style.filterLang}>
        All
        <span>
          <FaCaretDown />
        </span>
      </button>
    </>
  );
}

export function AddWord() {
  return (
    <>
      <button className={style.addWord}>
        <FaPlus />
      </button>
    </>
  );
}
