export class MainMenuDialog {
  private static instance: HTMLDialogElement;
  private static practiceModeButton: HTMLButtonElement;

  constructor({
    onStartPracticeButtonClick,
  }: {
    onStartPracticeButtonClick: (e: MouseEvent) => void;
  }) {
    if (!MainMenuDialog.instance) {
      MainMenuDialog.instance = document.getElementById(
        "main-menu-dialog"
      ) as HTMLDialogElement;
      MainMenuDialog.practiceModeButton = document.getElementById(
        "main-menu-dialog__game-mode--practice"
      ) as HTMLButtonElement;
      MainMenuDialog.instance.addEventListener("cancel", (e) => {
        e.preventDefault();
      });
      MainMenuDialog.practiceModeButton.addEventListener(
        "click",
        onStartPracticeButtonClick
      );
    }
  }

  public close() {
    if (MainMenuDialog.instance.open) {
      MainMenuDialog.instance.close();
    }
  }

  public showModal() {
    if (MainMenuDialog.instance.open === false) {
      MainMenuDialog.instance.showModal();
    }
  }
}
