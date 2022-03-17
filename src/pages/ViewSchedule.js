import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { getSelectedClasses } from "../firebase";
import "./ViewSchedule.scss";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ViewSchedule() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    (async () => {
      const schedule = await getSelectedClasses();
      const events = [];
      for (const [date, course] of Object.entries(schedule)) {
        let startDate = new Date(date);
        const userTimeOffset = startDate.getTimezoneOffset() * 60000;
        // have to add to convert UTC time to local time
        startDate = new Date(startDate.getTime() + userTimeOffset);
        console.log(startDate);
        if (startDate.getDay() === 2) {
          // tuesday schedule
          startDate.setHours(9, 20);
        } else {
          // wednesday schedule
          startDate.setHours(15);
        }
        let endDate = new Date(startDate.getTime() + 45 * 60000);
        events.push({ title: course, start: startDate, end: endDate, allDay: false});
      }
      console.log(events);
      setEvents(events);
    })();
  }, []);
  return (
    <div className="ViewSchedule__container">
      <h1 className="ViewSchedule__center">Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 220px)" }}
      />
    </div>
  );
}

export default ViewSchedule;
