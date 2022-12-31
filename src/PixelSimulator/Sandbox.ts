import { Pixel } from "./pixel/pixel";

export const worldWidth = 100;
export const worldHeight = 100;
export const worldSize = worldWidth * worldHeight;

export interface SandBox {
  pixelMap: readonly Pixel[];

  setPixel(pixel: Pixel, x: number, y: number): void;

  // update(): void;
}

export const SandBox = {
  create: (): SandBox => {
    const pixelMap: Pixel[] = new Array(worldSize);
    for (let i = 0; i < pixelMap.length; i++) pixelMap[i] = Pixel.empty;

    return {
      pixelMap,
      setPixel(pixel, x, y) {
        const index = y * worldWidth + x;
        pixelMap[index] = pixel;
      }
    };
  }
};
