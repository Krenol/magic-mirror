import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

type TimeContextType = { newDay: boolean; newHour: boolean }

const defaultValue: TimeContextType = { newDay: false, newHour: false }

const TimeContext = createContext(defaultValue)

const TimeContextProvider = ({ children }: { children: JSX.Element }) => {
    const [newDay, setNewDay] = useState(false)
    const [newHour, setNewHour] = useState(false)
    const [previousDate, setPreviousDate] = useState(new Date())
    const [previousHours, setPreviousHours] = useState(previousDate.getHours())

    const handleDayCheck = useCallback(
        (currentDate: Date) => {
            const isNewDayFlag =
                currentDate.getDate() !== previousDate.getDate()
            if (newDay !== isNewDayFlag) {
                setNewDay(isNewDayFlag)
            }
            if (isNewDayFlag) {
                setPreviousDate(currentDate)
            }
        },
        [newDay, setPreviousDate, previousDate]
    )

    const handleHourCheck = useCallback(
        (currentDate: Date) => {
            const isNewHourFlag = currentDate.getHours() !== previousHours
            if (newHour !== isNewHourFlag) {
                setNewHour(isNewHourFlag)
            }
            if (isNewHourFlag) {
                setPreviousHours(currentDate.getHours())
            }
        },
        [previousHours, newHour]
    )

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date()
            handleDayCheck(currentDate)
            handleHourCheck(currentDate)
        }, 1000)
        return () => clearInterval(intervalId)
    }, [previousDate, handleDayCheck, handleHourCheck])

    const value = useMemo(() => ({ newDay, newHour }), [newDay, newHour])

    return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>
}

export { TimeContextProvider, TimeContext }
