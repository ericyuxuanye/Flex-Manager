import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Box,
  Chip,
  OutlinedInput,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VisibilityOff, Visibility, Search } from "@mui/icons-material";
import Button from "../Button";
import "./Account.css";
import {
  getAvailableClasses,
  setUserPassword,
  getUserClasses,
  setUserClasses,
} from "../firebase";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

function Account() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedClasses(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const displayedOptions = useMemo(
    () => classes.filter((option) => containsText(option, searchText)),
    [searchText, classes]
  );
  // fetch classes and selected classes once
  useEffect(() => {
    (async () => {
      const docs = await getAvailableClasses();
      setClasses(docs.map((d) => d.id));
    })();
    (async () => setSelectedClasses(await getUserClasses()))();
  }, []);
  return (
    <div className="Account__panel">
      <h1 className="Account__center">Account Settings</h1>
      <h2 className="Account__center Account__lightgray">
        Below, you can set your favorite classes or reset your password
      </h2>
      <section className="container Account__container">
        <h2 className="Account__center">Favorite Classes</h2>
        <div className="Account__flex-row">
          <FormControl sx={{ m: 1, width: 300, mb: 2 }}>
            <InputLabel id="demo-multiple-chip-label">Classes</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              sx={{ backgroundColor: "white" }}
              value={selectedClasses}
              onChange={handleChange}
              input={
                <OutlinedInput id="select-multiple-chip" label="Classes" />
              }
              onClose={() => setSearchText("")}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      onMouseDown={(e) => e.stopPropagation()}
                      onDelete={() => {
                        setSelectedClasses((prev) =>
                          [...prev].filter((x) => x !== value)
                        );
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              <ListSubheader>
                <TextField
                  size="small"
                  // Autofocus on textfield
                  autoFocus
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
              </ListSubheader>
              {displayedOptions.map((c) => (
                <MenuItem
                  key={c}
                  value={c}
                  style={getStyles(c, selectedClasses, theme)}
                >
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="Account__flex-row">
          <Button
            className="gradient__btn submit__btn"
            onClick={() => {
              setUserClasses(selectedClasses);
            }}
          >
            Submit
          </Button>
        </div>
      </section>
      <section className="container Account__container">
        <h2 className="center">Reset Password</h2>
        <div className="Account__flex-row">
          <TextField
            id="old-password-textfield"
            label="Old Password"
            value={oldPassword}
            type={showOldPassword ? "text" : "password"}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ backgroundColor: "white", mr: 1, mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(_) => setShowOldPassword(!showOldPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="Account__flex-row">
          <TextField
            id="new-password-textfield"
            label="New Password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "white", mr: 1, mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(_) => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="Account__flex-row">
          <Button
            className="gradient__btn reset__btn"
            onClick={() => setUserPassword(oldPassword, password)}
          >
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Account;
