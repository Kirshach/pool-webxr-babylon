import { type ErrorExecutionEvent } from "xstate";

import { QuitToMainMenuButton } from "./entities/quit-to-main-menu-button";
import { MainMenuDialog } from "./entities/main-menu-dialog";

export type GuiEvent =
  | { type: "TO_MAIN_MENU" }
  | { type: "TO_GAME" }
  | ErrorExecutionEvent;

export type GuiContext = {
  quitToMainMenuButton: QuitToMainMenuButton;
  mainMenuDialog: MainMenuDialog;
};
