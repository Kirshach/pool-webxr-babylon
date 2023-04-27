import { createMachine, interpret } from "xstate";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEARgDMR4gBYATAFYLNq2YsAOUwE4rAGhABPRAFojAHZiKzCjNyCguyCI5zcTAF9E714sXEISCmpaBixMckxiNFJpADNCgFtiNP5MoRzRcUldPFVVfU1tVv1DBCMANnMFGyNgqJsbBWcBr18AoytnYjMTNxs3CyGNizdk1PR0gSzhXIB9MspsUkh6ACUAUQAVO4BNM4AZAHkAQQARACSADkAOIdJAgLo6WR4XoBNzmEwxEyOJETIzePwIfyOCzEGzOCxbGwmLZBBQJGzJFIgPDkCBwfS1DJETpaaF6CF9QIDBTECJk5wjBRWIJuAYmTEBFFWYi8oLxQb2GxRKwWfbgQ51QTZERQNndGFw7FjWUCgYK4Wi8WS+bYi1yhSmBTTFyRNYa5nHBoMiAGjmwrmIExDOXigYS9Yq4KTKUm5ZBcKRaIWWJueJJGle+q686Xa6Qf09IP9Kx8oU2AYIhG7ExBUlxnFI-kKMUiwkWilI6mJIA */
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
