import { createTheme } from "@mui/material/styles";
export const PADDING = 2;
export const SPACING = 4;

export const smallFontSize = { fontSize: 12.5 };
export const xSmallFontSize = { fontSize: 10.5 };

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  spacing: SPACING,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          display: "inline-block",
          padding: 10,
        },
      },
    },
  },
});

export const PAPER_CARD_COLOR = "rgba(28, 145, 255, 0.25)";
