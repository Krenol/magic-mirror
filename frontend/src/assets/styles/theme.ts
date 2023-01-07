import { createTheme } from "@mui/material/styles";
export const MARGIN = 15;

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
                    margin: MARGIN,
                    padding: 15,
                    marginRight: 0,
                    marginBottom: 0
                }
            }
        },

    },
});