import { ExperienceContext } from "../types";

import { experienceService } from "../experience.machine";

export const showReturnToMainMenuButton = (_: ExperienceContext) => {
  const returnToMainMenuButton = document.getElementById(
    "return-to-main-menu-button"
  ) as HTMLButtonElement;

  returnToMainMenuButton.addEventListener("click", () => {
    experienceService.send({ type: "SHOW_MAIN_MENU" });
  });

  returnToMainMenuButton.hidden = false;
};
