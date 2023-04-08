import { BASE_CARD_SIZE } from "./cards";
import { MARGIN, PADDING } from "./theme";

export const dashboardStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    minWidth: 3 * BASE_CARD_SIZE + 3 * MARGIN,
    gap: PADDING
};