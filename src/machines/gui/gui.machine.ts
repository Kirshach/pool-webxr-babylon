import { createMachine } from "xstate";

import type { GuiContext, GuiEvent } from "./types";
import { MainMenuButton } from "./entities/main-menu-button";

import { showRetryLoadingScreen } from "./actions/show-retry-loading-screen";
import { MainMenuDialog } from "./entities/main-menu-dialog";

export const guiMachine = createMachine<GuiContext, GuiEvent>(
  {
    id: "GUI",
    initial: "loading",
    predictableActionArguments: true,

    context: {
      mainMenuDialog: new MainMenuDialog({
        onStartPracticeButtonClick: () => {},
      }),
      mainMenuButton: new MainMenuButton(),
    },

    states: {
      loading: {
        on: {
          SHOW_MAIN_MENU: {
            target: "in_main_menu",
          },
        },
      },
      in_main_menu: {
        entry: "show_main_menu",
        on: {
          START_PRACTICE: {
            target: "in_practice_mode",
          },
        },
      },
      in_practice_mode: {},
    },

    schema: {
      events: {} as GuiEvent,
      services: {} as {},
    },
  },

  {
    actions: {
      show_main_menu: (ctx) => ctx.mainMenuDialog.showModal(),
      show_retry_loading_screen: (ctx) => showRetryLoadingScreen,
      show_return_to_main_menu_button: (ctx) => ctx.mainMenuButton.show(),
      refresh_page: () => {
        window.location.reload();
      },
    },
    guards: {},
    services: {},
  }
);
