export const arrayBufferToDataURL = async (
  arrayBuffer: ArrayBuffer,
  type: string,
  quality: number
): Promise<string> => {
  const blob = new Blob([arrayBuffer]);
  const bmp = await createImageBitmap(blob);
  const { cnv } = imageBitmapToCnvCnt(bmp);
  return cnv.toDataURL(type, quality);
};

export const base64ToImageBitmap = (base64: string): Promise<ImageBitmap> => {
  const array = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const blob = new Blob([array.buffer]);
  return createImageBitmap(blob);
};

export const imageBitmapToCnvCnt = (
  bmp: ImageBitmap
): { cnv: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const cnv: HTMLCanvasElement = document.createElement("canvas");
  cnv.width = bmp.width;
  cnv.height = bmp.height;
  const ctx = cnv.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0);

  return { cnv, ctx };
};
