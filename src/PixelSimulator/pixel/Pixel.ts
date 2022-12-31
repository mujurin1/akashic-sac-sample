import { PixelType } from "./PixelType";

export interface Pixel {
  readonly type: PixelType;
}

export const Pixel: { [key in keyof typeof PixelType]: Pixel } = Object.values(PixelType).reduce(
  (current, type) => {
    current[type.name] = {
      type: type
    } as const;
    return current;
  },
  <Record<keyof typeof PixelType, Pixel>>{}
);
