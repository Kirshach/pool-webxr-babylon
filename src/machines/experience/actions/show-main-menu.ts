import { experienceService } from "../experience.machine";
import { ExperienceContext } from "../types";

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
