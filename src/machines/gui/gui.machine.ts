import { createMachine, interpret } from "xstate";

import { showRetryLoadingScreen } from "./entities/retry-loading-screen-dialog";
import { MainMenuDialog } from "./entities/main-menu-dialog";
import { QuitToMainMenuButton } from "./entities/quit-to-main-menu-button";

import type { GuiContext, GuiEvent } from "./types";
import { experienceService } from "../experience";

const pointerLockChangeInGameEventListener = () => {
  if (document.pointerLockElement) {
    guiService.send({ type: "HIDE_POINTER_IN_GAME_UI" });
  } else {
    guiService.send({ type: "SHOW_POINTER_IN_GAME_UI" });
  }
};

export const guiMachine = createMachine<GuiContext, GuiEvent>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECqBJAdAOwPYH0oBXASwGIAVAeX2QEEBZAUQG0AGAXUVAAddYSAFxK5s3EAA9EARgAsAZkwB2NvOnSlATiUAmJQA45+gDQgAnjI2Z9m+Tvl37ANgCsSlzoC+n02ix5CUkoaBjp0ADl8ZnDUdi4kED4BYVFxKQQ5RRU1DW09Q1kTc0R5WVlMVycdJ1kDdTZXb18MTABbAEMSbHxWsGwiQPJqWkZWTnEkoRExBPSXF01rHX02fTd9JwbpTVMLBENMWU1j4517Mv0lJpA-TC7Cdt7B4KiwyOjY8YTJlJnQOZc5SUR00+nkl00Tk0cl2MiUSkwmhcajUrmkYKc0m8PhAeAgcHEfgm-CmqVmiAAtE5YQgqZg2AzGUymVccbcAsQSMTktM0ohZDoadIdOUVqDjpUoY02S0Ovdev1BtzSX9JIglPIEXoHDYlNIoQppEKVocdJDIZiGg55E5rrd7lBHmAld8Sb8+Qg7E5MGdXEdljoXDV5DTNKLbPZhU4NXV5NjPEA */
    id: "GUI",
    predictableActionArguments: true,
    initial: "no_gui",

    context: {
      mainMenuDialog: new MainMenuDialog({
        onStartPracticeButtonClick: () => {
          experienceService.send("START_PRACTICE");
        },
      }),
      quitToMainMenuButton: new QuitToMainMenuButton({
        handleClick: () => {
          experienceService.send("GOTO_MAIN_MENU");
        },
      }),
    },

    states: {
      no_gui: {
        on: {
          SHOW_IN_GAME_UI: {
            target: "in_game_gui",
          },
          SHOW_MAIN_MENU: {
            target: "main_menu_gui",
          },
        },
      },
      main_menu_gui: {
        entry: ["show_main_menu"],
        on: {
          SHOW_IN_GAME_UI: {
            target: "in_game_gui",
            actions: ["hide_main_menu"],
          },
        },
      },
      in_game_gui: {
        entry: ["show_game_gui", "add_pointer_lock_change_event_listener"],
        on: {
          SHOW_MAIN_MENU: {
            target: "main_menu_gui",
            actions: "hide_game_gui",
          },
          POINTER_LOCKED: {},
          HIDE_POINTER_IN_GAME_UI: {
            actions: "hide_pointer_in_game_gui",
          },
          SHOW_POINTER_IN_GAME_UI: {
            actions: "show_pointer_in_game_gui",
          },
        },
      },
    },

    schema: {
      events: {} as GuiEvent,
      services: {} as {},
    },
  },

  {
    actions: {
      add_pointer_lock_change_event_listener: () => {
        document.addEventListener(
          "pointerlockchange",
          pointerLockChangeInGameEventListener
        );
      },
      hide_pointer_in_game_gui: (ctx) => ctx.quitToMainMenuButton.hide(),
      hide_game_gui: (ctx) => ctx.quitToMainMenuButton.hide(),
      hide_main_menu: (ctx) => ctx.mainMenuDialog.close(),
      show_game_gui: (ctx) => ctx.quitToMainMenuButton.show(),
      show_main_menu: (ctx) => ctx.mainMenuDialog.showModal(),
      show_pointer_in_game_gui: (ctx) => ctx.quitToMainMenuButton.show(),
      show_retry_loading_screen: (_ctx) => showRetryLoadingScreen,
      refresh_page: () => window.location.reload(),
    },
    guards: {},
    services: {},
  }
);

export const guiService = interpret(guiMachine);
