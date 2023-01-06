export interface PixelState {
  /** 0 ~ 最高速度(weight 依存) */
  speed: number;
  /** 0|360:右 90:上 180:左 270:下 */
  dir: number;
  lastStepTick: number;
}

export const PixelState = {
  new(): PixelState {
    return {
      speed: 0,
      dir: 0,
      lastStepTick: -1
    };
  }
};
