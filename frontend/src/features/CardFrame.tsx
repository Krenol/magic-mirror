import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box/Box"
import Card from "@mui/material/Card/Card"
import { ReactElement } from "react";

export const CardFrame = (props: CardFrameProps): ReactElement => {
    return (
        <Card sx={props.cardStyle}>
            <Box sx={props.parentBoxStyle}>
                {props.boxContent}
            </Box>
            {props.cardContent}
        </Card>
    )
}

export type CardFrameProps = {
    boxContent?: any
    cardStyle?: SxProps<Theme>
    parentBoxStyle?: SxProps<Theme>
    cardContent?: any
}