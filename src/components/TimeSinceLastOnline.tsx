import React, { useState, useEffect } from 'react';
import { formatTimeSinceLastOnline } from '../utils/timeUtils';

interface TimeSinceLastOnlineProps {
  lastOnlineTimestamp: number;
}

export const TimeSinceLastOnline: React.FC<TimeSinceLastOnlineProps> = ({ 
  lastOnlineTimestamp 
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTimeString(formatTimeSinceLastOnline(lastOnlineTimestamp));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lastOnlineTimestamp]);

  return (
    <div className="time-since-online">
      <strong>Time since last online:</strong> {timeString}
    </div>
  );
};