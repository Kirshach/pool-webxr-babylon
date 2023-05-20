export class RetryLoadingScreenDialog {
  private static instance: HTMLDialogElement;
  private static errorStackTrace = document.getElementById(
    "retry-loading-error-dialog__message-stack"
  ) as HTMLParagraphElement;

  constructor({
    onRetryButtonClick,
  }: {
    onRetryButtonClick: (e: MouseEvent) => void;
  }) {
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
      retryButton.addEventListener("click", onRetryButtonClick);
    }
  }

  public show(errorMessage: string) {
    RetryLoadingScreenDialog.errorStackTrace.textContent = errorMessage;
    RetryLoadingScreenDialog.instance.showModal();
  }
}
