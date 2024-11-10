import React from 'react';
import { Skull } from 'lucide-react';
import { Enemy as EnemyType } from '../types/game';

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const colorClass = enemy.type === 'fast' ? 'bg-red-500' : 'bg-purple-500';

  return (
    <div
      className={`absolute w-8 h-8 ${colorClass} rounded-full flex items-center justify-center transition-all duration-100`}
      style={{
        transform: `translate(${enemy.position.x}px, ${enemy.position.y}px)`,
      }}
    >
      <Skull className="w-4 h-4 text-white" />
    </div>
  );
};

export default Enemy;