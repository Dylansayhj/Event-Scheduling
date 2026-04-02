import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getEventData, getOverlaps, getConfirmed } from "../api/api";

import EventSidebar from "../components/EventSidebar";
import CalendarGrid from "../components/CalendarGrid";
import TimeSlotPanel from "../components/TimeSlotPanel";

function getDatesWithResponses(eventId) {
  const data = JSON.parse(localStorage.getItem(eventId)) || {};
  const dateCounts = {};
  Object.values(data).forEach((userDates) => {
    Object.entries(userDates).forEach(([dateKey, slots]) => {
      if (slots?.length > 0) {
        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
      }
    });
  });
  return dateCounts;
}

function getAllOverlaps(eventId) {
  const data = getEventData(eventId);
  const allDates = new Set();
  Object.values(data).forEach((userDates) => {
    Object.keys(userDates).forEach((dateKey) => allDates.add(dateKey));
  });
  const result = {};
  allDates.forEach((dateKey) => {
    result[dateKey] = getOverlaps(eventId, dateKey);
  });
  return result;
}

export default function EventPage() {
  const { id: eventId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const eventName = state?.name || "Group Event";
  const eventDescription = state?.description || "";

  // 1. Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  // 2. User & event data state
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [overlaps, setOverlaps] = useState({});
  const [confirmed, setConfirmed] = useState(getConfirmed(eventId));
  const [allNames, setAllNames] = useState(Object.keys(getEventData(eventId)));
  const [datesWithResponses, setDatesWithResponses] = useState(getDatesWithResponses(eventId));
  const [allOverlaps, setAllOverlaps] = useState(getAllOverlaps(eventId));

  const totalUsers = allNames.length;

  // 3. Update overlaps when a new date is selected
  useEffect(() => {
    if (selectedDate) {
      setOverlaps(getOverlaps(eventId, selectedDate));
      setSelectedSlots([]);
    }
  }, [selectedDate, eventId]);

  // 4. Called by TimeSlotPanel after a save — refreshes data then navigates to confirmation
  const handleSave = (name) => {
    setAllNames(Object.keys(getEventData(eventId)));
    setDatesWithResponses(getDatesWithResponses(eventId));
    setAllOverlaps(getAllOverlaps(eventId));
    if (selectedDate) setOverlaps(getOverlaps(eventId, selectedDate));

    navigate(`/event/${eventId}/confirmed`, {
      state: { name: eventName, description: eventDescription },
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex flex-col md:flex-row">

      {/* Left Panel */}
      <EventSidebar
        eventName={eventName}
        eventDescription={eventDescription}
        allNames={allNames}
        confirmed={confirmed}
        eventId={eventId}
        allOverlaps={allOverlaps}
        setConfirmed={setConfirmed}
      />

      {/* Right Panel */}
      <div className="flex-1 p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-start">

        <CalendarGrid
          calYear={calYear}
          calMonth={calMonth}
          setCalYear={setCalYear}
          setCalMonth={setCalMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          datesWithResponses={datesWithResponses}
          totalUsers={totalUsers}
        />

        <TimeSlotPanel
          selectedDate={selectedDate}
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
          overlaps={overlaps}
          setOverlaps={setOverlaps}
          totalUsers={totalUsers}
          eventId={eventId}
          onSave={handleSave}
        />

      </div>
    </div>
  );
}