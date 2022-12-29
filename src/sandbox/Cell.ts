import { CellType } from "./CellType";

export interface Cell {
  readonly type: CellType;

  /** 最後に影響を与えた/受けたフレーム */
  readonly affectFrame: number | undefined;
  /** 最後に移動したフレーム */
  readonly moveFrame: number | undefined;
}

export const Cells = Object.values(CellType).reduce((current, type) => {
  current[type.name] = { type: type, affectFrame: undefined, moveFrame: undefined };
  return current;
}, <Record<keyof typeof CellType, Cell>>{});
