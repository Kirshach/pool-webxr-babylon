import { type ErrorExecutionEvent } from "xstate";

export type ExperienceEvent =
  | { type: "RETRY_LOADING" }
  | { type: "START_PRACTICE" }
  | { type: "SHOW_MAIN_MENU" }
  | ErrorExecutionEvent;
export type ExperienceContext = {};
