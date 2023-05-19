export const hideTextOverflow = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

export const boxStyle = {
    ...{
        padding: 1,
        borderRadius: 1,
        background: "rgba(28, 145, 255, 0.25)",
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
    },
    ...hideTextOverflow
}
