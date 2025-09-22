import type React from "react";

import { useStyles } from "@/client/hooks/useStyles";

type TTextProps = {
  children: React.ReactNode;
  size: number;
  style?: React.CSSProperties;
};

export const Text = ({ children, size, style }: TTextProps) => {
  const { styles } = useStyles();
  return <span style={{ ...style, ...styles.text(size) }}>{children}</span>;
};
