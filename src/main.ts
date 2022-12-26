import { initializedStart, InitializedStartOption } from "akashic-sac/lib/index";
import { Title } from "./chapters/title";
import { Game } from "./chapters/Game/Game";
import { serverStart } from "./server/server";
import { JoinPlayer } from "./actions/JoinPlayer";
import * as global from "./global/global";

function main(param: g.GameMainParameterObject): void {
  const options: InitializedStartOption = {
    atsumaruSoloBackgroundColor: "wheat",
    sceneParam: {
      assetIds: ["default_frame"]
    },
    // １つ目のチャプターが最初に呼ばれる
    chapters: [Title, Game],
    serverStart,
    initialized
  };

  debugger;
  g.game.random.generate();

  initializedStart(options, param);
}

const initialized = () => {
  const client = g.game.env.client;
  if (client == null) return;

  client.addActionSet(
    JoinPlayer.createActionSet(data => {
      if (data.sendPlayerId != null) global.playerManager.addPlayer(data.sendPlayerId, data.name);
    })
  );
};

export = main;
