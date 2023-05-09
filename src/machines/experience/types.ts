import { type ErrorExecutionEvent } from "xstate";

export type ExperienceEvent =
  | { type: "RETRY_LOADING" }
  | { type: "GOTO_MAIN_MENU" }
  | { type: "START_PRACTICE" }
  | ErrorExecutionEvent;

export type ExperienceContext = {};
