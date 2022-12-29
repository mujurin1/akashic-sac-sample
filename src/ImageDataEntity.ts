export interface ImageDataEntityParameterObject extends g.EParameterObject {
  width: number;
  height: number;
  pixelWidth: number;
  pixelHeight: number;
}

export class ImageDataEntity extends g.E {
  private readonly imageData: ImageData;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  public readonly pixelBuffer: Uint8ClampedArray;
  public readonly pixelScale: number;

  constructor(param: ImageDataEntityParameterObject) {
    super(param);

    if (!g.game.env.server) {
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d")!;
      this.canvas.width = param.pixelWidth;
      this.canvas.height = param.pixelHeight;
      this.imageData = new ImageData(this.canvas.width, this.canvas.height);
      this.pixelBuffer = new Uint8ClampedArray(this.imageData.data.buffer);
      this.pixelScale = this.width / this.canvas.width;
    }
  }

  renderSelf(_renderer: g.Renderer, _camera?: g.Camera | undefined): boolean {
    const ctx = (<any>_renderer).context._context as CanvasRenderingContext2D;
    this.context.putImageData(this.imageData, 0, 0);

    // ctx.save();
    _renderer.save();

    ctx.resetTransform();

    ctx.scale(this.pixelScale, this.pixelScale);
    ctx.drawImage(this.canvas, this.x / this.pixelScale, this.y / this.pixelScale);

    // ctx.resetTransform();
    _renderer.restore();

    return false;
  }
}
