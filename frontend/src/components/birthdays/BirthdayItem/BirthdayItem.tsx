import { Typography, Paper, Stack } from "@mui/material";
import { Birthday } from "../../../models/birthdays";
import { PAPER_CARD_COLOR, xSmallFontSize } from "../../../assets/styles/theme";
import { useEffect, useState } from "react";
import { getDifferenceInDays } from "../../../common/dateParser";
import { hideTextOverflow } from "../../../assets/styles/coloredBox";

interface IBirthdayItem {
  item: Birthday;
}

const BirthdayItem = ({ item }: IBirthdayItem) => {
  const [days, setDays] = useState(0);
  const [color, setColor] = useState("text.secondary");
  const [timeText, setTimeText] = useState("");
  const [fontWeight, setFontWeight] = useState("normal");

  useEffect(() => {
    const bday = new Date(item.date);
    const today = new Date(new Date().toDateString());
    setDays(getDifferenceInDays(today, bday));
  }, [item.date]);

  useEffect(() => {
    if (days === 0) {
      setFontWeight("bold");
      setColor("text.primary");
      setTimeText("today");
    } else if (days === 1) {
      setFontWeight("normal");
      setColor("text.primary");
      setTimeText(`tomorrow`);
    } else {
      setFontWeight("normal");
      setColor("text.secondary");
      setTimeText(`${days} days`);
    }
  }, [days]);

  return (
    <Paper
      elevation={2}
      square={false}
      sx={{
        background: PAPER_CARD_COLOR,
        padding: 0.5,
      }}
    >
      <Stack
        direction={"row"}
        spacing={1}
        whiteSpace={"nowrap"}
        overflow={"hidden"}
      >
        <Typography
          color={color}
          fontWeight={fontWeight}
          fontSize={xSmallFontSize}
          sx={{ ...hideTextOverflow }}
        >
          {item.name}
        </Typography>
        <Typography
          color={color}
          fontWeight={fontWeight}
          fontSize={xSmallFontSize}
        >
          {timeText}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default BirthdayItem;
