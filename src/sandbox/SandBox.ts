import { cellInteraction } from "./affectCell";
import { Cell, Cells } from "./Cell";

export const worldWidth = 100;
export const worldHeight = 100;
export const worldSize = worldWidth * worldHeight;

export interface SandBox {
  map: Cell[];

  setCell(cell: Cell | undefined, x: number, y: number): void;

  update(): void;
}

export const SandBox = {
  create: (): SandBox => {
    const map: Cell[] = new Array(worldSize);
    for (let i = 0; i < map.length; i++) map[i] = Cells.empty;
    // for (let i = worldSize - worldWidth * 20; i < map.length; i++) map[i] = Cells.water;
    // for (let i = worldSize - worldWidth * 10; i < map.length; i++) map[i] = Cells.gasA;

    // 外周を囲う
    for (let i = 0; i < worldWidth; i++) {
      map[i] = Cells.paling;
      map[i + worldWidth * (worldHeight - 1)] = Cells.paling;
    }
    for (let i = 0; i < worldHeight; i++) {
      map[worldWidth * i] = Cells.paling;
      map[worldWidth * (i + 1) - 1] = Cells.paling;
    }

    let frameCount = 0;
    let setCell: Cell | undefined = undefined;
    let setCellIndex: number = 0;

    return {
      map,
      setCell: (cell, x, y) => {
        setCell = cell;
        setCellIndex = y * worldWidth + x;
      },
      update: () => {
        if (setCell != null) {
          // if (map[setCellIndex] !== Cells.paling) map[setCellIndex] = setCell;
          for (let i = -2; i < 3; i++) {
            if (map[setCellIndex + i] !== Cells.paling) map[setCellIndex + i] = setCell;
          }
        }

        frameCount++;
        for (let y = worldHeight - 1; y >= 0; y--) {
          cellsLoop: for (let x = 0; x < worldWidth; x++) {
            const index = x + y * worldWidth;
            let cell = map[index];

            if (
              cell === Cells.empty ||
              cell === Cells.paling ||
              cell.moveFrame === frameCount ||
              cell.affectFrame === frameCount
            )
              continue;

            // cell が周囲(8 cell)に与える影響を計算する
            const affectedIndiced = neighborIndices(x, y);
            for (let i = 0; i < affectedIndiced.length; i++) {
              const affectedIndex = affectedIndiced[i];
              const affectedCell = map[affectedIndex];
              const result = cellInteraction(frameCount, cell, affectedCell);
              if (result == null) continue;

              const [newCell, newAffectedCell] = result;
              const oldCell = cell;

              map[index] = cell = newCell;
              map[affectedIndex] = newAffectedCell;

              if (cell === Cells.empty) continue cellsLoop;

              // 影響を与えて自身が変化した場合、それはこのターンで別のセルに影響を与えるか？
              // 与える場合、更に移動を行うか？
              if (cell.type !== oldCell.type) continue cellsLoop;
            }

            // セルの移動を計算する
            switch (cell.type.material) {
              case "solid": {
                const sitaIndex = index + worldWidth;
                let targetIndex: number;

                if (
                  map[sitaIndex].moveFrame !== frameCount &&
                  map[sitaIndex].type.material !== "solid" &&
                  map[sitaIndex].type.material !== "fixed"
                )
                  targetIndex = sitaIndex;
                else if (
                  map[sitaIndex - 1].moveFrame !== frameCount &&
                  map[sitaIndex - 1].type.material !== "solid" &&
                  map[sitaIndex - 1].type.material !== "fixed"
                )
                  targetIndex = sitaIndex - 1;
                else if (
                  map[sitaIndex + 1].moveFrame !== frameCount &&
                  map[sitaIndex + 1].type.material !== "solid" &&
                  map[sitaIndex + 1].type.material !== "fixed"
                )
                  targetIndex = sitaIndex + 1;
                else break;

                [map[index], map[targetIndex]] = [
                  map[targetIndex] === Cells.empty
                    ? Cells.empty
                    : {
                        ...map[targetIndex],
                        moveFrame: frameCount
                      },
                  {
                    ...map[index],
                    moveFrame: frameCount
                  }
                ];

                break;
              }
              case "liquid": {
                const sitaIndex = index + worldWidth;
                let targetIndex: number;

                if (
                  map[sitaIndex].moveFrame !== frameCount &&
                  map[sitaIndex].type.material !== "solid" &&
                  map[sitaIndex].type.material !== "liquid" &&
                  map[sitaIndex].type.material !== "fixed"
                )
                  targetIndex = sitaIndex;
                else if (
                  map[sitaIndex - 1] === Cells.empty ||
                  (map[sitaIndex].moveFrame !== frameCount &&
                    map[sitaIndex - 1].type.material === "gas")
                )
                  targetIndex = sitaIndex - 1;
                else if (
                  map[sitaIndex + 1] === Cells.empty ||
                  map[sitaIndex].type.material === "liquid" ||
                  (map[sitaIndex].moveFrame !== frameCount &&
                    map[sitaIndex + 1].type.material === "gas")
                )
                  targetIndex = sitaIndex + 1;
                else if (
                  map[index - 1] === Cells.empty ||
                  (map[index - 1].moveFrame !== frameCount &&
                    map[index - 1].type.material === "gas")
                )
                  targetIndex = index - 1;
                else if (
                  map[index + 1] === Cells.empty ||
                  (map[index + 1].moveFrame !== frameCount &&
                    map[index + 1].type.material === "gas")
                )
                  targetIndex = index + 1;
                else break;

                [map[index], map[targetIndex]] = [
                  map[targetIndex] === Cells.empty
                    ? Cells.empty
                    : {
                        ...map[targetIndex],
                        moveFrame: frameCount
                      },
                  {
                    ...map[index],
                    moveFrame: frameCount
                  }
                ];

                break;
              }
              case "gas": {
                const ueIndex = index - worldWidth;
                let targetIndex: number;

                if (
                  map[ueIndex].moveFrame !== frameCount &&
                  map[ueIndex].type.material !== "gas" &&
                  map[ueIndex].type.material !== "fixed"
                )
                  targetIndex = ueIndex;
                else if (map[ueIndex - 1] === Cells.empty) targetIndex = ueIndex - 1;
                else if (map[ueIndex + 1] === Cells.empty) targetIndex = ueIndex + 1;
                else if (map[index - 1] === Cells.empty) targetIndex = index - 1;
                else if (map[index + 1] === Cells.empty) targetIndex = index + 1;
                else break;

                [map[index], map[targetIndex]] = [
                  map[targetIndex] === Cells.empty
                    ? Cells.empty
                    : {
                        ...map[targetIndex],
                        moveFrame: frameCount
                      },
                  {
                    ...map[index],
                    moveFrame: frameCount
                  }
                ];

                break;
              }
            }
          }
        }
      }
    };
  }
};

