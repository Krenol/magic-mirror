import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Box } from "@mui/material";
import {
  cardStyle,
  headingBoxStyle,
  itemBoxStyle,
  mainBoxStyle,
} from "./style";
import CakeIcon from "@mui/icons-material/Cake";
import BirthdayItem from "./BirthdayItem/BirthdayItem";
import { useAppSelector } from "../../helpers/hooks";
import { isNewDay } from "../time_notifications/timeNotificationsSlice";
import { useGetBirthdays } from "../../apis/birthday";
import { CardFrame } from "../CardFrame";

export const Birthdays = () => {
  const newDayBegun = useAppSelector(isNewDay);

  const { data: birthdays, isLoading, error, refetch } = useGetBirthdays();

  useEffect(() => {
    if (newDayBegun) refetch();
  }, [newDayBegun, refetch]);

  const content = (
    <Box sx={mainBoxStyle}>
      <Box sx={headingBoxStyle}>
        <Typography color="text.primary" variant="body1" gutterBottom>
          Birthdays
        </Typography>
        <CakeIcon fontSize="small" />
      </Box>
      <Box sx={itemBoxStyle}>
        {birthdays?.list
          .slice(0, 3)
          .map((data) => <BirthdayItem item={data} key={data.name} />)}
      </Box>
    </Box>
  );

  if (isLoading)
    return <CardFrame cardContent={"Loading..."} cardStyle={cardStyle} />;

  if (error) return <CardFrame cardContent={"Error!"} cardStyle={cardStyle} />;

  return <CardFrame cardContent={content} cardStyle={cardStyle} />;
};

export default Birthdays;
