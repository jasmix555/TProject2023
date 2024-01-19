import style from "@/styles/book.module.scss";
import { FaPlus } from "react-icons/fa";

export default function BookHeader() {
  const FilterLanguage = () => {
    return (
      <>
        <select className={style.filterLang}>
          <option value="">All</option>
        </select>
      </>
    );
  };
  const AddWord = () => {
    return (
      <>
        <button className={style.addWord}>
          <FaPlus />
        </button>
      </>
    );
  };

  return (
    <>
      <FilterLanguage />
      <AddWord />
    </>
  );
}
