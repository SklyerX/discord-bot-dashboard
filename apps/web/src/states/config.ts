import { create } from "zustand";

interface IConfig {
  data?: Payload;
  resetted: boolean;
  setData: (data: Payload) => void;
  setResetted: (data: boolean) => void;
  resetData: () => void;
}

export interface Payload {
  resetOnError?: boolean;
  dontAllowSameUser?: boolean;
  banOnError?: boolean;
}

export const useConfigStore = create<IConfig>()((set) => ({
  resetted: false,
  setData: (data) => set({ data }),
  setResetted: (param: boolean) => set({ resetted: param }),
  resetData: () => set({ data: undefined }),
}));
