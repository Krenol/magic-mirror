import { SxProps, Theme } from "@mui/material";
import { card_medium } from "../../assets/styles/cards";

export const eventItemDimen = {
    width: 140,
    height: 50,
}

export const cardStyle: SxProps<Theme> = {
    ...card_medium,
    ...{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 1
    }
}

export const parentBoxStyle: SxProps<Theme> = { display: 'flex' }

export const columnBoxStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    minWidth: eventItemDimen.width,
    gap: 1
}
