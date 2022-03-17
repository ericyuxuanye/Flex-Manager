import React, { useState, useMemo, useEffect } from "react";
import { TextField, InputAdornment, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import {
  getUserClasses,
  getAvailableClasses,
  getSelectedClasses,
  addClassToUser,
} from "../firebase";
import { Link } from "react-router-dom";
import Deny from "../no-entry-svgrepo-com.svg";
import "./EditSchedule.css";

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const getClassOnDate = (classes, date) => {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const dateString = `${year}-${month > 8 ? month + 1 : "0" + (month + 1)}-${
    day > 9 ? day : "0" + day
  }`;
  return classes[dateString];
};

function Class(props) {
  const course = props.course;
  const selected = props.selectedClass === course;
  return (
    <div className="EditSchedule__choice">
      <h3>{course}</h3>
      <Button variant="contained" onClick={props.onClick} disabled={selected}>
        {selected ? "Scheduled" : "Schedule"}
      </Button>
    </div>
  );
}

function EditSchedule() {
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState(new Date());
  const [favoriteClasses, setFavoriteClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  // all selected classes for all dates
  const [selectedClasses, setSelectedClasses] = useState({});
  // selected class for current day
  const [selectedClass, setSelectedClass] = useState(undefined);
  const displayedOptions = useMemo(
    () => classes.filter((option) => containsText(option, searchText)),
    [searchText, classes]
  );
  useEffect(() => {
    // get available classes once
    (async () => {
      const docs = await getAvailableClasses();
      setClasses(docs.map((d) => d.id));
    })();
    // get favorite classes once
    (async () => setFavoriteClasses(await getUserClasses()))();
    // get selected class if there is one
    (async () => {
      const selectedClasses = await getSelectedClasses();
      setSelectedClasses(selectedClasses);
      setSelectedClass(getClassOnDate(selectedClasses, new Date()));
    })();
  }, []);

  const addCourse = async (course) => {
    await addClassToUser(date, course);
    const classMap = await getSelectedClasses();
    setSelectedClasses(classMap);
    setSelectedClass(getClassOnDate(classMap, date));
    alert("Scheduled!");
  };

  return (
    <div className="EditSchedule__panel">
      <div className="EditSchedule__header">
        <h1 className="EditSchedule__center">Schedule a meeting</h1>
        <div className="EditSchedule__calendar">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Flex Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
                if (newValue !== null)
                  setSelectedClass(getClassOnDate(selectedClasses, newValue));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </div>
      {date != null && (date.getDay() === 2 || date.getDay() === 3) ? (
        // we only have flex time on certain days
        <>
          {selectedClass !== undefined && (
            <h2 className="EditSchedule__SelectedClass" key={selectedClass}>
              Scheduled class: {selectedClass}
            </h2>
          )}
          <div className="EditSchedule__search">
            <TextField
              size="large"
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </div>
          <div className="EditSchedule__container">
            <div className="EditSchedule__choices">
              <h2>All Classes</h2>
              {displayedOptions.map((x) => (
                <Class
                  key={x}
                  course={x}
                  onClick={() => addCourse(x)}
                  selectedClass={selectedClass}
                />
              ))}
            </div>
            <div className="EditSchedule__choices">
              <h2>Favorite Classes</h2>
              {favoriteClasses.length ? (
                favoriteClasses.map((course) => (
                  <Class
                    key={course}
                    course={course}
                    onClick={() => addCourse(course)}
                    selectedClass={selectedClass}
                  />
                ))
              ) : (
                <p>
                  Choose favorite classes in&nbsp;
                  <Link to="/dashboard/account_settings">Account settings</Link>
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="EditSchedule__middle">
          <img src={Deny} alt="Deny logo" height="300" />
          <p>No flex time this day. Choose another date on the calendar.</p>
        </div>
      )}
    </div>
  );
}

export default EditSchedule;
