import type { Interpreter } from "xstate";
import { experienceService } from "./machines/experience";
import { GuiContext } from "./machines/gui/types";

experienceService
  .onTransition((state) =>
    console.info("Experience Machine State Update: ", state.value)
  )
  .start();

(experienceService.children.get("GUI") as Interpreter<GuiContext>).onTransition(
  (state) => console.info("GUI Machine State Update: ", state.value)
);
