import { RGBA } from "../definitions";
import { PixelType } from "./PixelType";

/**
 * いわゆる砂
 */
export interface Pixel {
  readonly name: string;
  readonly type: PixelType;
  readonly color: RGBA;
  /** 重さ (質量) (最高落下速度) (1 <= x <= 5) */
  readonly weight: number;
  /** 摩擦力 (0.01 <= x <= 1) */
  readonly friction: number;
}

/**
 * いわゆる砂の定義
 */
export const Pixel = {
  /** 画面外の外周を囲う物体 */
  padding: {
    name: "padding",
    type: PixelType.padding,
    color: [0, 0, 0, 0],
    weight: 0,
    friction: 0
  },
  /** 空 */
  empty: {
    name: "empty",
    type: PixelType.empty,
    color: [0x00, 0x00, 0x00, 0xff],
    weight: 0,
    friction: 0
  },
  /** 固定物体 */
  static: {
    name: "static",
    type: PixelType.static,
    color: [0xff, 0xff, 0xff, 0xff],
    weight: 0,
    friction: 0
  },
  /** 砂 */
  sand: {
    name: "sand",
    type: PixelType.solid,
    color: [0xdc, 0xd3, 0xb2, 0xff],
    weight: 3,
    friction: 0.1
  },
  /** 泥 */
  dirt: {
    name: "dirt",
    type: PixelType.solid,
    color: [0xa9, 0x6e, 0x2d, 0xff],
    weight: 5,
    friction: 0.6
  },
  /** 石炭 */
  coal: {
    name: "coal",
    type: PixelType.solid,
    color: [0x52, 0x4e, 0x4d, 0xff],
    weight: 5,
    friction: 0.85
  },
  /** 雪 */
  snow: {
    name: "snow",
    type: PixelType.solid,
    color: [0xe9, 0xee, 0xf3, 0xff],
    weight: 1,
    friction: 0.85
  },
  /** 水 */
  water: {
    name: "water",
    type: PixelType.liquid,
    color: [0xa9, 0xce, 0xec, 0xff],
    weight: 5,
    friction: 0.01
  }
} as const satisfies Record<string, Pixel>;
