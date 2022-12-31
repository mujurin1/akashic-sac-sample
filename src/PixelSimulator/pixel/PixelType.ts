export interface PixelType {
  readonly name: string;
  readonly material: "empty" | "fixed";
  readonly color: readonly [number, number, number, number];
}

export const PixelType = {
  // /** 画面の外を囲うもの */
  // paling: {
  //   name: "paling",
  //   material: "fixed",
  //   color: [0xff, 0xff, 0xff, 0xff],
  //   weight: 0
  // },
  /** 何も存在しない */
  empty: {
    name: "empty",
    material: "empty",
    color: [0xff, 0xff, 0xff, 0x00]
  },
  /** 固定物体 */
  fixed: {
    name: "fixed",
    material: "fixed",
    color: [0x00, 0x00, 0x00, 0xff]
  }
} as const satisfies Record<string, PixelType>;

// export const PixelTypes = Object.values(PixelType).filter(pixel => pixel.name !== "paling");
