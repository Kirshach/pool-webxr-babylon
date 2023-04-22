import { createMachine, interpret } from "xstate";

export const experienceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEAMgPICCAIgKLsDaADAF1EoNOVjYALtnJ5hIFIgCMAdkXFFATg0AmRQA5lAVgA0IAJ6INfYgGZlAFg177Dxbr4b7AXy+nUGHHwiMioaOiY2dgBJADkAcQB9TgAlZOZk-iEkEFFxKRk5BQRFGw1bKwA2bRNzRABaRWsS7T03Ry0OvQqfP3QsXEISCmpaKASAM0psUkh6ZM4AFWSATQSWDli4zLlcyWlZbKLFe2s+KpqLBDqDYgqK5Q0Kg3aOjR7wPsDB4lo9ylJsAAvUb0WJRBZRViMKIALW422yu3yB1ARXsrWIekq1VMlystiMPl8IDw5AgcDk-n6QTAOzEewKh3qFVx9RUhnU90eBkM7ypX2CwzCUDpeX2hUQ9m0rIQ+LsvOJ-IGgtCowmUxmEFFDJR8kQNm02lsFQNrRxtSujXUprary0XT5n2VJF+Un+QNG2uREoQNhsFWIfHsTyMMrlhMVTppPzwCQoACN45cRPTvUyEBVDEb0XoWm4LpZrPKiV4gA */
    id: "experience",
    initial: "loading",
    states: {
      loading: {
        on: { LOADED: "initializing", LOADING_ERROR: "loading_failed" },
      },
      loading_failed: { on: { RETRY_LOADING: "loading" } },
      initializing: { on: { INITIALIZED: "in_lobby" } },
      in_lobby: {},
    },
    schema: {
      events: {} as
        | { type: "LOADED" }
        | { type: "INITIALIZED" }
        | { type: "LOADING_ERROR" }
        | { type: "RETRY_LOADING" },
    },
  },
  {
    actions: {
      LOADED: () => {
        console.log("State change: experience loaded");
      },
    },
  }
);

interpret(experienceMachine)
  .onTransition((state) => console.log(state.value))
  .start();
