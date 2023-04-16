import { SxProps, Theme } from "@mui/material";
import { card_medium } from "../../assets/styles/cards";

export const colorBoxDimen = {
    width: 140,
    height: 50,
}

export const cardStyle: SxProps<Theme> = {
    ...card_medium,
    ...{
        display: 'flex',
    }
}

export const parentBoxStyle: SxProps<Theme> = { display: 'flex' }

export const columnBoxStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    minWidth: colorBoxDimen.width
}
