import { EditingSandBox, SandBox } from "../Sandbox";
import { solidIsMove, liquidIsMove, frictionStep } from "./funcs";
import { Pixel } from "./pixel";

export interface PixelType {
  readonly name: string;
  readonly material: "padding" | "empty" | "static" | "liquid" | "solid" | "gus";
  readonly color: readonly [number, number, number, number];
  readonly step: (sandbox: EditingSandBox, index: number, x: number, y: number) => number;
  readonly moveTarget: (sandbox: SandBox, targetIndex: number) => Pixel | undefined;
  /** 摩擦力 */
  readonly friction: number;
}

export const PixelType = {
  /** 画面外の外周を囲う物体 */
  padding: {
    name: "padding",
    material: "padding",
    color: [0x88, 0x88, 0x88, 0x88],
    step: (_sandbox, index) => index,
    moveTarget: () => undefined,
    friction: Number.MAX_SAFE_INTEGER
  },
  /** 空 */
  empty: {
    name: "empty",
    material: "empty",
    color: [0x00, 0x00, 0x00, 0xff],
    step: (_sandbox, index) => index,
    moveTarget: () => undefined,
    friction: Number.MAX_SAFE_INTEGER
  },
  /** 固定物体 */
  static: {
    name: "static",
    material: "static",
    color: [0xff, 0xff, 0xff, 0xff],
    step: (_sandbox, index) => index,
    moveTarget: () => undefined,
    friction: Number.MAX_SAFE_INTEGER
  },
  /** 砂 */
  sand: {
    name: "sand",
    material: "solid",
    color: [0xdc, 0xd3, 0xb2, 0xff],
    // step: solidStep,
    step: frictionStep,
    moveTarget: solidIsMove,
    friction: 1
  },
  /** 泥 */
  dirt: {
    name: "dirt",
    material: "solid",
    color: [0xa9, 0x6e, 0x2d, 0xff],
    // step: solidStep,
    step: frictionStep,
    moveTarget: solidIsMove,
    friction: 20
  },
  /** 石炭 */
  coal: {
    name: "coal",
    material: "solid",
    color: [0x52, 0x4e, 0x4d, 0xff],
    // step: solidStep,
    step: frictionStep,
    moveTarget: solidIsMove,
    friction: 75
  },
  /** 水 */
  water: {
    name: "water",
    material: "liquid",
    color: [0xa9, 0xce, 0xec, 0xff],
    // step: liquidStep,
    step: frictionStep,
    moveTarget: liquidIsMove,
    friction: 0.1
  }
} as const satisfies Record<string, PixelType>;
