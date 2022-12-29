import { Cell, Cells } from "./Cell";

/**
 * セル同士が影響し合った結果を返す\
 * 帰ってくるセルは empty, paling を除いて必ず`frameCount`が渡した値であることを保証する
 * @param frameCount 今のフレーム数
 * @param affect 影響を与えるセル
 * @param affected 影響を受けるセル
 */
export const cellInteraction = (
  frameCount: number,
  affect: Cell,
  affected: Cell
): readonly [Cell, Cell] | null => {
  // affect: 影響する, affected: 影響を受ける
  if (affected === Cells.paling) return null;
  return [affect, affected];
};
