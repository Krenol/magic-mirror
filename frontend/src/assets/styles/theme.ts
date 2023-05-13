import { SxProps, createTheme } from "@mui/material/styles";
import { Theme } from "@emotion/react"
export const PADDING = 2
export const SPACING = 4;

export const smallFontSize: SxProps<Theme> = { fontSize: 12.5 }
export const xSmallFontSize: SxProps<Theme> = { fontSize: 10.5 }
export const boldText: SxProps<Theme> = { fontWeight: 600 }

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
