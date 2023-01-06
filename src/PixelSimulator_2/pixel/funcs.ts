import { Cell } from "../Cell";
import { World } from "../World";
import { Pixel } from "./Pixel";
import { PixelState } from "./PixelState";
import { PixelType } from "./PixelType";

const dirPower = 20;
const dir_per_one = 45 / 5;

export const pixelStepForSolidOrLiquid = (world: World, cell: Cell): unknown => {
  const { index } = cell;
  const pixel = cell.pixel;
  const pixelState = cell.pixelState;
  pixelState.lastStepTick = world.tick;

  if (
    pixel.type === PixelType.empty ||
    pixel.type === PixelType.static ||
    pixel.type === PixelType.padding
    //
  )
    return;

  // 必ず 180 <= speedDir <= 360 (0はあり得ない前提の計算を行っている)
  move: {
    calcSpeed: {
      // 真下へ落ちる
      if (solidIsMove(world.cells[index + world.width].pixel)) {
        if (pixelState.speed <= 0) {
          pixelState.dir = 270;
          pixelState.speed = pixel.friction + 0.5;
        } else solidSpeedDirSet(pixelState, 270, pixel.friction + 0.5);

        world.pushSidePixe(index, pixelState.speed / 2);

        break calcSpeed;
      }

      if (pixelState.speed <= 0) {
        pixelState.speed = 0;
        break move;
      }

      // 左下・右下への移動 (これは移動を伴う)
      if (
        pixelState.speed > pixel.friction * pixel.weight && //
        (cell.pixelFallSideIsLeft = !cell.pixelFallSideIsLeft)
      ) {
        // 左下に落ちる
        if (solidIsMove(world.cells[index + world.width - 1].pixel)) {
          // solidSpeedDirSet(pixelState, 225, 0.5);
          pixelState.dir = 225;
          // pixelState.speed -= pixel.weight / 3;
          pixelState.speed += 3 / pixel.weight;
          world.pushSidePixe(index, pixelState.speed / 2);
          // world.swapPixel(index, index + world.width - 1);
          break calcSpeed;
        }
        // 右下に落ちる
        if (solidIsMove(world.cells[index + world.width + 1].pixel)) {
          // solidSpeedDirSet(pixelState, 315, 0.5);
          pixelState.dir = 315;
          // pixelState.speed -= pixel.weight / 3;
          pixelState.speed += 3 / pixel.weight;
          world.pushSidePixe(index, pixelState.speed / 2);
          // world.swapPixel(index, index + world.width + 1);
          break calcSpeed;
        }
      } else {
        // 右下に落ちる
        if (solidIsMove(world.cells[index + world.width + 1].pixel)) {
          // solidSpeedDirSet(pixelState, 315, 0.5);
          pixelState.dir = 315;
          // pixelState.speed -= pixel.weight / 3;
          pixelState.speed += 3 / pixel.weight;
          world.pushSidePixe(index, pixelState.speed / 2);
          // world.swapPixel(index, index + world.width + 1);
          break calcSpeed;
        }
        // 左下に落ちる
        if (solidIsMove(world.cells[index + world.width - 1].pixel)) {
          // solidSpeedDirSet(pixelState, 225, 0.5);
          pixelState.dir = 225;
          // pixelState.speed -= pixel.weight / 3;
          pixelState.speed += 3 / pixel.weight;
          world.pushSidePixe(index, pixelState.speed / 2);
          // world.swapPixel(index, index + world.width - 1);
          break calcSpeed;
        }
      }
    }

    if (pixelState.speed > pixel.weight) pixelState.speed = pixel.weight;

    let movedIndex = index;

    // ぶつかり途中で移動終了したので、勢いを別方向へ転換する
    // ちょうど右は0でなく360にすること (移動処理時に狂うので)

    pixelState.speed -= pixel.friction / 2;
    if (pixelState.speed <= 0) {
      pixelState.speed = 0;
      break move;
    }

    // `speed`の小数点以下が有る場合はN+1移動する
    const movePx = Math.ceil(pixelState.speed);
    let targetIndex = index;

    // // 270度(下)の角度`dir_per_one`以内の場合落下のみ 別に特殊場合分けする必要は無いと思う
    // // ピクセルは１回で５マスまでしか移動しないので
    // if (
    //   270 - dir_per_one / 2 <= pixelState.speedDir &&
    //   pixelState.speedDir <= 270 + dir_per_one / 2
    // ) {
    //   movedIndex = index;
    //   targetIndex = index;

    //   for (let movedY = 0; movedY < movePx; movedY++) {
    //     if (solidIsMove(world.cells[(targetIndex += world.width)].pixel)) {
    //       world.swapPixel(movedIndex, targetIndex);
    //       movedIndex = targetIndex;
    //       continue;
    //     }
    //     // ぶつかったので途中で落下終了
    //     // TODO: 落下の勢いを左右へ転換する
    //     // ただし、右方向は0でなく360にすること (移動処理時に狂うので)
    //     break move;
    //   }

    //   // 移動量分を衝突せずに落下した
    //   //特に何もなし
    //   break move;
    // }

    // X軸にもブレる移動

    const downDir = pixelState.dir - 270; // 真下を0として時計回りの角度(-90 <= x <= 90)
    const dirLeft = downDir < 0;
    const minus = dirLeft ? -1 : 1;
    const downDirAbs = downDir * minus;

    let xOneStepPx: number;
    let yOneStepPx: number;
    if (downDirAbs < 45) {
      xOneStepPx = downDirAbs / 45;
      yOneStepPx = 1;
    } else {
      xOneStepPx = 1;
      yOneStepPx = (90 - downDirAbs) / 45;
    }

    let xSteped = 0;
    let yStepd = 0;
    for (let movedPx = 0; movedPx < movePx; movedPx++) {
      pixelState.speed -= movedPx / pixel.friction;
      if (pixelState.speed <= 0) {
        pixelState.speed = 0;
        break move;
      }

      xSteped += xOneStepPx;
      yStepd += yOneStepPx;

      if (xSteped >= 1) {
        xSteped -= 1;
        targetIndex += minus;
      }
      if (yStepd >= 1) {
        yStepd -= 1;
        targetIndex += world.width;
      }

      if (solidIsMove(world.cells[targetIndex].pixel)) {
        world.swapPixel(movedIndex, targetIndex);
        movedIndex = targetIndex;
        continue;
      }

      const dirDif = targetIndex - movedIndex;
      // 真下に移動しようとしてぶつかった
      if (dirDif === world.width) {
        // 左に転換
        if (solidIsMove(world.cells[movedIndex - 1].pixel)) {
          pixelState.dir = 180;
          pixelState.speed -= pixel.friction;
          world.pushSidePixe(movedIndex, pixelState.speed);
        }
        // 右に転換
        else if (solidIsMove(world.cells[movedIndex + 1].pixel)) {
          pixelState.dir = 360;
          pixelState.speed -= pixel.friction;
          world.pushSidePixe(movedIndex, pixelState.speed);
        }
        // 停止
        else {
          pixelState.speed = 0;
        }
      }
      // // 左に移動しようとしてぶつかった
      // else if (dirDif === -1) {
      // }
      // // 右に移動しようとしてぶつかった
      // else if (dirDif === 1) {
      // }
      // // 左下に移動しようとしてぶつかった
      // else if (dirDif === world.width - 1) {
      // }
      // // 右下に移動しようとしてぶつかった
      // // else if (dirDif === world.width + 1) {
      // else {
      // }

      break move;
    }

    // 移動量分を衝突せずに落下した
    //特に何もなし
    break move;
  } // move:
};

