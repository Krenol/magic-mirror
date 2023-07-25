import { Typography, Box } from "@mui/material";
import { Birthday } from "../../../models/birthdays";
import { boldText, xSmallFontSize } from "../../../assets/styles/theme";
import { useEffect, useState } from "react";
import { getDifferenceInDays } from "../../../helpers/dateParser";
import { boxStyle, hideTextOverflow } from "../../../assets/styles/coloredBox";

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
    <Box sx={boxStyle}>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Typography
          variant="subtitle2"
          color={color}
          align="left"
          sx={{ ...xSmallFontSize, ...sx }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="subtitle2"
          color={color}
          align="left"
          sx={{ ...xSmallFontSize, ...hideTextOverflow, ...sx }}
        >
          {timeText}
        </Typography>
      </Box>
    </Box>
  );
};

export default BirthdayItem;
