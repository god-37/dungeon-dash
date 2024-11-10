import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Player from './components/Player';
import Enemy from './components/Enemy';
import Projectile from './components/Projectile';
import GameUI from './components/GameUI';
import Leaderboard from './components/Leaderboard';
import GameOver from './components/GameOver';

function App() {
  const {
    movePlayer,
    enemies,
    projectiles,
    gameOver,
    addProjectile,
    updateProjectiles,
    updateEnemies,
    spawnEnemy,
  } = useGameStore();

  // Handle keyboard input
  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key);
    };

    const gameLoop = setInterval(() => {
      const speed = 5;
      if (keys.has('ArrowUp') || keys.has('w')) movePlayer(0, -speed);
      if (keys.has('ArrowDown') || keys.has('s')) movePlayer(0, speed);
      if (keys.has('ArrowLeft') || keys.has('a')) movePlayer(-speed, 0);
      if (keys.has('ArrowRight') || keys.has('d')) movePlayer(speed, 0);
    }, 16);

    const handleShoot = (e: MouseEvent) => {
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      addProjectile({
        x: dx / distance,
        y: dy / distance,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleShoot);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleShoot);
      clearInterval(gameLoop);
    };
  }, [movePlayer, addProjectile]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      updateProjectiles();
      updateEnemies();
    }, 16);

    const spawnLoop = setInterval(() => {
      spawnEnemy();
    }, 2000);

    return () => {
      clearInterval(gameLoop);
      clearInterval(spawnLoop);
    };
  }, [updateProjectiles, updateEnemies, spawnEnemy, gameOver]);

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)',
        }}
      />

      <GameUI />
      <Player />
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
      {projectiles.map((projectile) => (
        <Projectile key={projectile.id} projectile={projectile} />
      ))}
      <Leaderboard />
      {gameOver && <GameOver />}
    </div>
  );
}

export default App;
