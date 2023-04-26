import { ErrorExecutionEvent } from "xstate";
import { experienceService } from "../experience.machine";
import { ExperienceContext } from "../types";

export const showRetryLoadingScreen = (
  _: ExperienceContext,
  event: ErrorExecutionEvent
) => {
  const dialog = document.getElementById(
    "retry-loading-screen-dialog"
  ) as HTMLDialogElement;

  const errorStackTrace = document.getElementById(
    "retry-loading-error-dialog__message-stack"
  ) as HTMLParagraphElement;

  const retryButton = document.getElementById(
    "retry-loading-error-dialog__retry-button"
  ) as HTMLButtonElement;
  retryButton.addEventListener("click", () => {
    experienceService.send({ type: "RETRY_LOADING" });
  });

  errorStackTrace.textContent = event + "\n" + event.data.stack;

  dialog.showModal();
};
