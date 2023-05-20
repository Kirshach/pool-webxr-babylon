import { experienceAtom } from "./experience";
import { MainMenuDialog } from "../entities/main-menu-dialog";
import { RetryLoadingScreenDialog } from "../entities/retry-loading-screen-dialog";

export const mainMenuDialog = new MainMenuDialog({
  onStartPracticeButtonClick: () => {
    experienceAtom.actions.startPractice();
  },
});

const retryLoadingScreenDialog = new RetryLoadingScreenDialog({
  onRetryButtonClick: () => {
    window.location.reload();
  },
});

experienceAtom.subscribe((state) => {
  switch (state.status) {
    case "in-menu":
      mainMenuDialog.showModal();
      break;
    case "loading-error":
      const e = experienceAtom.value.error;
      retryLoadingScreenDialog.show(
        (e?.message || "Unknown horrible error that I didn't anticipate") +
          "\n" +
          e?.stack
      );
    case "in-practice":
      mainMenuDialog.close();
  }
});
