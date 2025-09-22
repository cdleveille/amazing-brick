import { useEffect, useState } from "react";

import { Text } from "@/client/components/Text";
import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";
import type { TScreen } from "@/shared/types";

type TButtonProps = {
  backgroundColor: string;
  screenTarget?: TScreen;
  onClick?: () => void;
  children?: React.ReactNode;
  autoFocus?: boolean;
  forceTouch?: boolean;
  disabled?: boolean;
};

export const Button = ({
  backgroundColor,
  screenTarget,
  onClick,
  children,
  autoFocus,
  forceTouch,
  disabled,
}: TButtonProps) => {
  const [isClickable, setIsClickable] = useState(false);

  const { setScreen } = useApp();

  const { styles } = useStyles();

  useEffect(() => {
    const timeout = setTimeout(() => setIsClickable(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleClick = () => {
    if (!isClickable) return;
    if (screenTarget) setScreen(screenTarget);
    onClick?.();
  };

  const handleTouchEnd = () => {
    if (!forceTouch) return;
    handleClick();
  };

  return (
    <button
      type="button"
      className="btn"
      style={styles.button(backgroundColor)}
      onClick={handleClick}
      autoFocus={autoFocus}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
    >
      <Text size={26}>{children}</Text>
    </button>
  );
};
