import { useState } from "react";
import Menu from "@mui/material/Menu";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Timer from "@mui/icons-material/Timer";
import ListItemIcon from "@mui/material/ListItemIcon";

type settingMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: React.SetStateAction<HTMLElement | null>) => void;
};

function SettingMenu({ anchorEl, setAnchorEl }: settingMenuProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          width: 220,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: "50%",
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
      <MenuItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItemIcon>
          <Timer />
        </ListItemIcon>
        <Switch checked={isChecked} onChange={handleSwitchState} />
      </MenuItem>
      <MenuItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItemIcon>
          <Timer />
        </ListItemIcon>
        <Switch checked={isChecked} onChange={handleSwitchState} />
      </MenuItem>
    </Menu>
  );
}

export default SettingMenu;
