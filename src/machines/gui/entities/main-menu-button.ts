import { experienceService } from "../../experience/experience.machine";

export class MainMenuButton {
  private static instance: HTMLButtonElement;

  constructor() {
    this.instance.addEventListener("click", this.onClick);
  }

  public get instance(): HTMLButtonElement {
    if (!MainMenuButton.instance) {
      MainMenuButton.instance = document.getElementById(
        "return-to-main-menu-button"
      ) as HTMLButtonElement;
    }
    return MainMenuButton.instance;
  }

  public hide() {
    this.instance.hidden = true;
  }

  public show() {
    this.instance.hidden = false;
  }

  public onClick() {
    experienceService.send({ type: "SHOW_MAIN_MENU" });
  }
}
