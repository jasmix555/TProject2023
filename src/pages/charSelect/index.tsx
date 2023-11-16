import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/charSelect.module.scss";

export default function CharSelect() {
  return (
    <LayoutPage>
      <div className={style.header}>
        <h1>アバター選択</h1>
      </div>
      <div className={style.carouselWrapper}>
        <div className={style.characterWrap}></div>

        <div className={style.carouselBtnWrapper}>
          <div className={style.left}>
            <button></button>
          </div>
          <div className={style.right}>
            <button></button>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
