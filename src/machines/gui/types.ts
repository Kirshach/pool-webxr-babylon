import { type ErrorExecutionEvent } from "xstate";

import { QuitToMainMenuButton } from "./entities/quit-to-main-menu-button";
import { MainMenuDialog } from "./entities/main-menu-dialog";

export type GuiEvent =
  | { type: "HIDE_POINTER_IN_GAME_UI" }
  | { type: "POINTER_LOCKED" }
  | { type: "SHOW_IN_GAME_UI" }
  | { type: "SHOW_MAIN_MENU" }
  | { type: "SHOW_POINTER_IN_GAME_UI" }
  | ErrorExecutionEvent;

export type GuiContext = {
  quitToMainMenuButton: QuitToMainMenuButton;
  mainMenuDialog: MainMenuDialog;
};
