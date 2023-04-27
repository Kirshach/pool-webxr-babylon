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
  errorStackTrace.textContent = event + "\n" + event.data.stack;

  const retryButton = document.getElementById(
    "retry-loading-error-dialog__retry-button"
  ) as HTMLButtonElement;
  retryButton.addEventListener("click", () => {
    experienceService.send({ type: "RETRY_LOADING" });
  });

  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
  });
  dialog.showModal();
};
