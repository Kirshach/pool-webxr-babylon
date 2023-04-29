import { AdvancedDynamicTexture, Control, Ellipse } from "@babylonjs/gui";

export const drawTargetDot = () => {
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const dot = new Ellipse();
  dot.width = "8px";
  dot.height = "8px";
  dot.color = "#000000aa";
  dot.thickness = 2;
  dot.background = "#ffffffaa";
  dot.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  dot.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  advancedTexture.addControl(dot);

  return () => advancedTexture.removeControl(dot);
};
