import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton.js';
import SettingsButton from './SettingsButton.js';
import { useContext, useState, useEffect, useRef} from 'react';
import SettingsContext from './SettingsContext.js';


const blue = '#3d48db';
const green = '#4aec8c';


function Timer() {
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); //work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused)
    const modeRef = useRef(mode);

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes)*60;
        setMode(nextMode);
        modeRef.current = nextMode;

        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;

    }

    function tick() {
        secondsLeftRef.current--; // is the same as (secondsLeftRef.current - 1);
        setSecondsLeft(secondsLeftRef.current);
    }

    function initTimer() {
        secondsLeftRef.current = settingsInfo.workMinutes*60;
        setSecondsLeft(secondsLeftRef.current);
    }


    useEffect(() => {    
    initTimer();
    
     const interval = setInterval(() => {
        if (isPausedRef.current) {
            return;
        }
        if (secondsLeftRef.current === 0) {
            return switchMode();
        }

        tick();
        },1000);

        return () => clearInterval(interval);
    }, [settingsInfo]);



    const totalSeconds = mode === 'work' 
    ? settingsInfo.workMinutes*60 
    : settingsInfo.breakMinutes*60;
    const percentage = Math.round(secondsLeft / totalSeconds*100);

    const minutes = Math.floor(secondsLeft/60); 
    let seconds = secondsLeft%60;
    if (seconds < 10) seconds = '0' + seconds;


    return (
    <div>
        <div>
        Let's get Studying!
        </div>
        <CircularProgressbar 
        value={percentage} 
        text={minutes + ':' + seconds} 
        styles={buildStyles({
    textColor: '#fff',
    pathColor: mode === 'work' ? blue : green, 
    //used blue because studies show that the color blue increases productivity
    tailColor: 'rgba(255,255,255,.2)',
        })}/>
        
        <div style={{marginTop: '30px'}}>
            {isPaused 
            ? <PlayButton onClick={() => {setIsPaused(false); isPausedRef.current = false;}}/> 
            : <PauseButton onClick={() => {setIsPaused(true); isPausedRef.current = true;}}/>}

        </div>
        <div style={{marginTop:'20px'}}>
            <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
        </div>
        
    </div>
    );
}

export default Timer;
