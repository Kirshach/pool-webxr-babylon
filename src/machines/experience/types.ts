import { type ErrorExecutionEvent } from "xstate";

export type ExperienceEvent = { type: "RETRY_LOADING" } | ErrorExecutionEvent;
export type ExperienceContext = {};
