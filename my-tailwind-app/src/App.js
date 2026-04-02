import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventConfirmation from "./pages/EventConfirmation";
import EventPage from "./pages/EventPage";

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
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:eventId/confirmed" element={<EventConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;