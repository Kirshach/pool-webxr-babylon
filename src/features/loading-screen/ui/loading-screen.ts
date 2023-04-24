import { type ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
  loadingUIBackgroundColor = "black";
  constructor(public loadingUIText: string) {}
  displayLoadingUI() {}
  hideLoadingUI() {}
}
