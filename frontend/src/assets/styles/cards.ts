import { MARGIN } from "./theme"

export const BASE_CARD_SIZE = 150

export const card_small = {
    width: BASE_CARD_SIZE,
    height: BASE_CARD_SIZE,
    maxWidth: BASE_CARD_SIZE,
    maxHeight: BASE_CARD_SIZE
}

export const card_medium = {
    width: BASE_CARD_SIZE * 2,
    height: BASE_CARD_SIZE,
    maxWidth: BASE_CARD_SIZE * 2,
    maxHeight: BASE_CARD_SIZE
}

export const card_large = {
    width: BASE_CARD_SIZE * 3 + MARGIN,
    height: BASE_CARD_SIZE,
    maxWidth: BASE_CARD_SIZE * 3 + MARGIN,
    maxHeight: BASE_CARD_SIZE
}
