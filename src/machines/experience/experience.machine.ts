import { Peer } from "peerjs";
import { createMachine, interpret } from "xstate";
import { nanoid } from "nanoid";

import { showMainMenu } from "./actions/show-main-menu";
import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { MainMenuButton } from "./actions/show-return-to-main-menu-button";

import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHTZ4D6AtgIZlX4CuAxAMoAqAggEpvkAKXDgGE2ASSEBRANoAGALqJQaAPaxsAF2zK8ikCkQBWABwBGYgDYALDPMmAnAcsB2WwfMAaEAE9EAZhvEBjLBMkaWvk4uvgYAvjGeqBg4+ESkFGiY1ASaRFTKEGCsABIA8gDq5ACyHKIAclUStQCqsgpIICpqmtq6+gi+djLEAExOvuEmlka+w6ZOnj79bsR2q6tTkaFTcQnoWLiEJAA2ytQQZFDkAGa0R5BMXBJsXACa5AAyJRwAInUA4q1dJ0NFodO0+iYZJFiDJLOY7L5bJZhqMPN5EMNITCQsiJuYDP4nDtwHtkodiCczhcmBBtCQyAA3ZQAaxIiX2KWOp3OeCgCEZygI1G6eFagPawJFvT8gxGYwmUxmcwWiEhBhWayM+JkvgGvlMxPZZNSlJ5UBpdLSTNZxCNBxN3Iu-LwTKFIrFJjaSlUIJ64JlQ1G418k2msxM83RCGGBjs2OCw3xRhkJn840NpPtXKpvKYWEwykwxDQR2FV0LlFtmc5FMdvOdruFoLF8iBPql-v6sqDCrDyqjmLMQWClmcKMsdickzi8RAeHycF0ds5ba6oOlCAAtGjFtv4yEDweibPl+SCNo8GBshdyOplOQMFhV76waA+k4wsQwhEnFCjMnRksFUEFMYgJ1WMIgkxKwoQzJIs2ITAwFNC5nw7N9VUTXxiEmKFkRReEjAMYCTCMJx9xsRwI3MYZQjgjlyToGgmMYND107D9LC-cJNg-ACnCAqMQ2GCxhgnUdwjE0j6ONel0kya9ckoBc2L9DCEGRYCQyMGE+0TCNg2GGSEJQ3lrluSBVNfPREE47ifz-fjBMWUjyMPfFLGo2ijGMmtTKgKyN1TdU7ExLU7HsScjAcSMXLIiiPK8uiZyAA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    context: {
      mainMenuButton: new MainMenuButton(),
    },

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
        on: {
          SHOW_MAIN_MENU: { target: "in_main_menu" },
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
      show_main_menu: showMainMenu,
      show_retry_loading_screen: (ctx) => showRetryLoadingScreen,
      show_return_to_main_menu_button: (ctx) => ctx.mainMenuButton.show(),
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
