import { createMachine, interpret } from "xstate";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEARgCcAFmIBWAGxmzR6wGZHdgEyPTAGhABPRAFpXI2IFBUcbd1trE3CYgF84714sXEISCmpaBiYWYnFuYmT+NKFM0XFJXTxVOSM1JBBNbSr9QwRTAHYrSyMjAA5rIw67DoVrDu8-BEdXYj6hyzH7BUsY0MsEpPQUgXThLPosTHJMYjRSaQAzE4BbQu3iwQyRKDE8DkrZauVVfSadL6tRCWCxmea9RzWEGdHqWSYBIwzYjRKG9MwzVyuPodTbgB6pJ77OgAfUulGwpEg9AASgBRAAq1IAmsSADIAeQAggARACSADkAOK-Br-FoNNr+RGzVw9PoKPqQpauJzwhCBezEIxjDoqkwKXXWVwdRwJRIgPDkCBwfRFAlgP5aAF6CUI+XEWX9BVK2wqxxq-xmSx9YgdRZGrELExOXF23alF6O5qA13q3qzUxmcbyxbG6P+3wBcbIhSI0J9MEmE0mWP4+M3fAAVyTzrwQIQlksXTMHSMrgU7jsQyDas1JoUMUcYX7GLMtb49oTWWJN2kBAAFi3xaA2osLIrBj2TCY+senHDC2menMYtY+sGDZYZjZ5zsSs9l2SKZAtymdwiVlDIwnz6TEhkxKETADRxew9cMhl6eZrDCU0zSAA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      loading: {
        invoke: {
          src: "initializeExperience",
          onDone: [
            {
              cond: "has_match_query",
              target: "loading_match",
              doneData: {
                matchQuery: 1,
              },
            },
            {
              target: "in_menu",
            },
          ],
          onError: {
            target: "loading_failed",
          },
        },
      },
      reloading: {
        entry: "refresh_page",
      },
      in_menu: {
        entry: "show_lobby_screen",
      },
      loading_match: {
        data: {
          matchQuery: 1,
        },
        entry: "show_awaiting_connection_screen",
      },
      loading_failed: {
        entry: "show_retry_loading_screen",
        on: {
          RETRY_LOADING: {
            target: "reloading",
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
      refresh_page: () => {
        window.location.reload();
      },
    },
    guards: {
      has_match_query: () => {
        return window.location.search.includes("match");
      },
    },
    services: {
      initializeExperience,
    },
  }
);

export const experienceService = interpret(experienceMachine);
