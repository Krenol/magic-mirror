import { createTheme } from "@mui/material/styles";
export const PADDING = 2
export const SPACING = 4;

export const smallFontSize = { fontSize: 12.5 }
export const xSmallFontSize = { fontSize: 10.5 }
export const boldText = { fontWeight: 600 }

export const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    spacing: SPACING,
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    display: "inline-block",
                    padding: 10,
                }
            }
        },
    },
});
