import { Button } from "@/client/components/Button";
import { Loading } from "@/client/components/Loading";
import { Text } from "@/client/components/Text";
import { useApp } from "@/client/hooks/useApp";
import { useIsOffline } from "@/client/hooks/useIsOffline";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const GameOver = () => {
  const { score, gameMode, scoreRes } = useApp();

  const isOffline = useIsOffline();

  const { styles } = useStyles();

  if (!isOffline && !scoreRes) return <Loading />;

  const { highScore, existingHighScore } = scoreRes ?? {};

  return (
    <div className="game-over-container" style={styles.gameOverContainer}>
      <h1 className="game-over-header" style={styles.gameOverHeader}>
        GAME OVER
      </h1>
      {isOffline && (
        <div className="blink" style={styles.offline}>
          <Text size={28}>OFFLINE</Text>
          <Text size={20} style={{ width: "70%", textAlign: "center" }}>
            Internet connection required to submit and view high score
          </Text>
        </div>
      )}
      {!isOffline && score === highScore && score > 0 && score > (existingHighScore ?? 0) && (
        <div className="new-high-score blink" style={styles.gameOverNewHighScore}>
          NEW HIGH SCORE!
        </div>
      )}
      <div className="game-over-box" style={styles.gameOverBox}>
        <Text size={20}>{gameMode.name.toUpperCase()}</Text>
        <div style={styles.gameOverBoxInner}>
          <div style={styles.gameOverBoxLabel}>
            <div>Score</div>
            <div style={styles.gameOverBoxValue}>{score}</div>
          </div>
          {!isOffline && (
            <div style={styles.gameOverBoxLabel}>
              <div>Best</div>
              <div style={styles.gameOverBoxValue}>{highScore}</div>
            </div>
          )}
        </div>
      </div>
      <div style={styles.buttonStack}>
        <Button screenTarget="play" backgroundColor={Color.Green} autoFocus>
          RETRY
        </Button>
        <Button screenTarget="home" backgroundColor={Color.Blue}>
          HOME
        </Button>
      </div>
    </div>
  );
};
