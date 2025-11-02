import './App.css'
import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';
import EventList from './pages/EventList';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<EventList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
