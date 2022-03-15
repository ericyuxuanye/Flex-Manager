import React, { useState, useMemo } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { getUserClasses } from "../firebase";
import "./EditSchedule.css";

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

function EditSchedule() {
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classes, setClasses] = useState([
    "a",
    "b",
    "science",
    "social studies",
  ]);
  const displayedOptions = useMemo(
    () => classes.filter((option) => containsText(option, searchText)),
    [searchText, classes]
  );
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
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </div>
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
        </div>
        <div className="EditSchedule__choices">
          <h2>Favorite Classes</h2>
        </div>
      </div>
    </div>
  );
}

export default EditSchedule;
