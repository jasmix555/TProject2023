import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "@/styles/saveMessageModal.module.scss";

type SaveMessageModalProps = {
  onSave: (selectedWords: string[], meaning: string) => void;
  onCancel: () => void;
  selectedMessage: string;
};

const SaveMessageModal: React.FC<SaveMessageModalProps> = ({
  onSave,
  onCancel,
  selectedMessage,
}) => {
  const [selectedWords, setSelectedWords] = useState<string[]>(
    selectedMessage.split(", ")
  );
  const [meaning, setMeaning] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Add isOpen state

  const handleSave = () => {
    onSave(selectedWords, meaning);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={style.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={style.background} onClick={onCancel}></div>
          <motion.div
            className={style.content}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <p className={style.title}>
              テキストをタップすると、編集ができるよ！
              冒険の記録を完成させよう！
            </p>
            <div className={style.input}>
              <p>単語</p>
              <input
                id="selectedMessage"
                name="selectedMessage"
                type="text"
                value={selectedWords.join(", ")}
                onChange={(e) => setSelectedWords(e.target.value.split(", "))}
              />
            </div>
            <div className={style.input}>
              <p>単語の意味</p>
              <input
                id="meaning"
                name="meaning"
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
              />
            </div>
            <div className={style.button}>
              <button onClick={handleSave} className={style.save}>
                Save
              </button>
              <button onClick={onCancel} className={style.back}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveMessageModal;
