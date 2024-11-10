export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  position: Position;
  health: number;
  type: 'basic' | 'fast' | 'boss';
}

export interface Projectile {
  id: string;
  position: Position;
  direction: Position;
  damage: number;
}
