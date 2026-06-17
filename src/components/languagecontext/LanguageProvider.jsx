import React, { useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { translations } from "./translations";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("th"); // "th" | "en"

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  const value = {
    language,
    setLanguage, // ใช้เลือกภาษาตรง ๆ เช่น setLanguage("en")
    toggleLanguage, // ใช้สลับไป-มาระหว่าง th/en
    t: translations[language], // ดิกชันนารีคำแปลของภาษาปัจจุบัน
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
