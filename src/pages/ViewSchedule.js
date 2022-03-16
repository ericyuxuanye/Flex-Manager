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
        console.log(date);
        let someDate = new Date(date);
        console.log(someDate);
        var userTimezoneOffset = someDate.getTimezoneOffset() * 60000;
        let startDate = new Date(someDate.getTime() - userTimezoneOffset);
        events.push({ title: course, start: startDate, end: startDate, allDay: true});
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
