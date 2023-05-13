import { experienceService } from "./machines/experience";
import { guiService } from "./machines/gui";

experienceService
  .onTransition((state) =>
    console.info("Experience Machine State Update: ", state.value)
  )
  .start();

guiService
  .onTransition((state) =>
    console.info("GUI Machine State Update: ", state.value)
  )
  .start();
