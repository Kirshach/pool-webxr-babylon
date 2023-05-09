export class MainMenuDialog {
  private static instance: HTMLDialogElement;
  private static practiceModeButton: HTMLButtonElement;

  constructor({
    onStartPracticeButtonClick,
  }: {
    onStartPracticeButtonClick: () => void;
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
    MainMenuDialog.instance.close();
  }

  public showModal() {
    MainMenuDialog.instance.showModal();
  }

  public onClick() {}
}
