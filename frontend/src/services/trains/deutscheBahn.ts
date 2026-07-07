import { externalFetchJson } from '../../common/externalFetch'
import { TrainConnection, TrainLeg, TrainStation } from '../../models/trains'

export const DB_API_BASE_URL = 'https://v6.db.transport.rest'

type TrainLocationCoordinates = {
    latitude: number
    longitude: number
}

type TrainLocation = {
    type: 'location' | 'stop' | 'station'
    id: string
    name: string
    location?: TrainLocationCoordinates
}

type TrainLine = {
    name: string
}

type TrainLegResponse = {
    origin: TrainLocation
    destination: TrainLocation
    departure: string | null
    plannedDeparture: string
    departureDelay?: number | null
    arrival: string | null
    plannedArrival: string
    line?: TrainLine
    direction?: string
    departurePlatform?: string
    arrivalPlatform?: string
    walking?: boolean
    cancelled?: boolean
    distance?: number
}

type TrainJourney = {
    legs: TrainLegResponse[]
}

export const searchStations = async (
    query: string,
    results: number = 10
): Promise<TrainStation[]> => {
    const url = `${DB_API_BASE_URL}/locations?query=${encodeURIComponent(query)}&results=${results}&poi=false&addresses=false`
    const locations = await externalFetchJson<TrainLocation[]>(url)
    return locations
        .filter((loc) => loc.type === 'station' || loc.type === 'stop')
        .map((loc) => ({
            id: loc.id,
            name: loc.name,
            latitude: loc.location?.latitude,
            longitude: loc.location?.longitude,
        }))
}

export const getConnections = async (
    fromStationId: string,
    toStationId: string,
    results: number = 5
): Promise<TrainConnection[]> => {
    const url = `${DB_API_BASE_URL}/journeys?from=${encodeURIComponent(fromStationId)}&to=${encodeURIComponent(toStationId)}&results=${results}`
    const response = await externalFetchJson<{ journeys: TrainJourney[] }>(url)
    const journeys = response.journeys ?? []

    const connections: TrainConnection[] = []
    for (const journey of journeys) {
        if (!journey.legs || journey.legs.length === 0) {
            continue
        }

        const firstLeg = journey.legs[0]
        const lastLeg = journey.legs[journey.legs.length - 1]

        const departureStr = firstLeg.departure ?? firstLeg.plannedDeparture
        const arrivalStr = lastLeg.arrival ?? lastLeg.plannedArrival
        const departure = new Date(departureStr)
        const arrival = new Date(arrivalStr)
        const duration = Math.floor(
            (arrival.getTime() - departure.getTime()) / 1000 / 60
        )

        const legs: TrainLeg[] = journey.legs.map((leg) => {
            const legDepartureStr = leg.departure ?? leg.plannedDeparture
            const legArrivalStr = leg.arrival ?? leg.plannedArrival
            const legDeparture = new Date(legDepartureStr)
            const legArrival = new Date(legArrivalStr)
            const legDuration = Math.floor(
                (legArrival.getTime() - legDeparture.getTime()) / 1000 / 60
            )
            return {
                departure: legDepartureStr,
                arrival: legArrivalStr,
                departureStation: leg.origin.name,
                arrivalStation: leg.destination.name,
                line: leg.line?.name,
                direction: leg.direction,
                departurePlatform: leg.departurePlatform ?? undefined,
                arrivalPlatform: leg.arrivalPlatform ?? undefined,
                delay: leg.departureDelay ?? undefined,
                duration: legDuration,
                walking: leg.walking === true,
                cancelled: leg.cancelled === true,
                distance: leg.distance,
            }
        })

        connections.push({
            departure: departureStr,
            arrival: arrivalStr,
            departureStation: firstLeg.origin.name,
            arrivalStation: lastLeg.destination.name,
            departurePlatform: firstLeg.departurePlatform,
            arrivalPlatform: lastLeg.arrivalPlatform,
            delay: firstLeg.departureDelay ?? undefined,
            duration,
            legs,
        })
    }

    return connections
}
