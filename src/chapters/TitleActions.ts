import { ActionData } from "akashic-sac";

/**
 * 色を変更するアクション
 */
export class ChangeColor extends ActionData {
  constructor(
    public readonly color: string,
  ) {
    super();
  }
}
