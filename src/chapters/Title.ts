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

/**
 * チャプターにはロジックを含ませない
 * ビュー・イベントの管理をするのみ
 */
export class Title extends Chapter {
  private colorRect: g.FilledRect;
  private nextButton: g.E;
  private joinButton: g.E;
  private lastJoinedPlayer: Label;

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
      }),
      JoinPlayer.createActionSet(data => {
        if (data.sendPlayerId == null) return;
        const player = global.playerManager.players[data.sendPlayerId];
        this.lastJoinedPlayer.text = `参加: ${player.name}`;
        this.lastJoinedPlayer.invalidate();
      })
    );
    //#endregion
  }

  // MEMO: Ttitle は最初に表示されるチャプターなので `show()` で問題なく実行できる必要がある
  show(): void {
    console.log("show Title");
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
