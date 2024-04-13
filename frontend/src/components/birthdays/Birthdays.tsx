import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import { Stack } from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import BirthdayItem from "./BirthdayItem/BirthdayItem";
import { useGetBirthdays } from "../../apis/birthday";
import { SmallCard } from "../CardFrame";
import { TimeContext } from "../../common/TimeContext";

export const Birthdays = () => {
  const { newDay } = useContext(TimeContext);

  const { data: birthdays, isLoading, error, refetch } = useGetBirthdays();

  useEffect(() => {
    if (newDay) refetch();
  }, [newDay, refetch]);

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
        {birthdays?.list.slice(0, 4).map((data) => (
          <BirthdayItem item={data} key={data.name} />
        ))}
      </Stack>
    </SmallCard>
  );
};

export default Birthdays;
