import type { CSSProperties } from "react";

type TBrickProps = {
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export const Brick = ({ id, className, style }: TBrickProps) => {
  return <div id={id} className={`brick ${className}`} style={style} />;
};
