import { create } from "xoid";

import { initializeExperience } from "../initialize-experience";

type ExperienceStatuses =
  | "loading"
  | "loading-error"
  | "in-menu"
  | "in-practice";

type ExperienceState = {
  status: ExperienceStatuses;
  error: Error | null;
};

const initialState: ExperienceState = {
  status: "loading",
  error: null,
};

export const experienceAtom = create<
  ExperienceState,
  { initialize: () => void; startPractice: () => void }
>(initialState, (state) => ({
  initialize: async () => {
    try {
      await initializeExperience();
      state.focus("status").set("in-menu");
    } catch (e: unknown) {
      state.focus("status").set("loading-error");
      state.focus("error").set(e as Error);
    }
  },
  startPractice: () => {
    state.focus("status").set("in-practice");
  },
}));
