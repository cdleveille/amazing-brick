import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";

export const Score = () => {
  const { score } = useApp();
  const { styles } = useStyles();

  return (
    <div className="score" style={styles.score}>
      {score}
    </div>
  );
};
