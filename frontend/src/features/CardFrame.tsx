import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import Card from "@mui/material/Card/Card";
import { ReactNode } from "react";
import { card_small, card_medium, card_large } from "../assets/styles/cards";

export type CardProps = {
  children: ReactNode;
};

type ICardProps = {
  children: ReactNode;
  theme: SxProps<Theme>;
};

const ICard = ({ children, theme }: ICardProps) => {
  return <Card sx={theme}>{children}</Card>;
};

export const SmallCard = ({ children }: CardProps) => {
  return <ICard children={children} theme={card_small} />;
};

export const MediumCard = ({ children }: CardProps) => {
  return <ICard children={children} theme={card_medium} />;
};

export const LargeCard = ({ children }: CardProps) => {
  return <ICard children={children} theme={card_large} />;
};
