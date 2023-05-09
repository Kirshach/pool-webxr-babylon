import { type ErrorExecutionEvent } from "xstate";

import { MainMenuButton } from "./entities/main-menu-button";
import { MainMenuDialog } from "./entities/main-menu-dialog";

export type GuiEvent =
  | { type: "START_PRACTICE" }
  | { type: "SHOW_MAIN_MENU" }
  | ErrorExecutionEvent;

export type GuiContext = {
  mainMenuButton: MainMenuButton;
  mainMenuDialog: MainMenuDialog;
};