/**
 * 周囲８マスのインデックスを配列で返す
 */
const neighborIndices = (x: number, y: number): number[] => {
  const index = y * worldWidth + x;
  const top = index - worldWidth;
  const sita = index + worldWidth;
  //prettier-ignore
  return [
    top-1, top, top+1,
    index-1, index+1,
    sita-1, sita, sita+1
  ];
};
const neighborIndices_ = (x: number, y: number): number[] => {
  const index = y * worldWidth + x;

  // 四つ角、左上から右、最後に右下
  if (x === 0 && y === 0) return [1, worldWidth + 1, worldWidth + 2];
  if (x === worldWidth - 1 && y === 0) return [x - 1, x * 2, x * 2 + 1];
  if (x === 0 && y === worldHeight - 1)
    return [worldWidth * (y - 1) + 1, worldWidth * (y - 1) + 2, worldWidth * y + 2];
  if (x === worldWidth - 1 && y === worldHeight - 1)
    return [worldWidth * y - 1, worldWidth * y, worldWidth * (y + 1) - 1];

  // 左端
  if (x === 0) {
    // 左上
    if (y === 0) return [1, worldWidth, worldWidth + 1];
    const top = index - worldWidth;
    // 左下
    if (y === worldHeight - 1) return [top, top + 1, index + 1];
    const sita = index + worldWidth;
    return [top, top + 1, index + 1, sita, sita + 1];
  }
  // 右端
  if (x === worldWidth - 1) {
    // 右上
    const sita = index + worldWidth;
    if (y === 0) return [index - 1, sita - 1, sita];
    // 右下
    const top = index - worldWidth;
    if (y === worldHeight - 1) return [top - 1, top, index - 1];
    return [top - 1, top, index - 1, sita - 1, sita];
  }

  const top = index - worldWidth;
  const sita = index + worldWidth;

  //prettier-ignore
  return [
    top-1,   top,  top+1,
    index-1,       index+1,
    sita-1,  sita, sita+1,
  ];
};
