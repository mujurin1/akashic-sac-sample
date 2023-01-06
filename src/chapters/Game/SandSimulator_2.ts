import { Chapter } from "akashic-sac";
import { ImageDataEntity } from "../../ImageDataEntity";
import { Pixel } from "../../PixelSimulator_2/pixel/Pixel";
import { World } from "../../PixelSimulator_2/World";

export class SandSimulator_2 extends Chapter {
  imageDataEntity: ImageDataEntity;
  world: World;

  init(): void {
    g.game.env.createEntity(g.FilledRect, {
      parent: this.display,
      cssColor: "gray",
      width: g.game.width,
      height: g.game.height
    });

    const world = (this.world = World.create({
      width: 128,
      height: 128
    }));

    const imageDataEntity = (this.imageDataEntity = g.game.env.createEntity(ImageDataEntity, {
      parent: this.display,
      x: 0,
      y: 0,
      width: world.width - 2,
      height: world.height - 2,
      pixelScale: 5,
      touchable: true
    }));

    let targetIndex: number = -1;

    imageDataEntity.onPointDown.add(ev => {
      const pixelX = Math.floor(ev.point.x / imageDataEntity.pixelScale);
      const pixelY = Math.ceil(ev.point.y / imageDataEntity.pixelScale);
      targetIndex = pixelY * world.width + pixelX + 1;
    });
    imageDataEntity.onPointMove.add(ev => {
      if (targetIndex !== -1) {
        const pixelX = Math.floor((ev.point.x + ev.startDelta.x) / imageDataEntity.pixelScale);
        const pixelY = Math.ceil((ev.point.y + ev.startDelta.y) / imageDataEntity.pixelScale);
        targetIndex = pixelY * world.width + pixelX + 1;
      }
    });
    imageDataEntity.onPointUp.add(() => {
      targetIndex = -1;
    });
    imageDataEntity.onUpdate.add(() => {
      if (targetIndex !== -1) world.setPixel(targetIndex, Pixel.coal);
      // targetIndex = -1;
    });

    this.draw();
  }

  update() {
    if (this.world.tick % 3 === 0 && this.world.tick < 100) {
      // this.world.setPixel_XY(30, 1, Pixel.sand);
    }

    this.world.step();
    this.draw();
  }

  draw() {
    const ctx = this.imageDataEntity.context;

    this.imageDataEntity.pixelBuffer;

    for (let dotX = 0; dotX < this.world.width - 2; dotX++) {
      const pixelX = dotX + 1;
      for (let dotY = 0; dotY < this.world.height - 2; dotY++) {
        const dotIndex = (dotY * this.imageDataEntity.canvas.width + dotX) * 4;

        const pixelY = dotY + 1;

        const pixelIndex = pixelY * this.world.width + pixelX;
        const cell = this.world.cells[pixelIndex];
        const color = cell.getColor();

        this.imageDataEntity.pixelBuffer[dotIndex] = color[0];
        this.imageDataEntity.pixelBuffer[dotIndex + 1] = color[1];
        this.imageDataEntity.pixelBuffer[dotIndex + 2] = color[2];
        this.imageDataEntity.pixelBuffer[dotIndex + 3] = color[3];
      }
    }
    this.imageDataEntity.modified();
  }

  show(...args: never[]): void {
    console.log("show Game");

    g.game.env.scene.onUpdate.add(this.update, this);
  }

  hide(): void {
    console.log("hide Game");

    g.game.env.scene.onUpdate.remove(this.update, this);
  }
}

const shapeType = {
  e_circle: 0,
  e_edge: 1,
  e_polygon: 2,
  e_chain: 3,
  e_typeCount: 4
} as const;
