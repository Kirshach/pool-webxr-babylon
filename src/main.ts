import { experienceService } from "./machines/experience";

experienceService
  .onTransition((state) =>
    console.info("Experience Machine State Update: ", state.value)
  )
  .start();
