import { createMachine, interpret } from "xstate";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEAdgBsxAEwAWAJwmjARgUnLADnsBma-YA0IAJ6IALT2Rhbm4R5WAKyW7vZRJgC+ib68WLiEJBTUtAxYmOSYxGik0gBmhQC2xGn8mUI5ouKSuniqqvqa2q36hgj2JvbEClH2IUZGUVEKLibmvgEIweYuxHGeUdaWg5s2yano6QJZwrkA+mWU2KSQ9ABKAKIAKncAmmcAMgDyAIIAIgBJAByAHEOkgQF0dLI8L0gl41jEjO5zO53FEJqMFkFUZZiFEXJZtlF3NsjAprOjkikQHhyBA4PpahkiJ0tNC9BC+sETApiPYtnYXCMFOYjLZ3NilijzMReeLRYS7BSqTTmccGiIoGzujC4UsxrKBWThdMxRKpYE7HKFB4FDNXNZkdZ9uBDnVBNkGRAdRzYVzEOjViZrC4UYSXOYMVZLfZVkYIk7JpYHKHKa71fUvedLtdIL6egH+uY+aaQwL7DZ3MjLJbUVF+QoFSsySqotTEkA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      loading: {
        invoke: {
          src: "initializeExperience",
          onDone: "loaded",
          onError: {
            target: "loading_failed",
          },
        },
      },
      loaded: {},
      loading_failed: {
        entry: "show_retry_loading_screen",
        on: {
          RETRY_LOADING: {
            actions: "reload_page",
            // TODO: I kinda don't like this, but it's the only way I can think of
            // to reload the page while not having the event self-targeting in the block scheme
            // It's not a big deal, but it's a bit weird to have it call `initializeExperience` again before refreshing the page
            target: "loading",
          },
        },
      },
    },

    schema: {
      events: {} as ExperienceEvent,
      services: {} as {},
    },
  },

  {
    actions: {
      show_retry_loading_screen: showRetryLoadingScreen,
      reload_page: () => {
        window.location.reload();
      },
    },
    services: {
      initializeExperience,
    },
  }
);

export const experienceService = interpret(experienceMachine);
