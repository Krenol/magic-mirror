export type BirthdayList = {
    count: number,
    iconLink: string,
    list: Array<Birthday>
}

export type Birthday = {
    name: string,
    date: string,
}