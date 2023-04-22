import { initializeExperience } from "./features/initialize-experience/ui/initialize-experience";

const canvas = document.getElementById("canvas");

if (!canvas) {
  throw new Error("Canvas not found");
} else if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('"#canvas" element is not an instance of HTMLCanvasElement');
}

await initializeExperience(canvas);
