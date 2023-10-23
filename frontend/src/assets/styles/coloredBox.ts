export const hideTextOverflow = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const boxStyle = {
  ...{
    borderRadius: 1,
    background: "rgba(28, 145, 255, 0.25)",
  },
  ...hideTextOverflow,
};
