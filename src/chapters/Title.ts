// import { Label } from "@akashic-extension/akashic-label";
import { Label } from "@akashic-extension/akashic-label";
import { resolvePlayerInfo } from "@akashic-extension/resolve-player-info";
import { createFont, createFrameLabel, SwitchChapter } from "akashic-sac";
import { Chapter } from "akashic-sac/lib/Chapter";
import { JoinPlayer } from "../actions/JoinPlayer";
import * as global from "../global/global";
import { Player } from "../model/Player";
import { Game } from "./Game/Game";
import { ChangeColor } from "./TitleActions";
import * as box2dWeb from "box2dweb";

/**
 * チャプターにはロジックを含ませない
 * ビュー・イベントの管理をするのみ
 */
export class Title extends Chapter {
  private colorRect: g.FilledRect;
  private nextButton: g.E;
  private joinButton: g.E;
  private lastJoinedPlayer: Label;

  world: box2dWeb.Dynamics.b2World;
  ballBody: box2dWeb.Dynamics.b2Body;

  init(): void {
    //#region ビューの初期化
    this.colorRect = g.game.env.createEntity(g.FilledRect, {
      parent: this.display,
      cssColor: "orange",
      width: 100,
      height: 100,
      x: 700,
      y: 100,
      touchable: g.game.env.isHost
    });

    this.nextButton = createFrameLabel({
      parent: this.display,
      frame: global.frameAssets.defaultFrame,
      text: "ゲームを開始する",
      x: 650,
      y: 580,
      hidden: !g.game.env.isHost,
      touchable: g.game.env.isHost
    });
    this.joinButton = createFrameLabel({
      parent: this.display,
      frame: global.frameAssets.newFrame,
      text: "参加",
      x: 100,
      y: 580,
      touchable: true
    });
    this.lastJoinedPlayer = g.game.env.createEntity(Label, {
      parent: this.display,
      font: createFont({ size: 40 }),
      text: "",
      lineBreak: false,
      width: 100,
      x: 10,
      y: 10
    });
    //#endregion

    this.joinButton.onPointDown.add(() => {
      resolvePlayerInfo({}, (err, playerInfo) => {
        this.client.sendAction(new JoinPlayer(playerInfo?.name ?? "No-Name"));
      });
      this.joinButton.remove();
    });

    //#region 生主のみ
    if (g.game.env.isHost) {
      this.colorRect.onPointDown.add(() => {
        this.client.sendAction(new ChangeColor(rndomColor()));
      });
      this.nextButton.onPointDown.add(() => {
        this.client.sendAction(SwitchChapter.create(Game));
      });
    }
    //#endregion

    //#region アクションの初期化
    this.actionSets.push(
      ChangeColor.createActionSet(data => {
        this.colorRect.cssColor = data.color;
        this.colorRect.modified();

        world.Step(1 / 60, 6, 2);
      }),
      JoinPlayer.createActionSet(data => {
        if (data.sendPlayerId == null) return;
        const player = global.playerManager.players[data.sendPlayerId];
        this.lastJoinedPlayer.text = `参加: ${player.name}`;
        this.lastJoinedPlayer.invalidate();
      })
    );
    //#endregion

    const WORLDSCALE = 30;
    // true:静止したオブジェクトを計算対象から外す
    const world = (this.world = new box2dWeb.Dynamics.b2World(
      new box2dWeb.Common.Math.b2Vec2(0, -10),
      true
    ));

    const fixDef = new box2dWeb.Dynamics.b2FixtureDef();
    fixDef.density = 1.0; // 密度
    fixDef.friction = 0.5; // 摩擦係数
    fixDef.restitution = 0.2; // 反発係数

    //#region 床
    const bodyDef = new box2dWeb.Dynamics.b2BodyDef();
    fixDef.shape = new box2dWeb.Collision.Shapes.b2PolygonShape();
    // 縦1pxのラインを引く
    (<box2dWeb.Collision.Shapes.b2PolygonShape>fixDef.shape).SetAsBox(
      600 / WORLDSCALE,
      1 / WORLDSCALE
    );

    bodyDef.type = box2dWeb.Dynamics.b2Body.b2_staticBody; // 動くやつはb2_dynamicBody
    bodyDef.position.Set(0, 400 / WORLDSCALE);

    world.CreateBody(bodyDef).CreateFixture(fixDef); // 世界に突っ込む
    //#endregion 床

    //#region ボール
    bodyDef.type = box2dWeb.Dynamics.b2Body.b2_dynamicBody; // 今回は動く物体
    fixDef.shape = new box2dWeb.Collision.Shapes.b2CircleShape(30 / WORLDSCALE); // 適当な半径をもつ丸にする
    bodyDef.position.x = 300 / WORLDSCALE; // 横300の位置に置く
    bodyDef.position.y = 0 / WORLDSCALE; // 高さは0の場所から
    this.ballBody = world.CreateBody(bodyDef);
    this.ballBody.CreateFixture(fixDef); // 世界に突っ込む
    //#endregion
  }

  // MEMO: Ttitle は最初に表示されるチャプターなので `show()` で問題なく実行できる必要がある
  show(): void {
    console.log("show Title");

    const pos = this.ballBody.GetPosition();
    const angle = this.ballBody.GetAngle();
  }

  hide(): void {
    console.log("hide Title");
  }
}

/**
 * ランダムな`cssColor`を返します
 * @returns ランダムな 0-255*3 のrgbカラー
 */
const rndomColor = () => {
  const rnd = () => Math.floor(g.game.localRandom.generate() * 256);
  return `rgb(${rnd()},${rnd()},${rnd()})`;
};
