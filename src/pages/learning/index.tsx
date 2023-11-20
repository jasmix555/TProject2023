import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Layout from "@/component/Layout";
import Header from "@/component/Header";
import { useState } from "react";
import style from "@/styles/learning.module.scss";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaBook />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};

export default function ChatPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [memo, setMemo] = useState("");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission, you can add your logic here
  };

  return (
    <Layout>
      <Header contents={menus} />
      <div className={style.body}>
        <div className={style.wrapper}>
          <div className={style.title}>
            <h1>新しい単語を見つけにいこう</h1>
            <p>
              次の日(8:30am)に新しい単語を教えてくれるよ！
              <br />
              新しい単語を見つける旅に出よう！
            </p>
          </div>
          <div className={style.contentWrapper}>
            <form onSubmit={handleSubmit}>
              <div className={style.selection}>
                <label htmlFor="language">言語</label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  <option value="" disabled>
                    選択してください
                  </option>
                  <option value="english">English</option>
                  <option value="日本語">日本語</option>
                  <option value="한국어">한국어</option>
                  <option value="中文">中文</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="español">español</option>
                </select>
              </div>
              <div className={style.selection}>
                <label htmlFor="genre">ジャンル</label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                >
                  <option value="" disabled>
                    選択してください
                  </option>
                  <option value="日常会話">日常会話</option>
                  <option value="フォーマール">フォーマール</option>
                </select>
              </div>
              <div className={style.memo}>
                <label htmlFor="memo">メモ</label>
                <textarea
                  id="memo"
                  value={memo}
                  onChange={handleMemoChange}
                  placeholder="例：方言を教えてください"
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
