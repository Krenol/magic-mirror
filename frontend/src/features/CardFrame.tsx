import Box from "@mui/material/Box/Box"
import Card from "@mui/material/Card/Card"
import { Theme } from "@mui/material/styles/createTheme"
import { SxProps } from "@mui/system/styleFunctionSx"

export const CardFrame = (props: CardFrameProps): JSX.Element => {
    return (<Card sx={props.cardStyle}>
        <Box sx={props.parentBoxStyle}>
            {props.boxContent}
        </Box>
        {props.cardContent}
    </Card>)
}

export type CardFrameProps = {
    boxContent?: any
    cardStyle?: SxProps<Theme>
    parentBoxStyle?: SxProps<Theme>
    cardContent?: any
}