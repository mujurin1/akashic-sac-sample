import { ActionData } from "akashic-sac";

/**
 * プレイヤー参加
 */
export class JoinPlayer extends ActionData {
  constructor(
    public readonly name: string,
  ) {
    super();
  }
}
