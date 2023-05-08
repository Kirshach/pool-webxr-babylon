import { type ErrorExecutionEvent } from "xstate";
import { MainMenuButton } from "./actions/show-return-to-main-menu-button";

export type ExperienceEvent =
  | { type: "RETRY_LOADING" }
  | { type: "START_PRACTICE" }
  | { type: "SHOW_MAIN_MENU" }
  | { type: "CLOSE_MENU" }
  | ErrorExecutionEvent;

export type ExperienceContext = {
  mainMenuButton: MainMenuButton;
};
