export interface Player {
  id: string;
  name: string;
}

export const Player = {
  create(id: string, name: string): Player {
    return { id, name };
  }
} as const;
