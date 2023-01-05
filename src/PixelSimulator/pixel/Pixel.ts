import { PixelType } from "./PixelType";

export interface Pixel {
  readonly type: PixelType;
  readonly lastUpdate: number;
  readonly speed: number;
  readonly speedDir: "stop" | "fall" | "left" | "right";
}

export const Pixel: { [key in keyof typeof PixelType]: Pixel } = Object.values(PixelType).reduce(
  (current, type) => {
    current[type.name] = {
      type: type,
      lastUpdate: -1,
      speed: 0,
      speedDir: "stop"
    };
    return current;
  },
  <Record<keyof typeof PixelType, Pixel>>{}
);

export const _newPixel = (
  pixel: Pixel,
  speed: number,
  speedDir: Pixel["speedDir"],
  lastUpdate: number
): Pixel => {
  if (speed <= 0 || speedDir === "stop") {
    return {
      ...pixel,
      speed: 0,
      speedDir: "stop",
      lastUpdate
    };
  }

  return {
    ...pixel,
    speed: speed < PixelState.maxSpeed ? speed : PixelState.maxSpeed,
    speedDir,
    lastUpdate
  };
};

export const PixelState = {
  maxSpeed: 100
} as const;
