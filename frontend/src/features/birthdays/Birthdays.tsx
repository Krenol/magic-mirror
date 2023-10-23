import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import BirthdayItem from "./BirthdayItem/BirthdayItem";
import { useAppSelector } from "../../common/hooks";
import { isNewDay } from "../../common/slices/timeNotificationsSlice";
import { useGetBirthdays } from "../../apis/birthday";
import { SmallCard } from "../CardFrame";

export const Birthdays = () => {
  const newDayBegun = useAppSelector(isNewDay);

  const { data: birthdays, isLoading, error, refetch } = useGetBirthdays();

  useEffect(() => {
    if (newDayBegun) refetch();
  }, [newDayBegun, refetch]);

  if (isLoading) return <SmallCard>Loading...</SmallCard>;

  if (error) return <SmallCard>Error!</SmallCard>;

  return (
    <SmallCard>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography color="text.primary" variant="body1" gutterBottom>
          Birthdays
        </Typography>
        <CakeIcon fontSize="small" />
      </Stack>
      <Stack direction={"column"} spacing={2}>
        {birthdays?.list
          .slice(0, 4)
          .map((data) => <BirthdayItem item={data} key={data.name} />)}
      </Stack>
    </SmallCard>
  );
};

export default Birthdays;
