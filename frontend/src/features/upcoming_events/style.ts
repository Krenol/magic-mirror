import { card_medium } from "../../assets/styles/cards";

export const colorBoxDimen = {
    width: 140,
    height: 50,
}

export const cardStyle = {
    ...card_medium,
    ...{
        display: 'flex',
    }
}

export const parentBoxStyle = { display: 'flex' }

export const columnBoxStyle = {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    minWidth: colorBoxDimen.width
}
