import { create } from 'zustand';

import { createSelectors } from './createSelectors';

type State = {
  selectedApiKey: string | null;
};

type Action = {
  updateSelectedApiKey: (apiKey: string | null) => void;
};

const useApiKeyStoreBase = create<State & Action>((set) => ({
  selectedApiKey: '',

  updateSelectedApiKey: (apiKey) => set(() => ({ selectedApiKey: apiKey })),
}));

export const useApiKeyStore = createSelectors(useApiKeyStoreBase);
