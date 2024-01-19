import style from "@/styles/book.module.scss";
import { FaPlus } from "react-icons/fa";

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
      <select className={style.filterLang}>
        <option value="">All</option>
      </select>
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
