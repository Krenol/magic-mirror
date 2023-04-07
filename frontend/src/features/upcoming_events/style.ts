import { SxProps, Theme } from "@mui/material";
import { card_medium } from "../../assets/styles/cards";

export const cardStyle: SxProps<Theme> = { ...card_medium, ...{ display: 'flex', justifyContent: 'flex-start', gap: '10px' } }

export const parentBoxStyle: SxProps<Theme> = { display: 'flex' }

export const columnBoxStyle: SxProps<Theme> = { display: 'flex', justifyContent: 'start', flexDirection: 'column' }
