import { Peer } from "peerjs";
import { createMachine, interpret } from "xstate";
import { nanoid } from "nanoid";

import { showMainMenu } from "./actions/show-main-menu";
import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { showReturnToMainMenuButton } from "./actions/show-return-to-main-menu-button";

import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHTZ4D6AtgIZlX4CuAxAMoAqAggEpvkAKXDgGE2ASSEBRANoAGALqJQaAPaxsAF2zK8ikCkQBWABwziATgBsAZgsWAjHYBMRm1YMAaEAE9EVx6YB2ABYDILszRxCzKysAgF84z1QMHHwiUgo0TGoCTSIqZQgwVgAJAHkAdXIAWQ5RADkaiXqAVVkFJBAVNU1tXX0EKzNTRwCrIKNQ5zGLM08fQYMLczNV+ys7NyCzAIsEpPQsXEISABtlaggyKHIAM1pTyCYuCTYuAE1yABkyjgARBoAcXaum6Gi0Ok6AzsMgCAWIMiCszsFhksIswQs80Q-jMK1WBjGQSsaJk1n24EOqROxHOl2uTAg2hIZAAbsoANYkZJHNJnC5XPBQBBs5QEai9PDtEGdMGS-q+YbEUbjSZBaY2ObeRAwgz4nbOPwbKxGPaJSkpY7pOmCqCM5kZdlc4g86nWgXXEV4dniyXSuwdJSqcF9KGKkZEtUa2bYhCOYz64y2CwGOwBGQGCmuq38+lCphYTDKTDENCnCW3YuUF1UnO0j1Cr0+iUQ6XyUHB+VhwZKlUTKZGGZahaOBzEbarIwhAw7HZ2IwJc14QpwXTZvkdnoQhUIAC0WO1e71qxPKbcEUiZKztb5xAI2jwYFy13I6mU5AwWE3IchoAGASnYgp1iIwjDMIxHBTDNYyMOxxxPSwALMdVVmvS1b0wMAbWub8uz-HVIKsYg7CCMl7HnWwZEcWMKP1FNgmQuxQkzc11xpOgaA4xhcO3bsAKCIDiQAsCIKgjxDw2RxiAsSJLBI9UmJTNDeXYzJsmffJKBXHjQ3whB1VjDYjARFxRjnbYLCnM0DnQmlsKFO4HkgHTfz0RB+MEkCRMggxoMPWiEPo7YwmY5S3VzW0XJ3TZj1HMxFOGeKaNNOjCWCpj1UXOIgA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      connecting_to_peer: {
        data: {},
        entry: "connect_to_peer",
      },
      reloading: {
        entry: "refresh_page",
      },
      in_main_menu: {
        entry: "show_main_menu",
        on: {
          START_PRACTICE: {
            target: "in_practice_mode",
          },
        },
      },
      in_practice_mode: {
        entry: "show_return_to_main_menu_button",
        on: { SHOW_MAIN_MENU: { target: "in_main_menu" } },
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
      show_main_menu: showMainMenu,
      show_retry_loading_screen: showRetryLoadingScreen,
      show_return_to_main_menu_button: showReturnToMainMenuButton,
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
