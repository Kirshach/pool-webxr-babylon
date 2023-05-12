import { createMachine } from "xstate";

import { showRetryLoadingScreen } from "./entities/retry-loading-screen-dialog";
import { MainMenuDialog } from "./entities/main-menu-dialog";
import { QuitToMainMenuButton } from "./entities/quit-to-main-menu-button";

import type { GuiContext, GuiEvent } from "./types";
import { experienceService } from "../experience";

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
          TO_GAME: {
            target: "in_game_gui",
          },
          TO_MAIN_MENU: {
            target: "main_menu_gui",
          },
        },
      },
      main_menu_gui: {
        entry: ["show_main_menu"],
        on: {
          TO_GAME: {
            target: "in_game_gui",
            actions: ["hide_main_menu"],
          },
        },
      },
      in_game_gui: {
        entry: "show_game_gui",
        on: {
          TO_MAIN_MENU: {
            target: "main_menu_gui",
            actions: "hide_game_gui",
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
      show_game_gui: (ctx) => {
        ctx.quitToMainMenuButton.show();
      },
      hide_game_gui: (ctx) => {
        ctx.quitToMainMenuButton.hide();
      },
      show_main_menu: (ctx) => ctx.mainMenuDialog.showModal(),
      hide_main_menu: (ctx) => ctx.mainMenuDialog.close(),
      show_retry_loading_screen: (_ctx) => showRetryLoadingScreen,
      refresh_page: () => {
        window.location.reload();
      },
    },
    guards: {},
    services: {},
  }
);
