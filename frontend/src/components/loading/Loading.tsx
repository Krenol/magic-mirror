import { CircularProgress, Stack } from '@mui/material'
import { LargeCard, MediumCard, SmallCard } from '../CardFrame'

type Props = {
    Card: typeof MediumCard | typeof SmallCard | typeof LargeCard
}

function Loading({ Card }: Readonly<Props>) {
    return (
        <Card>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1, height: '100%' }}
            >
                <CircularProgress />
            </Stack>
        </Card>
    )
}

export default Loading
