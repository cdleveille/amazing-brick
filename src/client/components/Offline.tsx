import { Button } from "@/client/components/Button";
import { Text } from "@/client/components/Text";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

type TOfflineProps = {
  message: string;
  isHideHomeBtn?: boolean;
};

export const Offline = ({ message, isHideHomeBtn }: TOfflineProps) => {
  const { styles } = useStyles();

  return (
    <div className="offline-container" style={styles.scoresContainer}>
      {!isHideHomeBtn && (
        <Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
          HOME
        </Button>
      )}
      <div className="blink" style={styles.offline}>
        <Text size={28}>OFFLINE</Text>
        <Text size={20} style={{ width: "70%", textAlign: "center" }}>
          {message}
        </Text>
      </div>
    </div>
  );
};
