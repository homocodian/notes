import {
  Menu,
  Radio,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import { LightMode as LightModeIcon } from "@mui/icons-material";
import { ChangeEvent, Fragment, useState, MouseEvent } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

type TernaryDarkMode = "system" | "light" | "dark";

function SelectAppTheme() {
  const { setTernaryDarkMode, ternaryDarkMode } = useTernaryDarkMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTernaryDarkMode(event.target.value as TernaryDarkMode);
    handleClose();
  };

  return (
    <Fragment>
      <IconButton
        size="large"
        id="theme-toggle-button"
        aria-label="toggle theme"
        aria-controls={open ? "theme-toggle-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <CustomTooltip title="Toogle Theme">
          <LightModeIcon />
        </CustomTooltip>
      </IconButton>
      <Menu
        id="theme-toggle-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "theme-toggle-button",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <FormControl
          fullWidth
          sx={{
            width: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={ternaryDarkMode}
            onChange={handleChange}
          >
            <FormControlLabel
              value="system"
              control={<Radio />}
              label="Device"
            />
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </FormControl>
      </Menu>
    </Fragment>
  );
}

export default SelectAppTheme;
