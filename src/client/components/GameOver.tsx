import CircularProgress from "@mui/material/CircularProgress";

import { Button } from "@/client/components/Button";
import { Text } from "@/client/components/Text";
import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const GameOver = () => {
  const { score, gameMode, scoreRes, canvas } = useApp();

  const { styles } = useStyles();

  const { highScore, existingHighScore } = scoreRes ?? {};

  return (
    <div className="game-over-container" style={styles.gameOverContainer}>
      <h1 className="game-over-header" style={styles.gameOverHeader}>
        GAME OVER
      </h1>
      {existingHighScore !== undefined &&
        score === highScore &&
        score > 0 &&
        score > existingHighScore && (
          <div className="new-high-score blink" style={styles.gameOverNewHighScore}>
            NEW PERSONAL BEST!
          </div>
        )}
      <div className="game-over-box" style={styles.gameOverBox}>
        <Text size={20}>{gameMode.name.toUpperCase()}</Text>
        <div style={styles.gameOverBoxInner}>
          <div style={styles.gameOverBoxLabel}>
            <div>Score</div>
            <div style={styles.gameOverBoxValue}>{score}</div>
          </div>
          <div style={styles.gameOverBoxLabel}>
            <div>Best</div>
            {highScore ? (
              <div style={styles.gameOverBoxValue}>{highScore}</div>
            ) : (
              <CircularProgress
                size={`${36 * canvas.scaleRatio}px`}
                sx={{ ...styles.loadingIndicator, marginTop: `${10 * canvas.scaleRatio}px` }}
              />
            )}
          </div>
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
