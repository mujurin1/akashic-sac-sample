import { Chapter } from "akashic-sac";

export class Game extends Chapter {
  init(): void {}

  show(...args: never[]): void {
    console.log("show Game");
  }

  hide(): void {
    console.log("hide Game");
  }
}
