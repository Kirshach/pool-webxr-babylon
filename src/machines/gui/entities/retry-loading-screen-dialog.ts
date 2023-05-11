import { ErrorExecutionEvent } from "xstate";

import { experienceService } from "../../experience/experience.machine";
import { ExperienceContext } from "../../experience/types";

export class RetryLoadingScreenDialog {
  private static instance: HTMLDialogElement;
  private static errorStackTrace = document.getElementById(
    "retry-loading-error-dialog__message-stack"
  ) as HTMLParagraphElement;

  constructor() {
    if (!RetryLoadingScreenDialog.instance) {
      RetryLoadingScreenDialog.instance = document.getElementById(
        "retry-loading-dialog"
      ) as HTMLDialogElement;
      RetryLoadingScreenDialog.instance.addEventListener("cancel", (e) => {
        e.preventDefault();
      });
      const retryButton = document.getElementById(
        "retry-loading-error-dialog__retry-button"
      ) as HTMLButtonElement;
      retryButton.addEventListener("click", () => {
        experienceService.send({ type: "RETRY_LOADING" });
      });
    }
  }

  show(e: ErrorExecutionEvent) {
    RetryLoadingScreenDialog.errorStackTrace.textContent =
      e + "\n" + e.data.stack;
    RetryLoadingScreenDialog.instance.showModal();
  }
}

export const showRetryLoadingScreen = (_: ExperienceContext) => {};
