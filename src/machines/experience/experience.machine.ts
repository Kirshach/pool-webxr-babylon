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
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHTZ4D6AtgIZlX4CuAxAMoAqAggEpvkAKXDgGE2ASSEBRANoAGALqJQaAPaxsAF2zK8ikCkQAWABwAmYgHYAjEfMA2EyYMBOJwGYArAYA0IAJ6JLEyNidxkwmVtbV1sjQPMDAF8En1QMHHwiUgo0TGoCTSIqZQgwJgBxAHk2CvIAWQ5RADk6iUaAVVkFJBAVNU1tXX0EEydLYg9Ld3NzVxNbdxcjdx9-YfcxpwjHeNtLPY9zJJT0LFxCEgAbZWoIMigmCG0SMgA3ZQBrElTTjMvr27wUAQr2UBGo-TwnU6ul6Gi0Om6QxGYwmUxmcwWTiWK0M7ncxAMWxM5nW8xM7iiR3AJ3S52IVxudweTyyb0+xG+tMyDIBQJBYIhUMsXSUqjhA0RiGR43WaNm80Wyz8iFcMjMhPsHkJbiMrlcVM5Z25-yZWEwykwxDQF3BADMLZQOTSjX9GYDgXg3gL4VD5DCxRDBlLRjLJtN5ZjscqEK5nMRNvZJk4SaZzE4kskQHhinBdIbfv6+vCgwgALS2HFl2wG52-YgEbR4MD5O7kdTKcgYLCF8UI0BDGL4pwmay7EdLJWrAyq+NEpYuUIJmtpF1ZKi0CiURg9wOShCD+PjsfWPGVyzzYimWJzYeeGYk5c-Ol0HJ5ApgIolHfFveWGSucZp2mQJnAmGQjDPPFxlsZM3DxGRk3MIJHy5V1eW-CV+0MExK1mfENQcWIZDxdZEkzfM6R5VszQtDC+z0RAD2HUdAhPScVXJAk5z-EjLA8DMEiAA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    invoke: [{ id: "GUI", src: guiMachine }],

    states: {
      connecting_to_peer: {
        data: {},
        entry: "connect_to_peer",
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
          onError: { target: "loading_error" },
        },
      },
      loading_error: {
        entry: "show_retry_loading_screen",
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
