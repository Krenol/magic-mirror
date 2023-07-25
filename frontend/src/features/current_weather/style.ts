import { card_medium } from "../../assets/styles/cards";

export const cardStyle = {
  ...card_medium,
  ...{ display: "flex", justifyContent: "space-between" },
};

export const parentBoxStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const minMaxBoxStyle = { display: "flex", flexDirection: "row" };

export const mainBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  height: "100%",
};
