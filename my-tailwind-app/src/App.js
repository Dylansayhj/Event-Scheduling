import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Event from "./pages/Event";import EventPage from "./pages/EventPage";

function App() {
  return (
    <Router>
      <Navbar
        links={[
          { label: "Events", href: "/events" },
        ]}
        ctaLabel="+ New Event"
        ctaHref="/"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/event/:id" element={<EventPage />} />
      </Routes>
    </Router>
  );
}

export default App;