import { Typography, Paper } from "@mui/material";
import { Birthday } from "../../../models/birthdays";
import {
  PAPER_CARD_COLOR,
  boldText,
  xSmallFontSize,
} from "../../../assets/styles/theme";
import { useEffect, useState } from "react";
import { getDifferenceInDays } from "../../../common/dateParser";

interface IBirthdayItem {
  item: Birthday;
}

const BirthdayItem = ({ item }: IBirthdayItem) => {
  const [days, setDays] = useState(0);
  const [sx, setSx] = useState({});
  const [color, setColor] = useState("text.secondary");
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    const bday = new Date(item.date);
    const today = new Date(new Date().toDateString());
    setDays(getDifferenceInDays(today, bday));
  }, [item.date]);

  useEffect(() => {
    if (days === 0) {
      setSx(boldText);
      setColor("text.primary");
      setTimeText("today");
    } else if (days === 1) {
      setSx({});
      setColor("text.primary");
      setTimeText(`tomorrow`);
    } else {
      setSx({});
      setColor("text.secondary");
      setTimeText(`${days} days`);
    }
  }, [days]);

  return (
    <Paper
      elevation={2}
      square={false}
      sx={{ background: PAPER_CARD_COLOR, padding: 0.5 }}
    >
      <Typography
        variant="subtitle2"
        color={color}
        align="left"
        sx={{ ...xSmallFontSize, ...sx }}
      >
        {item.name} {timeText}
      </Typography>
    </Paper>
  );
};

export default BirthdayItem;
