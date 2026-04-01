import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar
        links={[
          { label: "How it works", href: "#how-it-works" },
          { label: "Events", href: "/events" },
        ]}
        ctaLabel="+ New Event"
        ctaHref="/new"
      />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;