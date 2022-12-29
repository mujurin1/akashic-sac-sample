export interface CellType {
  readonly name: string;
  readonly material: "empty" | "fixed" | "liquid" | "solid" | "gas";
  readonly color: readonly [number, number, number, number];

  /** 重さ. 0は固定の物体 */
  readonly weight: number;
}

export const CellType = {
  paling: {
    name: "paling",
    material: "fixed",
    color: [0xff, 0xff, 0xff, 0xff],
    weight: 0
  },
  empty: {
    name: "empty",
    material: "empty",
    color: [0xff, 0xff, 0xff, 0x00],
    weight: 0
  },
  sand: {
    name: "sand",
    material: "solid",
    color: [0xed, 0xdb, 0x37, 0xff],
    weight: 1
  },
  water: {
    name: "water",
    material: "liquid",
    color: [0x08, 0x6f, 0xff, 0xff],
    weight: 1
  },
  gasA: {
    name: "gasA",
    material: "gas",
    color: [0x25, 0x25, 0x25, 0xff],
    weight: 1
  }
} as const satisfies Record<string, CellType>;

export const CellTypes = Object.values(CellType).filter(cell => cell.name !== "paling");
