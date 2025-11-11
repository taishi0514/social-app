"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "teal",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
});

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
      forceColorScheme="light"
    >
      {children}
    </MantineProvider>
  );
}
