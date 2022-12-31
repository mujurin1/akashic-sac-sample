import { Chapter } from "akashic-sac";
import * as box2dWeb from "box2dweb";
import { ImageDataEntity } from "../../ImageDataEntity";

/** 1M何pxか */
const worldWidth = 500;
const worldHeight = 500;
const WORLDSCALE = 1;

export class Game extends Chapter {
  imageDataEntity: ImageDataEntity;

  world: box2dWeb.Dynamics.b2World;

  floor: box2dWeb.Dynamics.b2Body;
  ballBody: box2dWeb.Dynamics.b2Body;

  init(): void {
    const back = g.game.env.createEntity(g.FilledRect, {
      parent: this.display,
      cssColor: "gray",
      width: g.game.width,
      height: g.game.height
    });

    // true:静止したオブジェクトを計算対象から外す
    const world = (this.world = new box2dWeb.Dynamics.b2World(
      new box2dWeb.Common.Math.b2Vec2(0, -10),
      true
    ));

    const fixDef = new box2dWeb.Dynamics.b2FixtureDef();
    fixDef.density = 1.0; // 密度
    fixDef.friction = 0.5; // 摩擦係数
    fixDef.restitution = 0.2; // 反発係数
    const bodyDef = new box2dWeb.Dynamics.b2BodyDef();

    //#region 床
    fixDef.shape = new box2dWeb.Collision.Shapes.b2PolygonShape();
    // 縦1pxのラインを引く
    (<box2dWeb.Collision.Shapes.b2PolygonShape>fixDef.shape).SetAsBox(
      600 / WORLDSCALE,
      1 / WORLDSCALE
    );

    bodyDef.type = box2dWeb.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.Set(0, 400 / WORLDSCALE);

    this.floor = world.CreateBody(bodyDef);
    this.floor.CreateFixture(fixDef); // 世界に突っ込む
    //#endregion 床

    //#region ボール
    fixDef.shape = new box2dWeb.Collision.Shapes.b2CircleShape(30 / WORLDSCALE); // 適当な半径をもつ丸にする
    bodyDef.type = box2dWeb.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = 300 / WORLDSCALE; // 横300の位置に置く
    bodyDef.position.y = 0 / WORLDSCALE; // 高さは0の場所から
    this.ballBody = world.CreateBody(bodyDef);
    this.ballBody.CreateFixture(fixDef); // 世界に突っ込む
    //#endregion

    const imageDataEntity = (this.imageDataEntity = g.game.env.createEntity(ImageDataEntity, {
      parent: this.display,
      x: 0,
      y: 0,
      width: g.game.width,
      height: g.game.height,
      pixelWidth: g.game.width,
      pixelHeight: g.game.height,
      touchable: true
    }));

    this.draw();
  }

  updateWorld() {
    this.world.Step(1 / g.game.fps, 6, 2);
    this.draw();
  }

  draw() {
    const ctx = this.imageDataEntity.context;
    this.ballBody.GetPosition();

    const floorPos = this.floor.GetPosition();
    const floorShape = this.floor.GetFixtureList().GetShape();
    let aabb: box2dWeb.Collision.b2AABB = new box2dWeb.Collision.b2AABB();
    let transform: box2dWeb.Common.Math.b2Transform = new box2dWeb.Common.Math.b2Transform(
      new box2dWeb.Common.Math.b2Vec2(),
      new box2dWeb.Common.Math.b2Mat22()
    );
    floorShape.ComputeAABB(aabb, transform);

    ctx.fillStyle = "lightskyblue";
    ctx.strokeStyle = "deepskyblue";
    console.log(transform.position.x);
    console.log(transform.position.x);
    console.log(aabb.lowerBound.x);
    console.log(aabb.lowerBound.y);
    console.log(aabb.upperBound.x);
    console.log(aabb.upperBound.y);

    ctx.fillRect(
      aabb.lowerBound.x,
      aabb.lowerBound.y,
      aabb.lowerBound.x + aabb.upperBound.x,
      aabb.lowerBound.y + aabb.upperBound.y
    );

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
