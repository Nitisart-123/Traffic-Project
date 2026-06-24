import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css'

import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Table from "./components/table/Table";
import CrudNode from "./components/crudnode/CrudNode";
import Login from "./components/Login";
import { LanguageProvider } from "./components/languagecontext/LanguageProvider";

function App() {

const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

  return (
    <LanguageProvider>
      <BrowserRouter>

        <Navbar user={user} setUser={setUser} />

        <Routes>

          {/* ทุกคนดูได้ — แสดงข้อมูลทั้งหมดไม่กรองตาม mem_id */}
          <Route path="/" element={<Map />} />

          {/* หน้า Login */}
          <Route path="/login" element={<Login onLogin={setUser} />} />

          {/* 🔒 ต้อง login — กรองข้อมูลตาม mem_id ของผู้ใช้ */}
          <Route
            path="/crudnode"
            element={
              user ? <CrudNode user={user} /> : <Navigate to="/login" />
            }
          />

          {/* 🔒 ต้อง login — กรองข้อมูลตาม mem_id ของผู้ใช้ */}
          <Route
            path="/table"
            element={
              user ? <Table user={user} /> : <Navigate to="/login" />
            }
          />

        </Routes>

      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
