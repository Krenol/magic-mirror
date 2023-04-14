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
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
}

export const dailyStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}

export const forecastImg = { width: 'auto', height: '3.0rem' }

export const minMaxBoxStyle = { display: 'flex', flexDirection: 'row' }

export const dayBoxStyle = { display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }