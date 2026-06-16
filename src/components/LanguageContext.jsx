import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);

// ===== คำแปลทั้งหมดของ UI (ไม่เกี่ยวกับข้อมูลที่ดึงจากฐานข้อมูล) =====
const translations = {
  th: {
    navbar: {
      map: "แผนที่การจราจร",
      table: "ตารางข้อมูลการจราจร",
      crud: "จัดการข้อมูลโหนดเซนเซอร์",
      login: "เข้าสู่ระบบ",
      viewMap: "ดูแผนที่",
      viewTable: "ตารางข้อมูล",
      manage: "จัดการโหนด",
      menu: "เมนู",
      logout: "ออกจากระบบ",
      langLabel: "ภาษา",
      langTh: "ไทย",
      langEn: "English",
    },
    map: {
      searchPlaceholder: "ค้นหาชื่อถนน...",
      notFound: "ไม่พบชื่อที่ค้นหา",
      avgSpeed: "ความเร็วเฉลี่ย",
      carCount: "จำนวนรถ",
      statusLabel: "สถานะการจราจร",
      speedUnit: "กม/ชม",
      carUnit: "คัน/นาที",
    },
  },
  en: {
    navbar: {
      map: "Traffic Map",
      table: "Traffic Data Table",
      crud: "Manage Sensor Nodes",
      login: "Login",
      viewMap: "Map",
      viewTable: "Data Table",
      manage: "Manage Nodes",
      menu: "Menu",
      logout: "Logout",
      langLabel: "Language",
      langTh: "Thai",
      langEn: "English",
    },
    map: {
      searchPlaceholder: "Search road name...",
      notFound: "No matching name found",
      avgSpeed: "Average Speed",
      carCount: "Vehicle Count",
      statusLabel: "Traffic Status",
      speedUnit: "km/h",
      carUnit: "veh/min",
    },
  },
};

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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage ต้องถูกใช้ภายใน <LanguageProvider>");
  }
  return context;
}

export default LanguageContext;
