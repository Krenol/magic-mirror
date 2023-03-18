import { card_large } from "../../assets/styles/cards";

export const cardStyle = {
    ...card_large,
    ...{
        display: 'flex',
        justifyContent: 'center',
    }
}

export const parentBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
}

export const hourStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}

export const forecastImg = { width: 'auto', height: '3.0rem' }

export const hourBoxStyle = { display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }