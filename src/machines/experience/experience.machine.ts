import { Peer } from "peerjs";
import { createMachine, interpret, sendTo } from "xstate";
import { nanoid } from "nanoid";

import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";
import { guiMachine } from "../gui";
import { forwardTo } from "xstate/lib/actions";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHTZ4D6AtgIZlX4CuAxAMoAqAggEpvkAKXDgGE2ASSEBRANoAGALqJQaAPaxsAF2zK8ikCkQAWAJwAmYgHYAjAA5zJ8wFYAbOYMGTbgDQgAnogDMDv7ExkZGTk7+lv7+1g4AvvHeqBg4+ESkFGiY1ASaRFTKEGBMAOIA8mzl5ACyHKIAcrUSDQCqsgpIICpqmtq6+gj+MpbEgZbOljImgTJG-k7efggG5k7ERjJOJnPmsXtGzonJ6Fi4hCQANsrUEGRQ5ABmtJeQTFwSbFwAmuQAMuUOAARRqlDq6HoaLQ6LqDIzmazESweMKWVaWcwyVZLRAmZwbMJGOIyEk2HYJJLgU5pC7Ea63e5MCDaEhkABuygA1iQUmd0lcbnc8FAEOzlARqH08B1wV1IVKBgERmMHBMnFMZg45gscQgJmZCeEXNYjBiHNZ-Mcqalzhl6UKoEyWZkOdziLyaXbBfdRXgORKpTLLJ0lKoof1YUrRuNJtNZvNFr4lQ4CWFIhbYqbrFaPbaBQzhUwsJhlJhiGhLpLHqXKO7qXm6d7hb7-ZLoTL5BCwwrI0NlTH1XGtQndXjEaEiYF3AZotFEpS8EU4Lpc-yu71oYqEABaRPLXc5+v84gEbR4MB5e7kdTKcgYLDr8Mw0CDJxxDYmGyHEyRBxBSy6si46ErY+z+CYOzZpSq60pgYD2vcj49i+iCWJYTgGMQn62BhP5OKqxijjEqbwjIcRxP4rjmIeNrHnQND0YwSGbr2b4pqYX4OD+gT-rqCzrIcwxxJY4RuHYTg0XytJ0NkuT5GAhTFMxEYoXqMjBP4BiUeqMRRAYQTWHx4TEOpuETFirj+EYkmevmDpPC8kDKc+eiIGxH6cdxf5RERwSGpi5FBFRNkNghwrOVu7iAcYxC2MYdjoWhNgSfOQA */
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
        entry: sendTo("GUI", "TO_MAIN_MENU"),
        on: {
          START_PRACTICE: {
            target: "in_practice_mode",
            actions: [
              forwardTo("GUI"),
              sendTo("GUI", "HIDE_QUIT_TO_MAIN_MENU_BUTTON"),
            ],
          },
        },
      },
      in_practice_mode: {
        entry: sendTo("GUI", "TO_GAME"),
        on: {
          GOTO_MAIN_MENU: {
            target: "in_main_menu",
          },
        },
      },
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
