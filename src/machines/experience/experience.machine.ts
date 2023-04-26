import { createMachine, interpret } from "xstate";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEAdgBsxAEwAWAJwmjARgUnLADnsBma-YA0IAJ6IALT2Rhbm4R5WAKyW7vZRJgC+ib68WLiEJBTUtAxYmOSYxGik0gBmhQC2xGn8mUI5ouKSuniqqvqa2q36hghGLsTWRu4KUeZGUVEKLibmvgEIwZaWxGPhlgoO8dY2yano6QJZwrkA+mWU2KSQ9ABKAKIAKncAmmcAMgDyAIIAIgBJAByAHEOkgQF0dLI8L0gl5iO4YiNzO4kUZJj5-EFUasoi4ViYou5LHYFNYkckUiA8OQIHB9LUMkROlpoXoIX1giYFMR7Ls7C4xgoJrZ3Asgu5wmsCZYohjzASBtZ9uBDnVBNkRFBWd0YXClvZ7OY+QKBsLRSZxdilnZiDyPAoZq5hp5VUzjg16RBdezYZzEEjBiZrC4pQSXOZ5VYJYbBkYIsNJpYHKGKe71cyTo0oBcrjcfRCoT0AwhHFE1pNwnFnBSRpZY4FzEb7VtrE5plFrFMVVSgA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      loading: {
        invoke: {
          src: initializeExperience,
          onDone: "loaded",
          onError: {
            target: "loading_failed",
            actions: "show_retry_loading_screen",
          },
        },
      },
      loaded: {},
      loading_failed: {
        on: {
          RETRY_LOADING: {
            actions: "reload_page",
            // I kinda don't like this, but it's the only way I can think of
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
    services: {},
  }
);

export const experienceService = interpret(experienceMachine);
