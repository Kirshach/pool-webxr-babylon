import { Peer } from "peerjs";
import { createMachine, interpret } from "xstate";
import { nanoid } from "nanoid";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { initializeExperience } from "./services/initialize-experience";

import { ExperienceContext, ExperienceEvent } from "./types";

export const experienceMachine = createMachine<
  ExperienceContext,
  ExperienceEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEARgBsC4gGYTAJgAsADgCcRgKwn7Ciy5cAaEAE9EAFpba2IzIwsFBRcFIwVHR1tHFwBfVL9eLFxCEgpqWgYmFmJxbmIs-lyhAtFxSV08VTkjNSQQTW1G-UMEI3swhRMU6yjrUdt3P0C+22J4t1sjJJMXRxNQi3TM9GyBPOFC+ixMckxiNFJpADMzgFsK3arBfJEoMTwOBtkm5VV9To6H49YKRCzEaz2MYuJZJewmVbTUGxSyOKwmCwAdismKMk224CeORehzoAH1rpRsKRIPQAEoAUQAKnSAJpkgAyAHkAIIAEQAkgA5ADi-3agO67V6QSMkUsWMx1hiFmsmMxtgSSIQQSsYQxLlchr1KRcmPSGRAeHIEDg+kqxLAAK0QL00tB9iM4WVk0SUXVmIx2qCLih81smIG4wU41sDgJDv2NTezq6wPdOrlYWWk0jMRjmPWFmDJkx4TiUQU9gcjmxjgTRKTmDAr0KqddeBBmesJmItgsjjVRlxDiHweSLnCEahCkj2LWFlsDb4jtKeDJd3wAFd21LQL1xmXvBYnOrJrET9ZtR4FdZQ3YwV4e8u9tVW+S7tICAALXfp-eIKGczDk4GLRLEw6YsGSrEOsZoRrixqQiYL7PActRQBSVI0hAf5ugBmYWOCNgKL6aKzuqQYBMEar2BCtaRgMuKjKRFqpEAA */
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
        data: {},
        entry: "test_peer_connection",
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
      test_peer_connection: () => {
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
      show_retry_loading_screen: showRetryLoadingScreen,
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
