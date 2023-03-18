import { card_medium } from "../../assets/styles/cards";

export const cardStyle = {
    ...card_medium,
    ...{
        display: 'flex',
        justifyContent: 'start'
    }
}

export const headingBoxStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}

export const mainBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%'
};

export const itemBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
};