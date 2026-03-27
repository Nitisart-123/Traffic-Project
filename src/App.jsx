import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Table from "./components/table/Table";
import CrudNode from "./components/crudnode/CrudNode";
import Login from "./components/Login"; // 👈 เพิ่ม

function App() {

const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

  return (
    <BrowserRouter>

      <Navbar user={user} setUser={setUser} />

      <Routes>

        {/* ทุกคนดูได้ */}
        <Route path="/" element={<Map />} />

        {/* หน้า Login */}
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* 🔒 ต้อง login เท่านั้น */}
        <Route
          path="/crudnode"
          element={
            user ? <CrudNode /> : <Navigate to="/login" />
          }
        />

        {/* จะล็อก table ด้วยก็ได้ */}
        <Route
          path="/table"
          element={
            user ? <Table /> : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;