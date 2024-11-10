import React from 'react';
import { Projectile as ProjectileType } from '../types/game';

interface ProjectileProps {
  projectile: ProjectileType;
}

const Projectile: React.FC<ProjectileProps> = ({ projectile }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-yellow-400 rounded-full transition-all duration-100"
      style={{
        transform: `translate(${projectile.position.x}px, ${projectile.position.y}px)`,
      }}
    />
  );
};

export default Projectile;
