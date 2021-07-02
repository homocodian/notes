import './Setting.css';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import TimerIcon from '@material-ui/icons/Timer';
import { Switch } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export default function SettingMenu({passState,isSettingOpen,autoDarkModeOn,handleClick,handleNotifications}) {
  const [state, setState] = useState({
    darkMode: false,
    timer: false,
  });

  const handleChange = (event) => {
    if (autoDarkModeOn) {
      handleClick();
      return;
    }
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(()=>{
    let options = localStorage.getItem("setting");
    if(options !== null){
      setState(JSON.parse(options))
    }
  },[])

  useEffect(()=>{
    autoDarkModeOn?setState({
      darkMode:autoDarkModeOn,
      timer:state.timer
    }):setState(state);
  },[autoDarkModeOn])

  let initialRenderOfTimer = useRef(true);

  useEffect(() => {
    localStorage.setItem("setting",JSON.stringify(state));
    passState(state);
  }, [state]);

  useEffect(()=>{
    if(initialRenderOfTimer.current){
      initialRenderOfTimer.current = false;
    }else{
      let message = null;
      if(state.timer === true){
        message="Todo timer turned on"
      }else if(state.timer === false){
        message="Todo timer turned off"
      }
      if(message !== null && autoDarkModeOn === false ){
        handleNotifications(message)
        handleClick()
      }
    }
  },[state.timer]);

  let initialRenderOfDarkMode = useRef(true);

  useEffect(()=>{
    if(initialRenderOfDarkMode.current){
      initialRenderOfDarkMode.current = false;
    }else{
      let message = null;
      if(state.darkMode === true){
        message="Dark mode turned on"
      }else if(state.darkMode === false){
        message="Dark mode turned off"
      }
      if(message !== null && autoDarkModeOn === false ){
        handleNotifications(message)
        handleClick()
      }
    }
  },[state.darkMode]);

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