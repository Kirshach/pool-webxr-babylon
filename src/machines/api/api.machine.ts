import { Peer } from "peerjs";
import { createMachine, interpret } from "xstate";

import { APIContext, APIEvent } from "./types";

export const apiMachine = createMachine<APIContext, APIEvent>(
  {
    id: "api",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      loading: {},
    },

    schema: {
      events: {} as ExperienceEvent,
      services: {} as {},
    },
  },

  {
    actions: {
      test_peer_connection: () => {},
    },
    services: {
      test: () => {},
    },
  }
);

export const experienceService = interpret(experienceMachine);
