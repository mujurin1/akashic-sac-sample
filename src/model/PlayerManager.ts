import { Player } from "./Player";

export interface PlayerManager {
  readonly players: Record<string, Player>;
  addPlayer: (id: string, name: string) => void;
}

const create = (): PlayerManager => {
  const players: Record<string, Player> = {};
  const addPlayer = (id: string, name: string): void => {
    players[id] = Player.create(id, name);
  };

  return {
    players,
    addPlayer
  };
};

export const PlayerManager = {
  create
};
