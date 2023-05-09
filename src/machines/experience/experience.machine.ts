import { Peer } from "peerjs";
import { createMachine, interpret, send, sendTo } from "xstate";
import { nanoid } from "nanoid";

import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";
import { guiMachine } from "../gui";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHTZ4D6AtgIZlX4CuAxAMoAqAggEpvkAKXDgGE2ASSEBRANoAGALqJQaAPaxsAF2zK8ikCkQBOAOwAOYgEYATAFYZAZgMA2SwBZnLkwBoQAT0Tnrc2JbGRlzYxMjRztXOwBfOO9UDBx8ImIAG2VqCDIocgAzWgzIJi4JNi4ATXIAGQB5DgARUQA5AHFZBSQQFTVNbV19BAiLG3snV3cvX0Q7Z2DQmWsTFxdLc3NHawSk9CxcQhIsnLymCG0SMgA3ZQBrEmSDtOPs3LwoBBvlAmoBvC6XV0fQ0Wh0PWGdjCxDsgWs8NCUUcJms3j8CBsZhCMksMWRdhMVl24H2qSOmTeZwueCueFuD2ITzJ6RO70+31+-0B5m6SlUoMGELm0NhAQRMiRKLR-msdmISxxlnsMhMBisRmJTMOLMpHyYWEwykwxDQGT+BSNlEZpO1r1OHy+dJ+fzBgPkwP5-yGwqCovhIUlqNmCHmLnlS0cMmRsqMsvixLwyggcF0WpeHv6YO9CAAtI5pbnHJqbS9iARtDSCJoPuR1MpyBgsBmBeDQMNo8QDBsTCZLAZlpHzAXcWGFRMjDIPNZY8WUrbiJgwKy8s2vUKEJsjL7LISUdY+8tzDN0XYHItQri+0YjJZTLPnuS6DQn4xV1n17GZPK3JEXKFAo4aoFlYWJLEqva3i4RgGPezK0g2mDUFW2BEFQSZgG+gptv45hbjCO5HvCB6BMeMqWOGoThKYUQxC4sHzsuNZFNgJQQJhrZ6IgHZdkevb9tYg4FqeBjnjiMTGDed6JCSc6loxUDsdm6zAS4Im-gYBgouEBhQreCQJEAA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    invoke: [{ id: "GUI", src: guiMachine }],

    states: {
      connecting_to_peer: {
        data: {},
        entry: "connect_to_peer",
      },
      reloading: {
        entry: "refresh_page",
      },
      in_main_menu: {
        entry: sendTo("GUI", "SHOW_MAIN_MENU"),
        on: {
          START_PRACTICE: {
            target: "in_practice_mode",
          },
        },
      },
      in_practice_mode: {},
      loading_failed: {
        entry: "show_retry_loading_screen",
        on: {
          RETRY_LOADING: {
            target: "reloading",
          },
        },
      },
      loading: {
        invoke: {
          src: "initializeExperience",
          onDone: [
            {
              cond: "has_match_query",
              target: "connecting_to_peer",
            },
            {
              target: "in_main_menu",
            },
          ],
          onError: {
            target: "loading_failed",
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
      connect_to_peer: () => {
        const url = new URL(window.location.href);
        const peerId = url.searchParams
          .get("peer")
          ?.match(/^[a-zA-Z0-9-_]*$/)?.[0];

        const userId =
          url.searchParams.get("user")?.match(/^[a-zA-Z0-9-_]*$/)?.[0] ??
          nanoid();

        if (!peerId) {
          throw new Error("Unknown peer id format");
        }

        const peer = new Peer(userId);

        peer.on("open", (id) => {
          console.log("My peer ID is: " + id);
          const conn = peer.connect(peerId);

          conn.on("open", () => {
            console.log("Connection established with: " + conn.peer);
          });

          conn.on("error", (err) => {
            console.error("Connection error:", err);
          });
        });

        peer.on("connection", (conn) => {
          console.log("Someone connected!: ", conn);

          conn.on("open", () => {
            console.log("Connection opened with: " + conn.peer);
          });

          conn.on("error", (err) => {
            console.error("Received connection error:", err);
          });
        });
      },
      refresh_page: () => {
        window.location.reload();
      },
    },
    guards: {
      has_match_query: () => {
        return window.location.search.includes("peer");
      },
    },
    services: {
      initializeExperience,
    },
  }
);

export const experienceService = interpret(experienceMachine);
