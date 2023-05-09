export class QuitToMainMenuButton {
  private static instance: HTMLButtonElement;

  constructor({ handleClick }: { handleClick: (e: MouseEvent) => void }) {
    if (!QuitToMainMenuButton.instance) {
      QuitToMainMenuButton.instance = document.getElementById(
        "return-to-main-menu-button"
      ) as HTMLButtonElement;
      QuitToMainMenuButton.instance.addEventListener("click", handleClick);
    }
  }

  public hide() {
    QuitToMainMenuButton.instance.hidden = true;
  }

  public show() {
    QuitToMainMenuButton.instance.hidden = false;
  }
}
