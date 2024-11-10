import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Sword } from 'lucide-react';

const Player: React.FC = () => {
  const { playerPosition } = useGameStore();

  return (
    <div
      className="absolute w-8 h-8 flex items-center justify-center transition-all duration-100"
      style={{
        transform: `translate(${playerPosition.x}px, ${playerPosition.y}px)`,
      }}
    >
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <Sword className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

export default Player;