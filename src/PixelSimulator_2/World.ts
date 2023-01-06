import { Cell } from "./Cell";
import { Pixel } from "./pixel/Pixel";
import { PixelState } from "./pixel/PixelState";
import { PixelType } from "./pixel/PixelType";

export interface World {
  readonly cells: readonly Cell[];
  readonly width: number;
  readonly height: number;
  readonly size: number;
  readonly tick: number;

  setPixel(index: number, pixel: Pixel): void;
  setPixel_XY(x: number, y: number, pixel: Pixel): void;
  swapPixel(index: number, targetIndex: number): void;
  pushSidePixe(index: number, speed: number): void;
  step(): void;
}

export interface WorldParam {
  width: number;
  height: number;
}

export const World = {
  create(param: WorldParam): World {
    const { width, height } = param;
    const size = width * height;
    const cells: Cell[] = new Array(size);

    let tick = 0;

    const world = {
      cells,
      width,
      height,
      size,
      tick,

      setPixel(index, pixel) {
        const cell = cells[index];
        cell.pixel = pixel;
        cell.pixelState = PixelState.new();
      },
      setPixel_XY(x, y, pixel) {
        world.setPixel(y * width + x, pixel);
      },
      swapPixel(index, targetIndex) {
        const tmpP = cells[index].pixel;
        cells[index].pixel = cells[targetIndex].pixel;
        cells[targetIndex].pixel = tmpP;

        const tmpPS = cells[index].pixelState;
        cells[index].pixelState = cells[targetIndex].pixelState;
        cells[targetIndex].pixelState = tmpPS;
      },
      pushSidePixe(index, speed) {
        pushPixel(world, index - 1, speed);
        pushPixel(world, index + 1, speed);
      },
      step() {
        tick += 1;

        for (let y = height - 2; y >= 1; y--) {
          const yIndex = y * width;
          for (let x = 1; x < width - 1; x++) {
            const index = yIndex + x;
            const cell = cells[index];
            const pixel = cell.pixel;
            const pixelState = cell.pixelState;

            if (
              pixel.type === PixelType.empty ||
              pixel.type === PixelType.padding ||
              pixelState.lastStepTick === tick
            )
              continue;

            pixel.type.step(world, cell);
          }
        }
      }
    } satisfies World;

    for (let i = 0; i < size; i++) {
      cells[i] = Cell.create(world, i, Pixel.empty);
    }

    // 外周を囲う
    for (let i = 0; i < width; i++) {
      cells[i].pixel = Pixel.padding;
      cells[size - width + i].pixel = Pixel.padding;
    }
    for (let i = 0; i < height; i++) {
      cells[i * width].pixel = Pixel.padding;
      cells[(i + 1) * width - 1].pixel = Pixel.padding;
    }

    return world;
  }
} as const;

const pushPixel = (world: World, index: number, speed: number): void => {
  const cell = world.cells[index];
  if (
    cell.pixelState.speed === 0 &&
    // world.cells[index - world.width].pixel.type == PixelType.empty &&
    cell.pixel.type === PixelType.solid
  ) {
    cell.pixelState.speed = 1 / ((1 / cell.pixel.friction) * (cell.pixel.weight / 2));
    cell.pixelState.dir = 270;
    cell.pixelState.lastStepTick = world.tick;
  }
};
