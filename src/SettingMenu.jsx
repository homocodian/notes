import './Setting.css';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import TimerIcon from '@material-ui/icons/Timer';
import { Switch } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';

export default function SettingMenu({passState,isSettingOpen}) {
  const [state, setState] = useState({
    darkMode: false,
    timer: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(()=>{
    let options = localStorage.getItem("setting");
    if(options !== null){
      setState(JSON.parse(options))
    }
  },[])

  useEffect(() => {
    localStorage.setItem("setting",JSON.stringify(state));
    passState(state);
  }, [state]);

  return (
    <div id="settingMenu" style={isSettingOpen ? {display:"flex"} : {display:""}}>
      <p className="options"><Brightness4Icon />
        <span>
          <Switch
            onChange={handleChange}
            checked={state.darkMode}
            name="darkMode"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </span>
      </p>
      <p className="options"><TimerIcon />
        <span>
          <Switch
            onChange={handleChange}
            checked={state.timer}
            name="timer"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </span>
      </p>
    </div>
  )
}