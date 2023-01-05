import { EditingSandBox, SandBox } from "../Sandbox";
import { Pixel, PixelState, _newPixel } from "./pixel";

// export const solidStep = (sandbox: EditingSandBox, index: number, x: number, y: number): Pixel => {
//   const bottomIndex = index + sandbox.worldWidth;

//   const pixel = sandbox.pixelMap[index];

//   let targetPixel: Pixel | undefined;

//   if ((targetPixel = solidIsMove(sandbox, bottomIndex))) {
//     const newPixel: Pixel = {
//       ...pixel,
//       speed: 5,
//       speedDir: "fall",
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex, newPixel);
//     return newPixel;
//   }
//   if ((targetPixel = solidIsMove(sandbox, bottomIndex - 1))) {
//     const newPixel: Pixel = {
//       ...pixel,
//       speed: 5,
//       speedDir: "fall",
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex, newPixel);
//     return newPixel;
//   }
//   if ((targetPixel = solidIsMove(sandbox, bottomIndex + 1))) {
//     const newPixel: Pixel = {
//       ...pixel,
//       speed: 5,
//       speedDir: "fall",
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex, newPixel);
//     return newPixel;
//   }

//   if (pixel.speed === 0) return pixel;

//   if (pixel.speedDir !== "right" && (targetPixel = solidIsMove(sandbox, index - 1))) {
//     const newSpeed = pixel.speed - 1;

//     let newPixel: Pixel;
//     if (newSpeed > 0) {
//       newPixel = {
//         ...pixel,
//         speed: newSpeed,
//         speedDir: "left",
//         lastUpdate: sandbox.updateCount
//       };
//       sandbox.swapedSetPixel(index, index - 1, newPixel);
//     } else {
//       newPixel = {
//         ...pixel,
//         speed: 0,
//         speedDir: "stop",
//         lastUpdate: sandbox.updateCount
//       };
//     }

//     return newPixel;
//   }

//   if (pixel.speedDir !== "left" && (targetPixel = solidIsMove(sandbox, index + 1))) {
//     const newSpeed = pixel.speed - 1;

//     let newPixel: Pixel;
//     if (newSpeed > 0) {
//       newPixel = {
//         ...pixel,
//         speed: newSpeed,
//         speedDir: "right",
//         lastUpdate: sandbox.updateCount
//       };
//       sandbox.swapedSetPixel(index, index + 1, newPixel);
//     } else {
//       newPixel = {
//         ...pixel,
//         speed: 0,
//         speedDir: "stop",
//         lastUpdate: sandbox.updateCount
//       };
//     }

//     return newPixel;
//   }

//   return {
//     ...pixel,
//     lastUpdate: sandbox.updateCount
//   };
// };

// export const liquidStep = (sandbox: EditingSandBox, index: number, x: number, y: number): Pixel => {
//   // const pixel = sandbox.pixelMap[index];

//   const bottomIndex = index + sandbox.worldWidth;
//   const pixel = sandbox.pixelMap[index];

//   if (liquidIsMove(sandbox, bottomIndex)) {
//     const newPixel: Pixel = {
//       ...pixel,
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex, newPixel);
//     return newPixel;
//   }
//   if (liquidIsMove(sandbox, bottomIndex - 1)) {
//     const newPixel: Pixel = {
//       ...pixel,
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex - 1, newPixel);
//     return newPixel;
//   }
//   if (liquidIsMove(sandbox, bottomIndex + 1)) {
//     const newPixel: Pixel = {
//       ...pixel,
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, bottomIndex + 1, newPixel);
//     return newPixel;
//   }

//   if (liquidIsMove(sandbox, index - 1)) {
//     const newPixel: Pixel = {
//       ...pixel,
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, index - 1, newPixel);
//     return newPixel;
//   }
//   if (liquidIsMove(sandbox, index + 1)) {
//     const newPixel: Pixel = {
//       ...pixel,
//       lastUpdate: sandbox.updateCount
//     };
//     sandbox.swapedSetPixel(index, index + 1, newPixel);
//     return newPixel;
//   }

//   return {
//     ...pixel,
//     lastUpdate: sandbox.updateCount
//   };
// };

