// import { Chapter } from "akashic-sac";
// import { ImageDataEntity } from "../../ImageDataEntity";
// import { Pixel } from "../../PixelSimulator/pixel/pixel";
// import { PixelType } from "../../PixelSimulator/pixel/PixelType";
// import { SandBox } from "../../PixelSimulator/Sandbox";

// export class SandSimulator extends Chapter {
//   imageDataEntity: ImageDataEntity;
//   sandbox: SandBox;

//   init(): void {
//     g.game.env.createEntity(g.FilledRect, {
//       parent: this.display,
//       cssColor: "gray",
//       width: g.game.width,
//       height: g.game.height
//     });

//     const sandbox = (this.sandbox = SandBox.create({
//       worldWidth: 128,
//       worldHeight: 128
//     }));

//     const imageDataEntity = (this.imageDataEntity = g.game.env.createEntity(ImageDataEntity, {
//       parent: this.display,
//       x: 0,
//       y: 0,
//       width: sandbox.worldWidth - 2,
//       height: sandbox.worldHeight - 2,
//       pixelScale: 5,
//       touchable: true
//     }));

//     imageDataEntity.onPointDown.add(ev => {
//       const pixelX = Math.floor(ev.point.x / imageDataEntity.pixelScale);
//       const pixelY = Math.floor(ev.point.y / imageDataEntity.pixelScale);
//       const index = pixelY * sandbox.worldWidth + pixelX + 1;
//       sandbox.setPixel(Pixel.coal, index);
//     });

//     // this.sandbox.setPixel(Pixel.water, 30, 1);
//     // this.sandbox.setPixel(Pixel.sand, 30, 1);

//     this.draw();
//   }

//   update() {
//     if (this.sandbox.updateCount % 3 === 0 && this.sandbox.updateCount < 1500) {
//       this.sandbox.setPixel_XY(Pixel.sand, 20, 1);
//       this.sandbox.setPixel_XY(Pixel.sand, 21, 1);
//       this.sandbox.setPixel_XY(Pixel.sand, 23, 1);
//     }
//     if (this.sandbox.updateCount % 3 === 1 && this.sandbox.updateCount < 1500) {
//       this.sandbox.setPixel_XY(Pixel.dirt, 60, 1);
//       this.sandbox.setPixel_XY(Pixel.dirt, 61, 1);
//       this.sandbox.setPixel_XY(Pixel.dirt, 63, 1);
//     }
//     if (this.sandbox.updateCount % 3 === 2 && this.sandbox.updateCount < 1500) {
//       this.sandbox.setPixel_XY(Pixel.coal, 100, 1);
//       this.sandbox.setPixel_XY(Pixel.coal, 101, 1);
//       this.sandbox.setPixel_XY(Pixel.coal, 103, 1);
//     }

//     this.sandbox.step();
//     this.draw();
//   }

//   draw() {
//     const ctx = this.imageDataEntity.context;

//     this.imageDataEntity.pixelBuffer;

//     for (let dotX = 0; dotX < this.sandbox.worldWidth - 2; dotX++) {
//       const pixelX = dotX + 1;
//       for (let dotY = 0; dotY < this.sandbox.worldHeight - 2; dotY++) {
//         const dotIndex = (dotY * this.imageDataEntity.canvas.width + dotX) * 4;

//         const pixelY = dotY + 1;

//         const pixelIndex = pixelY * this.sandbox.worldWidth + pixelX;
//         const pixel = this.sandbox.pixelMap[pixelIndex];

//         this.imageDataEntity.pixelBuffer[dotIndex] = pixel.type.color[0];
//         this.imageDataEntity.pixelBuffer[dotIndex + 1] = pixel.type.color[1];
//         this.imageDataEntity.pixelBuffer[dotIndex + 2] = pixel.type.color[2];
//         this.imageDataEntity.pixelBuffer[dotIndex + 3] = pixel.type.color[3];
//       }
//     }
//     this.imageDataEntity.modified();
//   }

//   show(...args: never[]): void {
//     console.log("show Game");

//     g.game.env.scene.onUpdate.add(this.update, this);
//   }

//   hide(): void {
//     console.log("hide Game");

//     g.game.env.scene.onUpdate.remove(this.update, this);
//   }
// }

// const shapeType = {
//   e_circle: 0,
//   e_edge: 1,
//   e_polygon: 2,
//   e_chain: 3,
//   e_typeCount: 4
// } as const;
