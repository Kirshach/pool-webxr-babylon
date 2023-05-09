import { createMachine } from "xstate";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { MainMenuDialog } from "./entities/main-menu-dialog";
import { QuitToMainMenuButton } from "./entities/quit-to-main-menu-button";

import type { GuiContext, GuiEvent } from "./types";
import { experienceService } from "../experience";

export const guiMachine = createMachine<GuiContext, GuiEvent>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECqBJAdAOwPYH0oBXASwGIAVAeX2QEEBZAUQG0AGAXUVAAddYSAFxK5s3EAA9EARgAsAZkwB2NvOnz5AJmkA2NgA596gDQgAnjLazMAVjb3N8tgE5pmpa4C+n02ix5CUkoaBjp0ADl8ZnDUdi4kED4BYVFxKQQ5RRU1DW09QxNzRE1ZfUxNTR0bZ3klaRtDeR1Zb18MTBJsQgBDAFswQPJqKLDI6NjOcSShETEE9JtZZ2U7KwadJX1nfVlTCwQjW0dZarZNNiVNHelvHxA8CDhxPyn+GdT5xABaHT3vnVaID8OAIxBIr2SszSiFkmj+GWk0kwsl0OmcbGkZzq2hsgOBvW6nXw-WwREGEPec1A6SUWnKtJsbiusI2vyKByUmFcOjRlWkOxqujx7SJUD6AzBFJSVMkiC0OnKlRsSiUNhs8gUO3hh1WZzYOiMPJ0jluniAA */
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
      show_retry_loading_screen: (ctx) => showRetryLoadingScreen,
    },
    guards: {},
    services: {},
  }
);
