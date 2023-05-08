import { experienceService } from "../experience.machine";
import { ExperienceContext } from "../types";

export class MainMenu {
  private static instance: HTMLDialogElement;

  constructor() {
    if (!MainMenu.instance) {
      MainMenu.instance = document.getElementById(
        "main-menu-dialog"
      ) as HTMLDialogElement;
    }
  }

  public hide() {
    MainMenu.instance.hidden = true;
  }

  public static show() {
    MainMenu.instance.hidden = false;
  }

  public static onClick() {
    experienceService.send({ type: "SHOW_MAIN_MENU" });
  }
}

export const showMainMenu = (_: ExperienceContext) => {
  const dialog = document.getElementById(
    "main-menu-dialog"
  ) as HTMLDialogElement;

  const practiceModeButton = document.getElementById(
    "main-menu-dialog__game-mode--practice"
  ) as HTMLButtonElement;

  practiceModeButton.addEventListener("click", () => {
    experienceService.send({ type: "START_PRACTICE" });
  });

  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
  });
  dialog.showModal();
};
