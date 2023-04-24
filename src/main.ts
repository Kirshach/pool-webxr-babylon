import { interpret } from "xstate";
import { experienceMachine } from "./experience/experience.machine";

interpret(experienceMachine)
  .onTransition((state) =>
    console.info("Experience Machine State Update: ", state.value)
  )
  .start();
