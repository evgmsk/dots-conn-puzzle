import React, { useState, useEffect } from 'react';
import {modeService} from "../app-services/mode-service";

export interface ITimer {
    starting: boolean,
}

const Timer: React.FC = () => {
    const [seconds, setSeconds] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [pause, setPause] = useState(modeService.pause)

    useEffect(() => {
        const unsubPause = modeService.$pause.subscribe(setPause)
        return unsubPause
    }, [])
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (pause) return () => clearInterval(interval as NodeJS.Timeout);
        interval = setInterval(() => {
            if (seconds === 59) {
                setSeconds(0);
                setMinutes(minutes => minutes + 1);
            } else {
                setSeconds(seconds => seconds + 1);
            }
        }, 1000);
        return () => clearInterval(interval as NodeJS.Timeout);
    }, [seconds, pause]);

    return (
        <div className="puzzle-timer">
            <p>{minutes.toString().padStart(2, '0')}&nbsp;:&nbsp;{seconds.toString().padStart(2, '0')}</p>
        </div>
    );
}

export default Timer;
