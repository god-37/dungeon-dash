import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Trophy, Clock } from 'lucide-react';

const GameUI: React.FC = () => {
  const { score, health, level, startTime } = useGameStore();
  const [timeAlive, setTimeAlive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAlive(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-800 bg-opacity-75 text-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span>{health}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-blue-500" />
          <span>{timeAlive}s</span>
        </div>
      </div>
      <div className="text-lg font-bold">Level {level}</div>
    </div>
  );
};

export default GameUI;