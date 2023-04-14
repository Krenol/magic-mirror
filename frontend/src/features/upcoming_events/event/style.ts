import { Theme } from "@emotion/react"
import { SxProps } from "@mui/material"
import { eventItemDimen } from "../style"

export const hideTextOverflow: SxProps<Theme> = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

export const sx: SxProps<Theme> = {
    ...{
        padding: 1,
        borderRadius: 1,
        background: "rgba(28, 145, 255, 0.25)",
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
    },
    ...hideTextOverflow,
    ...eventItemDimen
}