import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: {
        name: 'iniesta',
        position: 'jogador caro',
        gender: 'masculino',
    },

    setUser: (newData) => set((state) => ({
        user: { ...state.user, ...newData }
    })),

    logout: () =>
        set({
            user: { name: '', position: '', gender: '' },
        }),
    }),
    {
      name: 'user-lavanderia-brilhante',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;