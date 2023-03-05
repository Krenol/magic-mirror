import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EventItem } from "../../../models/calendar";

interface IEventItem {
    item: EventItem,
}

const Event = ({ item }: IEventItem) => {
    return (
        <Box>
            <Typography variant="subtitle1" color="text.primary" align="center">
                {item.summary}
            </Typography>
        </Box>
    );
}