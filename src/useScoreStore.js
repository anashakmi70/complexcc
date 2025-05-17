import { create } from "zustand";

const LOCAL_STORAGE_KEY = "l6ooshGameData";

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const defaultScores = () => {
  const rounds = {};
  for (let r = 1; r <= 4; r++) {
    rounds[r] = {
      1: Array(4).fill().map(() => ({
        L6oosh: { count: 0 },
        Diamonds: { count: 0 },
        Queens: { count: 0, doubled: false, playedBy: null },
        King: { count: 0, doubled: false, playedBy: null },
      })),
      2: Array(4).fill().map(() => ({
        L6oosh: { count: 0 },
        Diamonds: { count: 0 },
        Queens: { count: 0, doubled: false, playedBy: null },
        King: { count: 0, doubled: false, playedBy: null },
      })),
    };
  }
  return rounds;
};

const defaultNames = ["Player 1", "Player 2", "Player 3", "Player 4"];

export const useScoreStore = create((set, get) => {
  const saved = loadFromStorage();
  const initialScores = saved?.scores || defaultScores();
  const initialNames = saved?.names || defaultNames;

  return {
    scores: initialScores,
    names: initialNames,

    setScores: (newScores) => {
      set({ scores: newScores });
      saveToStorage({ scores: newScores, names: get().names });
    },

    setNames: (newNames) => {
      set({ names: newNames });
      saveToStorage({ scores: get().scores, names: newNames });
    },

    resetScores: () => {
      const reset = defaultScores();
      set({ scores: reset, names: defaultNames });
      saveToStorage({ scores: reset, names: defaultNames });
    },
  };
});