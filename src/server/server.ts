import { Server } from "akashic-sac";
import { JoinPlayer } from "../actions/JoinPlayer";
import { ChangeColor } from "../chapters/TitleActions";
import { Player } from "../model/Player";
import { PlayerManager } from "../model/PlayerManager";

const playerManager = PlayerManager.create();

export const serverStart = (server: Server) => {
  server.addActionSet(ChangeColor.createActionSet(server.broadcast_bind));
  server.addActionSet(
    JoinPlayer.createActionSet(data => {
      server.broadcast(data);
      joinPlayer(data);
    })
  );
};

const joinPlayer = (data: JoinPlayer): void => {
  if (data.sendPlayerId != null) playerManager.addPlayer(data.sendPlayerId, data.name);
};
