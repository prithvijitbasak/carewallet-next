import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  authModalOpen: boolean;
}

export const initialUiState: UiState = {
  authModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    setRegisterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
  },
});

export const { setAuthModalOpen, setLoginModalOpen, setRegisterModalOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
