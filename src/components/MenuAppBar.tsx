import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { PaletteMode } from '@mui/material';
import CustomTooltip from './CustomTooltip';
import { useAuth } from '../context/AuthContext';
import AccountMenu from './AccountMenu';
import { useDrawer } from '../context/DrawerContext';

type MenuAppBarProps = {
  appThemeMode: string,
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>,
}

export default function MenuAppBar({ appThemeMode, setMode }: MenuAppBarProps) {

  const {user} = useAuth();
  const {isDrawerOpen,setDrawerIsOpen} = useDrawer();

  const handleTheme = () => {
    if (appThemeMode === "light") {
      setMode("dark")
    }else{
      setMode("light")
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && 
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={()=>{
                setDrawerIsOpen(!isDrawerOpen);
              }}
            >
              <MenuIcon />
            </IconButton>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes
          </Typography>
          {user ? <AccountMenu /> : null}
          <IconButton
            size="large"
            aria-label="toggle theme"
            onClick={handleTheme}
            color="inherit"
          >
            <CustomTooltip title="Toogle Theme">
              {appThemeMode === "light" ? <DarkModeIcon/>: <LightModeIcon/>}
            </CustomTooltip>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
