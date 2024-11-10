import { create } from 'zustand';
import { Position, Enemy, Projectile } from '../types/game';
import { nanoid } from 'nanoid';

interface GameState {
  score: number;
  health: number;
  level: number;
  playerPosition: Position;
  enemies: Enemy[];
  projectiles: Projectile[];
  gameOver: boolean;
  startTime: number;
  incrementScore: (points: number) => void;
  updateHealth: (amount: number) => void;
  movePlayer: (x: number, y: number) => void;
  spawnEnemy: () => void;
  removeEnemy: (id: string) => void;
  addProjectile: (direction: Position) => void;
  updateProjectiles: () => void;
  updateEnemies: () => void;
  resetGame: () => void;
  getFinalScore: () => number;
}

const GAME_BOUNDS = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const createEnemy = (position: Position): Enemy => ({
  id: nanoid(),
  position,
  health: 100,
  type: Math.random() > 0.8 ? 'fast' : 'basic',
});

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  health: 100,
  level: 1,
  playerPosition: { x: GAME_BOUNDS.width / 2, y: GAME_BOUNDS.height / 2 },
  enemies: [],
  projectiles: [],
  gameOver: false,
  startTime: Date.now(),

  incrementScore: (points) =>
    set((state) => ({ score: state.score + points })),

  updateHealth: (amount) =>
    set((state) => {
      const newHealth = Math.max(0, Math.min(100, state.health + amount));
      return {
        health: newHealth,
        gameOver: newHealth <= 0,
      };
    }),

  movePlayer: (x, y) =>
    set((state) => {
      const newX = Math.max(0, Math.min(GAME_BOUNDS.width - 32, state.playerPosition.x + x));
      const newY = Math.max(0, Math.min(GAME_BOUNDS.height - 32, state.playerPosition.y + y));
      return {
        playerPosition: { x: newX, y: newY },
      };
    }),

  spawnEnemy: () =>
    set((state) => {
      const side = Math.floor(Math.random() * 4);
      let position: Position;

      switch (side) {
        case 0: // top
          position = { x: Math.random() * GAME_BOUNDS.width, y: -32 };
          break;
        case 1: // right
          position = { x: GAME_BOUNDS.width + 32, y: Math.random() * GAME_BOUNDS.height };
          break;
        case 2: // bottom
          position = { x: Math.random() * GAME_BOUNDS.width, y: GAME_BOUNDS.height + 32 };
          break;
        default: // left
          position = { x: -32, y: Math.random() * GAME_BOUNDS.height };
          break;
      }

      return {
        enemies: [...state.enemies, createEnemy(position)],
      };
    }),

  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((enemy) => enemy.id !== id),
    })),

  addProjectile: (direction) =>
    set((state) => ({
      projectiles: [
        ...state.projectiles,
        {
          id: nanoid(),
          position: { ...state.playerPosition },
          direction,
          damage: 25,
        },
      ],
    })),

  updateProjectiles: () =>
    set((state) => ({
      projectiles: state.projectiles
        .map((projectile) => ({
          ...projectile,
          position: {
            x: projectile.position.x + projectile.direction.x * 10,
            y: projectile.position.y + projectile.direction.y * 10,
          },
        }))
        .filter(
          (projectile) =>
            projectile.position.x > -32 &&
            projectile.position.x < GAME_BOUNDS.width + 32 &&
            projectile.position.y > -32 &&
            projectile.position.y < GAME_BOUNDS.height + 32
        ),
    })),

  updateEnemies: () =>
    set((state) => {
      const { playerPosition, enemies, projectiles, removeEnemy, incrementScore } = get();

      const updatedEnemies = enemies.map((enemy) => {
        // Move enemy towards player
        const dx = playerPosition.x - enemy.position.x;
        const dy = playerPosition.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = enemy.type === 'fast' ? 3 : 2;

        const newPosition = {
          x: enemy.position.x + (dx / distance) * speed,
          y: enemy.position.y + (dy / distance) * speed,
        };

        // Check projectile collisions
        let enemyHealth = enemy.health;
        projectiles.forEach((projectile) => {
          const projectileDx = projectile.position.x - enemy.position.x;
          const projectileDy = projectile.position.y - enemy.position.y;
          const projectileDistance = Math.sqrt(
            projectileDx * projectileDx + projectileDy * projectileDy
          );

          if (projectileDistance < 24) {
            enemyHealth -= projectile.damage;
          }
        });

        // Check player collision
        if (distance < 32) {
          state.updateHealth(-10);
        }

        if (enemyHealth <= 0) {
          incrementScore(enemy.type === 'fast' ? 150 : 100);
          removeEnemy(enemy.id);
          return null;
        }

        return {
          ...enemy,
          position: newPosition,
          health: enemyHealth,
        };
      });

      return {
        enemies: updatedEnemies.filter((enemy): enemy is Enemy => enemy !== null),
      };
    }),

  getFinalScore: () => {
    const state = get();
    const timeAlive = Math.floor((Date.now() - state.startTime) / 1000);
    const timeBonus = timeAlive * 10; // 10 points per second
    return state.score + timeBonus;
  },

  resetGame: () =>
    set({
      score: 0,
      health: 100,
      level: 1,
      playerPosition: { x: GAME_BOUNDS.width / 2, y: GAME_BOUNDS.height / 2 },
      enemies: [],
      projectiles: [],
      gameOver: false,
      startTime: Date.now(),
    }),
}));
