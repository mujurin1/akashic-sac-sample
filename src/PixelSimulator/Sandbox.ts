import { Pixel } from "./pixel/pixel";

export interface SandBoxParameter {
  worldWidth: number;
  worldHeight: number;
}

export interface SandBox {
  readonly pixelMap: readonly Pixel[];
  readonly worldWidth: number;
  readonly worldHeight: number;
  readonly worldSize: number;
  readonly updateCount: number;

  setPixel_XY(pixel: Pixel, x: number, y: number): void;

  setPixel(pixel: Pixel, index: number): void;

  step(): void;
}

/**
 * ピクセルが操作するためのサンドボックス
 */
export interface EditingSandBox extends SandBox {
  swapPixel(index: number, targetIndex: number): void;
  /**
   * `targetIndex`位置のピクセルを`index`に移動し`pixel`を`targetIndex`位置に入れる\
   * `index`位置のピクセルは上書き (消失) する
   * @param index
   * @param targetIndex
   * @param pixel
   */
  swapedSetPixel(index: number, targetIndex: number, pixel: Pixel): void;
}

export const SandBox = {
  create: (param: SandBoxParameter): SandBox => {
    const worldWidth = param.worldWidth;
    const worldHeight = param.worldHeight;
    const worldSize = worldWidth * worldHeight;
    const pixelMap: Pixel[] = new Array(worldSize);

    let updateCount = 0;

    //#region pixelMap の初期化
    for (let i = 0; i < pixelMap.length; i++) pixelMap[i] = Pixel.empty;

    // 外周を囲う
    for (let i = 0; i < worldWidth; i++) {
      pixelMap[i] = Pixel.padding;
      pixelMap[worldSize - worldWidth + i] = Pixel.padding;
    }
    for (let i = 0; i < worldHeight; i++) {
      pixelMap[i * worldWidth] = Pixel.padding;
      pixelMap[(i + 1) * worldWidth - 1] = Pixel.padding;
    }
    //#endregion pixelMap の初期化

    const editingSandBox = {
      pixelMap,
      worldWidth,
      worldHeight,
      worldSize,
      get updateCount() {
        return updateCount;
      },
      setPixel_XY(pixel, x, y) {
        const index = y * worldWidth + x;
        pixelMap[index] = pixel;
      },
      setPixel(pixel, index) {
        pixelMap[index] = pixel;
      },
      step() {
        updateCount++;

        for (let y = worldHeight - 2; y >= 1; y--) {
          const yIndex = y * worldWidth;
          for (let x = 1; x < worldWidth - 1; x++) {
            const index = yIndex + x;
            const pixel = pixelMap[index];

            if (
              pixel.type.material === "empty" ||
              pixel.type.material === "padding" ||
              pixel.lastUpdate === updateCount
            )
              continue;

            pixel.type.step(editingSandBox, index, x, y);
          }
        }
      },

      //#region EditingSandBox
      swapPixel(index, targetIndex) {
        const tmp = pixelMap[index];
        pixelMap[index] = pixelMap[targetIndex];
        pixelMap[targetIndex] = tmp;
      },
      swapedSetPixel(index, targetIndex, pixel) {
        pixelMap[index] = pixelMap[targetIndex];
        pixelMap[targetIndex] = pixel;
      }
      //#endregion EditingSandBox
    } satisfies EditingSandBox;

    return editingSandBox;
  }
};