export const frictionStep = (
  sandbox: EditingSandBox,
  index: number,
  x: number,
  y: number
): number => {
  const pixel = sandbox.pixelMap[index];
  const bottomIndex = index + sandbox.worldWidth;

  let targetPixel: Pixel | undefined;
  let newSpeed = pixel.speed;

  if ((targetPixel = pixel.type.moveTarget(sandbox, bottomIndex))) {
    const newPixel = _newPixel(pixel, newSpeed + 10, "fall", sandbox.updateCount);
    sandbox.swapedSetPixel(index, bottomIndex, newPixel);

    pushPixel(sandbox, index - 1, newSpeed + 8, "left");
    pushPixel(sandbox, index + 1, newSpeed + 8, "right");

    return bottomIndex;
  }

  if (pixel.speedDir === "stop") {
    const newPixel = _newPixel(pixel, 0, "stop", sandbox.updateCount);
    sandbox.setPixel(newPixel, index);

    return index;
  }

  newSpeed -= 8;

  if (newSpeed < pixel.type.friction) {
    const newPixel = _newPixel(pixel, newSpeed, "fall", sandbox.updateCount);
    sandbox.setPixel(newPixel, index);

    return index;
  }

  if (
    pixel.speedDir !== "left" &&
    (targetPixel = pixel.type.moveTarget(sandbox, bottomIndex + 1))
  ) {
    const newPixel = _newPixel(pixel, newSpeed + 10, "fall", sandbox.updateCount);
    sandbox.swapedSetPixel(index, bottomIndex + 1, newPixel);

    pushPixel(sandbox, bottomIndex + 2, newSpeed + 8, "right");

    return bottomIndex + 1;
  }
  if (
    pixel.speedDir !== "right" &&
    (targetPixel = pixel.type.moveTarget(sandbox, bottomIndex - 1))
  ) {
    const newPixel = _newPixel(pixel, newSpeed + 10, "fall", sandbox.updateCount);
    sandbox.swapedSetPixel(index, bottomIndex - 1, newPixel);

    pushPixel(sandbox, bottomIndex - 2, newSpeed + 8, "left");

    return bottomIndex - 1;
  }

  if (pixel.speedDir === "fall" || pixel.speedDir === "right") {
    if ((targetPixel = pixel.type.moveTarget(sandbox, index + 1))) {
      const newPixel = _newPixel(pixel, newSpeed, "right", sandbox.updateCount);
      sandbox.swapedSetPixel(index, index + 1, newPixel);
      return index - 1;
    } else {
      const newPixel = _newPixel(pixel, newSpeed, "left", sandbox.updateCount);
      sandbox.setPixel(newPixel, index);

      pushPixel(sandbox, index + 1, newSpeed, "right");

      return index;
    }
  }

  // if (pixel.speedDir === "left") {
  if ((targetPixel = pixel.type.moveTarget(sandbox, index - 1))) {
    const newPixel = _newPixel(pixel, newSpeed, "left", sandbox.updateCount);
    sandbox.swapedSetPixel(index, index - 1, newPixel);
    return index - 1;
  } else {
    const newPixel = _newPixel(pixel, newSpeed, "right", sandbox.updateCount);
    sandbox.setPixel(newPixel, index);

    pushPixel(sandbox, index - 1, newSpeed, "left");

    return index;
  }
  // }
};

export const solidIsMove = (sandbox: SandBox, targetIndex: number): Pixel | undefined => {
  const target = sandbox.pixelMap[targetIndex];
  if (
    target.type.material === "empty" ||
    target.type.material === "liquid" ||
    target.type.material === "gus"
  )
    return target;

  return undefined;
};

export const liquidIsMove = (sandbox: SandBox, targetIndex: number): Pixel | undefined => {
  const target = sandbox.pixelMap[targetIndex];
  if (target.type.material === "empty" || target.type.material === "gus") return target;
  return undefined;
};

const pushPixel = (
  sandbox: SandBox,
  targetIndex: number,
  speed: number,
  speedDir: Pixel["speedDir"]
): void => {
  const pixel = sandbox.pixelMap[targetIndex];
  if (
    pixel.speedDir === "stop" &&
    (pixel.type.material === "solid" || pixel.type.material === "liquid")
  ) {
    sandbox.setPixel(
      _newPixel(pixel, pixel.speed + speed, speedDir, sandbox.updateCount),
      targetIndex
    );
    // sandbox.setPixel({ ...pixel, speed: pixel.speed + speed, speedDir }, targetIndex);
  }
};
