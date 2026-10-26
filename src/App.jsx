import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