export const solidIsMove = (pixel: Pixel): boolean => {
  return (
    pixel.type === PixelType.empty ||
    pixel.type === PixelType.liquid ||
    pixel.type === PixelType.gus
  );
};

/**
 * ピクセルが任意方向への落下する時の状態を計算する
 * @param cell
 * @param dir
 * @param speed
 * @returns
 */
const pixelFallSide = (cell: Cell, dir: number, speed: number): boolean => {
  if (solidIsMove(cell.pixel)) {
    solidSpeedDirSet(cell.pixelState, dir, speed);
    return true;
  }
  return false;
};

/**
 * `solid`の`speedDir`を任意方向へ向ける
 * @param pixelState `speedDir`が必ず0でない値 (180 <= speedDir < 360)
 * @param dir 向かせたい方向
 * @param speed その方向へどれだけ加速させるか
 */
const solidSpeedDirSet = (pixelState: PixelState, dir: number, speed: number): void => {
  // solid の場合必ず 180 <= speedDir < 360 を前提に作っている
  // 条件分岐のところ

  const fallDirPower = pixelState.speed / speed;
  pixelState.speed += speed;

  // 現在左方向へスピードがついている
  if (pixelState.dir < dir) {
    pixelState.dir += dirPower * fallDirPower;
    if (pixelState.dir > dir) pixelState.dir = dir;
  }
  // 現在右方向へスピードがついている
  else if (pixelState.dir > dir) {
    pixelState.dir -= dirPower;
    if (pixelState.dir < dir) pixelState.dir = dir;
  }
};
