import { Theme } from "@emotion/react"
import { SxProps } from "@mui/material"

export const hideTextOverflow: SxProps<Theme> = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

export const sx: SxProps<Theme> = {
    ...{
        padding: '5px',
        paddingTop: '2px',
        paddingBottom: '2px',
        borderRadius: '5px',
        background: "rgba(28, 145, 255, 0.25)",
        width: 125,
        height: 50,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    hideTextOverflow
}