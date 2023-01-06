import { RGBA } from "./definitions";
import { Particle } from "./Particle";
import { Pixel } from "./pixel/Pixel";
import { PixelState } from "./pixel/PixelState";
import { World } from "./World";

/**
 * 砂シミュレータの最小単位セル
 */
export interface Cell {
  // ワールド上の座標
  readonly index: number;
  readonly x: number;
  readonly y: number;

  // いわゆる砂とその状態
  pixel: Pixel;
  pixelState: PixelState;
  /** 前回左下と右下どっちに先に落ちたか */
  pixelFallSideIsLeft: boolean;

  // いわゆるパーティクルとその状態
  particle: Particle | undefined;

  // 適当な状態
  getColor(): RGBA;

  step(): void;
}

export const Cell = {
  create(world: World, index: number, pixel: Pixel): Cell {
    const x = index % world.width;
    const y = Math.ceil(index / world.width);

    let pixelState = PixelState.new();
    let particle: Cell["particle"];

    return {
      index,
      x,
      y,
      // pixel
      get pixel() {
        return pixel;
      },
      set pixel(value) {
        pixel = value;
      },
      get pixelState() {
        return pixelState;
      },
      set pixelState(value) {
        pixelState = value;
      },
      pixelFallSideIsLeft: false,
      // particle
      particle,
      //other
      getColor() {
        return pixel?.color ?? emptyColor;
      },

      // method
      step() {
        //
      }
    };
  }
} as const;

const emptyColor = [0x00, 0x00, 0x00, 0xff] as const;
