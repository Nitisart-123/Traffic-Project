import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Table from "./components/table/Table";
import CrudNode from "./components/crudnode/CrudNode";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/table" element={<Table />} />
        <Route path="/crudnode" element={<CrudNode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;