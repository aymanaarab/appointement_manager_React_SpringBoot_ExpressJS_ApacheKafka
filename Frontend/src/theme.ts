import { Button, createTheme, LoadingOverlay } from "@mantine/core";

export const theme = createTheme({
  /** Put your mantine theme override here */
  // defaultRadius:'md',
  cursorType: "pointer",

  // primaryColor: 'deep-blue',
  primaryColor: "green",
  colors: {
    "deep-blue": [
      "#ecefff",
      "#d5dafb",
      "#a9b1f1",
      "#7a87e9",
      "#5362e1",
      "#3a4bdd",
      "#2c40dc",
      "#1f32c4",
      "#182cb0",
      "#0a259c",
    ],
    violet: [
      "#f7ecff",
      "#e7d6fb",
      "#caaaf1",
      "#ac7ce8",
      "#9354e0",
      "#833bdb",
      "#7b2eda",
      "#6921c2",
      "#5d1cae",
      "#501599",
    ],
  },
  components: {
    LoadingOverlay: LoadingOverlay.extend({
      defaultProps: {
        loaderProps: { type: "dots", size: "md" },
      },
    }),
  },
  // components: {
  //   Button: {
  //     defaultProps: {
  //       variant: 'gradient', // Set the default variant to 'gradient'
  //     },
  //   },
  // },
  // defaultGradient: {
  //   from: 'green',
  //   to: 'red',
  //   deg: 45,
  // },
});
