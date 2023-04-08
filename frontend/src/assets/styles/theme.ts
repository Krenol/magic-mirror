import { createTheme } from "@mui/material/styles";
export const MARGIN = 15;
export const PADDING = '10px'

export const smallFontSize = { fontSize: 12.5 }
export const xSmallFontSize = { fontSize: 10.5 }
export const boldText = { fontWeight: 600 }

export const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    spacing: 4,
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
