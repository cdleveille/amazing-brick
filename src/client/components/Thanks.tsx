import { Button } from "@/client/components/Button";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const Thanks = () => {
  const { styles } = useStyles();

  return (
    <div style={styles.thanksContainer}>
      <div style={styles.thanksText}>Thanks for the feedback!</div>
      <Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
        HOME
      </Button>
    </div>
  );
};
