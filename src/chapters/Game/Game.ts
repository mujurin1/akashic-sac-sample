import { Chapter } from "akashic-sac";
import { ImageDataEntity } from "../../ImageDataEntity";
import { Cell, Cells } from "../../sandbox/Cell";
import { CellTypes } from "../../sandbox/CellType";
import { SandBox, worldHeight, worldSize, worldWidth } from "../../sandbox/SandBox";

export class Game extends Chapter {
  sandbox: SandBox;
  imageDataEntity: ImageDataEntity;

  updateCnt = 0;
  update = 1;

  init(): void {
    const back = g.game.env.createEntity(g.FilledRect, {
      parent: this.display,
      cssColor: "gray",
      width: g.game.width,
      height: g.game.height
    });

    let selectCell: Cell = Cells.sand;

    const cellsBox = g.game.env.createEntity(g.FilledRect, {
      parent: this.display,
      cssColor: "orange",
      width: 70,
      height: CellTypes.length * 35 + 5
    });
    CellTypes.forEach((type, index) => {
      const cellItem = g.game.env.createEntity(g.FilledRect, {
        parent: cellsBox,
        cssColor: type.name === "empty" ? "white" : `rgba(${type.color.join(",")})`,
        x: 5,
        y: index * 35 + 5,
        width: 60,
        height: 30,
        touchable: true
      });
      cellItem.onPointDown.add(() => {
        selectCell = Cells[type.name];
      });
    });

    const imageDataEntity = (this.imageDataEntity = g.game.env.createEntity(ImageDataEntity, {
      parent: this.display,
      x: 100,
      y: 10,
      width: 500,
      height: 500,
      pixelWidth: worldWidth,
      pixelHeight: worldHeight,
      touchable: true
    }));
    const sandbox = (this.sandbox = SandBox.create());

    imageDataEntity.onPointDown.add(ev => {
      const x = Math.floor(ev.point.x / imageDataEntity.pixelScale);
      const y = Math.floor(ev.point.y / imageDataEntity.pixelScale);
      sandbox.setCell(selectCell, x, y);
    });
    imageDataEntity.onPointUp.add(ev => {
      sandbox.setCell(undefined, 0, 0);
    });

    imageDataEntity.modified();

    // const sandboxEnity = g.game.env.createEntity(SandboxEntity, {
    //   parent: back,
    //   x: (g.game.width - 100) / 2,
    //   y: (g.game.height - 100) / 2,
    //   touchable: true,
    //   scale: 10
    // });

    // sandboxEnity.onPointDown.add(ev => {
    //   const x = Math.floor(ev.point.x / sandboxEnity.cellScale);
    //   const y = Math.floor(ev.point.y / sandboxEnity.cellScale);
    //   const index = y * SandboxEntity.widthInCell + x;
    //   console.log(index);

    //   sandboxEnity.cellMap[index] = 1;
    //   sandboxEnity.invalidate();
    // });
  }

  updateSandBox() {
    if (this.updateCnt++ != this.update) return;
    this.updateCnt = 0;

    this.sandbox.update();
    this.sandbox.update();
    this.sandbox.update();

    for (let index = 0; index < worldSize * 4; index += 4) {
      [
        this.imageDataEntity.pixelBuffer[index],
        this.imageDataEntity.pixelBuffer[index + 1],
        this.imageDataEntity.pixelBuffer[index + 2],
        this.imageDataEntity.pixelBuffer[index + 3]
      ] = this.sandbox.map[index >> 2].type.color;
    }
    this.imageDataEntity.modified();
  }

  show(...args: never[]): void {
    console.log("show Game");

    g.game.env.scene.onUpdate.add(this.updateSandBox.bind(this));
  }

  hide(): void {
    console.log("hide Game");

    g.game.env.scene.onUpdate.remove(this.updateSandBox.bind(this));
  }
}

// interface SandboxEntityParameterObject {
//   scene: g.Scene;
//   parent?: g.E | g.Scene;
//   x?: number;
//   y?: number;
//   touchable?: boolean;

//   scale: number;
// }

// class SandboxEntity extends g.E {
//   readonly cellMap: CellType[];
//   readonly imageData: ImageData;

//   static readonly widthInCell: number = 10;
//   static readonly heidthInCell: number = 10;
//   static readonly sizeInCell: number = SandboxEntity.widthInCell * SandboxEntity.heidthInCell;

//   readonly cellScale: number;

//   readonly widthInPixel: number;
//   readonly heightInPixel: number;
//   readonly sizeInPixel: number;

//   constructor(param: SandboxEntityParameterObject) {
//     super({
//       ...param,
//       width: param.scale * SandboxEntity.widthInCell,
//       height: param.scale * SandboxEntity.heidthInCell
//     });

//     this.cellScale = param.scale;
//     this.widthInPixel = SandboxEntity.widthInCell * this.cellScale;
//     this.heightInPixel = this.widthInPixel;
//     this.sizeInPixel = SandboxEntity.sizeInCell * this.cellScale * this.cellScale;

//     this.cellMap = new Array(SandboxEntity.sizeInCell);
//     for (let i = 0; i < this.cellMap.length; i++) this.cellMap[i] = CellType.empty;

//     const pixelImageData = new Uint8ClampedArray(this.sizeInPixel * 4);
//     // 透明度だけセットしておく
//     for (let i = 0; i < this.sizeInPixel; i++) {
//       pixelImageData[i * 4 + 0] = 255;
//       pixelImageData[i * 4 + 1] = 255;
//       pixelImageData[i * 4 + 2] = 255;
//       pixelImageData[i * 4 + 3] = 255;
//     }

//     this.imageData = new ImageData(pixelImageData, this.widthInPixel);

//     this.invalidate();
//   }

//   invalidate() {
//     // １マップサイズ分
//     for (let cellY = 0; cellY < SandboxEntity.heidthInCell; cellY++) {
//       for (let cellX = 0; cellX < SandboxEntity.widthInCell; cellX++) {
//         const cellIndex = cellY * SandboxEntity.widthInCell + cellX;
//         const cell = this.cellMap[cellIndex];

//         // 今注目しているセルの１つ目のピクセルのインデックス
//         const pixelOffset = cellY * (this.widthInPixel * this.cellScale) + cellX * this.cellScale;
//         // １砂サイズ分
//         for (let pixelY = 0; pixelY < this.cellScale; pixelY++) {
//           // stride: 画像処理系でのY軸1当たりの変化量
//           const stride = this.widthInPixel;
//           for (let pixelX = 0; pixelX < this.cellScale; pixelX++) {
//             const pixelIndex = pixelOffset + pixelY * stride + pixelX;
//             const imageDataIndex = pixelIndex * 4;
//             // RGBA
//             this.imageData.data[imageDataIndex] = cell << 8;
//             this.imageData.data[imageDataIndex + 1] = cell << 8;
//             this.imageData.data[imageDataIndex + 2] = cell << 8;
//             // this.imageData.data[imageDataIndex + 3];
//           }
//         }
//       }
//     }
//     this.modified();
//   }

//   renderSelf(_renderer: Renderer, _camera?: Camera | undefined): boolean {
//     const ctx = (<any>_renderer).context._context as CanvasRenderingContext2D;

//     ctx.putImageData(this.imageData, this.x, this.y);

//     return false;
//   }
// }
