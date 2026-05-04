import { create } from "zustand";

type ResourceType = "flash_sale" | "category" | "todays_deal";

interface ResourceTypeStore {
  type: ResourceType[];
  addType: (val: ResourceType) => void;
  removeType: (val: ResourceType) => void;
}

export const useResourceType = create<ResourceTypeStore>((set) => ({
  type: [],

  addType: (val) =>
    set((state) => {
      if (state.type.includes(val)) return state;
      return { type: [...state.type, val] };
    }),

  removeType: (val) =>
    set((state) => ({
      type: state.type.filter((item) => item !== val),
    })),
}));
