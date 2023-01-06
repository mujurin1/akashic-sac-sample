import { Cell } from "../Cell";
import { World } from "../World";
import { pixelStepForSolidOrLiquid } from "./funcs";

/**
 * いわゆる砂の形態の種類
 */
export interface PixelType {
  readonly name: string;
  readonly step: (world: World, cell: Cell) => void;
}

/**
 * いわゆる砂の形態の種類の定義
 */
export const PixelType = {
  padding: {
    name: "padding",
    step: () => {}
  },
  empty: {
    name: "empty",
    step: () => {}
  },
  static: {
    name: "static",
    step: () => {}
  },
  liquid: {
    name: "liquid",
    step: pixelStepForSolidOrLiquid
  },
  solid: {
    name: "solid",
    step: pixelStepForSolidOrLiquid
  },
  gus: {
    name: "gus",
    step: () => {}
  }
} as const satisfies Record<string, PixelType>;
