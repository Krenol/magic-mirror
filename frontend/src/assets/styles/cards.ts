import { PADDING, SPACING } from "./theme";

export const BASE_CARD_SIZE = 155;

export const card_small = {
  width: BASE_CARD_SIZE,
  height: BASE_CARD_SIZE,
};

export const card_medium = {
  width: BASE_CARD_SIZE * 2 + SPACING * PADDING,
  height: BASE_CARD_SIZE,
};

export const card_large = {
  width: BASE_CARD_SIZE * 3 + SPACING * PADDING * 2,
  height: BASE_CARD_SIZE,
};
