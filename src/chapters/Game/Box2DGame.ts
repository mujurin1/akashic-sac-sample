import { Chapter } from "akashic-sac";
import * as box2dWeb from "box2dweb";
import { ImageDataEntity } from "../../ImageDataEntity";

/** 1M何pxか */
const worldWidth = 500;
const worldHeight = 500;
const WORLDSCALE = 1;

export class Box2DGame extends Chapter {
  imageDataEntity: ImageDataEntity;

  world: box2dWeb.Dynamics.b2World;

  floor: box2dWeb.Dynamics.b2Body;
  ballBody: box2dWeb.Dynamics.b2Body;

  debugRenderer: box2dWeb.Dynamics.b2DebugDraw;

  init(): void {
    // true:静止したオブジェクトを計算対象から外す
    const world = (this.world = new box2dWeb.Dynamics.b2World(
      new box2dWeb.Common.Math.b2Vec2(0, 10),
      true
    ));

    const fixDef = new box2dWeb.Dynamics.b2FixtureDef();
    fixDef.density = 1.0; // 密度
    fixDef.friction = 0.5; // 摩擦係数
    fixDef.restitution = 0.2; // 反発係数
    const bodyDef = new box2dWeb.Dynamics.b2BodyDef();

    //#region 床
    fixDef.shape = new box2dWeb.Collision.Shapes.b2PolygonShape();

    bodyDef.type = box2dWeb.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.Set(600, 400); // / WORLDSCALE);
    // 縦、横それぞれ半分の値を指定
    (<box2dWeb.Collision.Shapes.b2PolygonShape>fixDef.shape).SetAsBox(
      600, // / WORLDSCALE,
      1 // / WORLDSCALE
    );

    this.floor = world.CreateBody(bodyDef);
    this.floor.CreateFixture(fixDef); // 世界に突っ込む
    //#endregion 床

    const bodyDef_b = new box2dWeb.Dynamics.b2BodyDef();
    //#region ボール
    fixDef.shape = new box2dWeb.Collision.Shapes.b2CircleShape(30); // / WORLDSCALE); // 半径を指定
    bodyDef_b.position.Set(100, 100); // / WORLDSCALE);
    bodyDef_b.type = box2dWeb.Dynamics.b2Body.b2_dynamicBody;
    this.ballBody = world.CreateBody(bodyDef_b);
    this.ballBody.CreateFixture(fixDef); // 世界に突っ込む
    //#endregion

    const imageDataEntity = (this.imageDataEntity = g.game.env.createEntity(ImageDataEntity, {
      parent: this.display,
      x: 0,
      y: 0,
      width: g.game.width,
      height: g.game.height,
      pixelScale: 1,
      touchable: true
    }));

    const debugDraw = new box2dWeb.Dynamics.b2DebugDraw();
    debugDraw.SetSprite(imageDataEntity.context);
    debugDraw.SetDrawScale(1);
    debugDraw.SetFillAlpha(1);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(
      box2dWeb.Dynamics.b2DebugDraw.e_shapeBit | box2dWeb.Dynamics.b2DebugDraw.e_jointBit
    );

    world.SetDebugDraw(debugDraw);

    this.draw();
  }

  updateWorld() {
    this.world.Step(1 / g.game.fps, 6, 2);
    this.draw();
  }

  draw() {
    const ctx = this.imageDataEntity.context;
    // for (let i = 0; i < this.imageDataEntity.pixelBuffer.length; i++)
    //   this.imageDataEntity.pixelBuffer[i] = 0;
    ctx.clearRect(0, 0, this.imageDataEntity.width, this.imageDataEntity.height);

    // ctx.save();
    // ctx.translate(0, this.imageDataEntity.canvas.height);
    // ctx.scale(1, -1);
    // this.world.DrawDebugData();
    // ctx.restore();
    // this.imageDataEntity.modified();
    // return;

    let body = this.world.GetBodyList();
    while (body) {
      let fix = body.GetFixtureList();

      const pos = body.GetPosition();
      ctx.save();

      ctx.translate(pos.x, pos.y);

      while (fix) {
        const shape = fix.GetShape();
        let aabb: box2dWeb.Collision.b2AABB = new box2dWeb.Collision.b2AABB();
        let transform: box2dWeb.Common.Math.b2Transform = new box2dWeb.Common.Math.b2Transform(
          new box2dWeb.Common.Math.b2Vec2(),
          new box2dWeb.Common.Math.b2Mat22()
        );
        shape.ComputeAABB(aabb, transform);

        const width = Math.abs(aabb.lowerBound.x) + Math.abs(aabb.upperBound.x);
        const height = Math.abs(aabb.lowerBound.y) + Math.abs(aabb.upperBound.y);

        console.log(shape.GetType());

        switch (shape.GetType()) {
          case shapeType.e_circle: {
            ctx.beginPath();
            ctx.arc(
              0, // 中心点X
              0, // 中心点Y
              width, // 半径(radius)
              0, // 円の描画開始角度(startAngle)
              2 * Math.PI, // 円の描画終了角度(endAngle)
              false // 時計回りか(false)、反時計周りか(true)。省略可能でデフォルトはfalse
            );
            ctx.stroke();
            break;
          }
          case shapeType.e_edge: {
            ctx.fillRect(aabb.lowerBound.x, aabb.lowerBound.y, width, height);
            break;
          }
          case shapeType.e_polygon: {
            break;
          }
          case shapeType.e_chain: {
            break;
          }
        }

        fix = fix.GetNext();
      }

      ctx.restore();

      body = body.GetNext();
    }

    // const ballPos = this.floor.GetPosition();
    // const ballShape = this.floor.GetFixtureList().GetShape();
    // // var myObject = this.ballBody.GetUserData();  // null

    // let aabb: box2dWeb.Collision.b2AABB = new box2dWeb.Collision.b2AABB();
    // let transform: box2dWeb.Common.Math.b2Transform = new box2dWeb.Common.Math.b2Transform(
    //   new box2dWeb.Common.Math.b2Vec2(),
    //   new box2dWeb.Common.Math.b2Mat22()
    // );
    // ballShape.ComputeAABB(aabb, transform);

    // ctx.fillStyle = "lightskyblue";
    // ctx.strokeStyle = "deepskyblue";

    // console.log(ballPos.x, ballPos.y);

    // console.log(transform.position.x, transform.position.y);
    // console.log(aabb.lowerBound.x, aabb.lowerBound.y);
    // console.log(aabb.upperBound.x, aabb.upperBound.y);

    // ctx.save();

    // ctx.translate(ballPos.x, ballPos.y);

    // ctx.fillRect(
    //   aabb.lowerBound.x,
    //   aabb.lowerBound.y,
    //   Math.abs(aabb.lowerBound.x) + Math.abs(aabb.upperBound.x),
    //   Math.abs(aabb.lowerBound.y) + Math.abs(aabb.upperBound.y)
    // );
    // ctx.restore();

    this.imageDataEntity.modified();
    // ctx.beginPath();
    // ctx.arc(140, 60, 40, 0, Math.PI * 2, true);
    // ctx.fillStyle = "lightskyblue";
    // ctx.fill();
  }

  show(...args: never[]): void {
    console.log("show Game");

    g.game.env.scene.onUpdate.add(this.updateWorld.bind(this));
  }

  hide(): void {
    console.log("hide Game");

    g.game.env.scene.onUpdate.remove(this.updateWorld.bind(this));
  }
}

const shapeType = {
  e_circle: 0,
  e_edge: 1,
  e_polygon: 2,
  e_chain: 3,
  e_typeCount: 4
} as const;
