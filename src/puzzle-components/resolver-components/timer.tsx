import React, { useState, useEffect } from 'react';

export interface ITimer {
    starting: boolean,
}

const Timer: React.FC<ITimer> = (props: ITimer) => {
    const [seconds, setSeconds] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const starting = props.starting

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (!starting) return () => clearInterval(interval as NodeJS.Timeout);
        interval = setInterval(() => {
            if (seconds === 59) {
                setSeconds(0);
                setMinutes(minutes => minutes + 1);
            } else {
                setSeconds(seconds => seconds + 1);
            }
        }, 1000);
        return () => clearInterval(interval as NodeJS.Timeout);
    }, [seconds, starting]);

    return (
        <div className="puzzle-resolver_top-panel_timer-wrapper">
            <p>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
        </div>
    );
}

export default Timer;
