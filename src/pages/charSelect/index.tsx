import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/charSelect.module.scss";

export default function CharSelect() {
  return (
    <LayoutPage>
      <div className={style.header}>
        <h1>アバター選択</h1>
      </div>
    </LayoutPage>
  );
}
