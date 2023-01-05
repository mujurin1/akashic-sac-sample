export interface ImageDataEntityParameterObject extends g.EParameterObject {
  /** `imageData`の幅 */
  width: number;
  /** `imageData`の高さ */
  height: number;
  /** imageDataを描画する倍率 */
  pixelScale: number;
}

export class ImageDataEntity extends g.E {
  public readonly imageData: ImageData;

  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;

  public readonly widthInPixel: number;
  public readonly heightInPixel: number;

  public readonly pixelBuffer: Uint8ClampedArray;
  public readonly pixelScale: number;

  constructor(param: ImageDataEntityParameterObject) {
    const widthInPixel = param.width;
    const heightInPixel = param.height;

    param.width *= param.pixelScale;
    param.height *= param.pixelScale;
    super(param);

    this.widthInPixel = widthInPixel;
    this.heightInPixel = heightInPixel;

    if (!param.pixelScale) param.pixelScale = 1;

    if (!g.game.env.server) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.widthInPixel;
      this.canvas.height = this.heightInPixel;
      this.context = this.canvas.getContext("2d")!;
      this.imageData = new ImageData(this.canvas.width, this.canvas.height);
      this.pixelBuffer = new Uint8ClampedArray(this.imageData.data.buffer);
      this.pixelScale = this.width / this.canvas.width;
    }
  }

  renderSelf(_renderer: g.Renderer, _camera?: g.Camera | undefined): boolean {
    const ctx = (<any>_renderer).context._context as CanvasRenderingContext2D;

    ctx.resetTransform();

    this.context.putImageData(this.imageData, 0, 0);

    ctx.scale(this.pixelScale, this.pixelScale);
    ctx.drawImage(this.canvas, this.x / this.pixelScale, this.y / this.pixelScale);
    ctx.restore();

    return false;
  }
}
