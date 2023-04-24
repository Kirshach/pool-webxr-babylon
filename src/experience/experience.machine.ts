import { createMachine } from "xstate";

import { initializeExperience } from "../features/initialize-experience";

export const experienceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWYB2AxmAHQA2A9gIYTZ5QDEE5eJtAbuQNYmoY75EyVGnQTtyBSgBdszANoAGALqKliUGnKxsM5upApEAWgCcAJmIKAbAGYAHOYDsCuwFZXNswEYANCACeiF6OjsQ2ACxmJnZ2wd6ONh4Avkl+vFi4hCQU1LQMWJjkmMRopNIAZkUAtsTp-FlCuaLikrp4qqr6mtpt+oYIXiauxFbmXjF2CgrOrnZmfoEIRjZexK7h4Y7rJom261bhKWnoGQLZwnkA+uWU2KSQ9ABKAKIAKo8AmpcAMgDyAIIAEQAkgA5ADinSQIG6OlkeD6QXCCksVjMrhcURMB3CXnmAWMeNWCh2NjRMVcji8uxSqRAeHIEDg+jqmSIXS0cL00P6Ri8VhRg3CVkckwxZkc2JsC2MZhca1JoysOJsCglR3AJ3qghyIigHJ68MRSy8eOIQpFYrVktsMqWIpGCmpUzs4QcCRMGtZZ0aTIgBq5CJ5iA2wzsZKGmMctnDdv5JjCm1GpqpZMldi9WrZ5yaUGut3u-uhsN6wYQbosKzcjm8EtiJl8BKWNhslg2W08uKsXlc2NctKSQA */
    id: "experience",
    initial: "loading",
    predictableActionArguments: true,

    states: {
      loading: {
        invoke: {
          src: "initiate_loading",
          onDone: "loaded",
          onError: "loading_failed",
        },
      },
      loaded: {},
      loading_failed: { on: { RETRY_LOADING: "loading" } },
    },

    schema: {
      events: {} as { type: "RETRY_LOADING" },
      services: {} as { initiate_loading: { data: {} } },
    },
  },

  {
    services: {
      initiate_loading: async (_context) => {
        await initializeExperience();
      },
    },
  }
);
