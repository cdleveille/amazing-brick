import { useState } from "react";

import { Button } from "@/client/components/Button";
import { GameModeMenu } from "@/client/components/GameMode";
import { Loading } from "@/client/components/Loading";
import { Offline } from "@/client/components/Offline";
import { Text } from "@/client/components/Text";
import { useGetLeaderboard } from "@/client/hooks/useApi";
import { useApp } from "@/client/hooks/useApp";
import { useIsOffline } from "@/client/hooks/useIsOffline";
import { useStyles } from "@/client/hooks/useStyles";
import { Color, GameMode } from "@/shared/constants";

export const Scores = () => {
  const { player_id, gameMode } = useApp();

  const [selectedGameMode, setSelectedGameMode] = useState(gameMode);

  const isOffline = useIsOffline();

  const { styles } = useStyles();

  const { data } = useGetLeaderboard(player_id);

  if (isOffline) return <Offline message="Internet connection required to view scores" />;

  if (!data?.data) return <Loading />;

  const { data: scores } = data;

  const selectedPlayerScore = (() => {
    switch (selectedGameMode.name) {
      case GameMode.Standard:
        return scores.playerScore.standardScore;
      case GameMode.Sprint:
        return scores.playerScore.sprintScore;
      case GameMode.Shrouded:
        return scores.playerScore.shroudedScore;
      case GameMode.Gotcha:
        return scores.playerScore.gotchaScore;
      default:
        return 0;
    }
  })();

  const selectedRank = (() => {
    switch (selectedGameMode.name) {
      case GameMode.Standard:
        return scores.playerScore.standardRank;
      case GameMode.Sprint:
        return scores.playerScore.sprintRank;
      case GameMode.Shrouded:
        return scores.playerScore.shroudedRank;
      case GameMode.Gotcha:
        return scores.playerScore.gotchaRank;
      default:
        return "N/A";
    }
  })();

  const selectedTop = (() => {
    switch (selectedGameMode.name) {
      case GameMode.Standard:
        return scores.playerScore.standardTop;
      case GameMode.Sprint:
        return scores.playerScore.sprintTop;
      case GameMode.Shrouded:
        return scores.playerScore.shroudedTop;
      case GameMode.Gotcha:
        return scores.playerScore.gotchaTop;
      default:
        return "N/A";
    }
  })();

  const selectedScores = (() => {
    switch (selectedGameMode.name) {
      case GameMode.Standard:
        return scores.standardScores;
      case GameMode.Sprint:
        return scores.sprintScores;
      case GameMode.Shrouded:
        return scores.shroudedScores;
      case GameMode.Gotcha:
        return scores.gotchaScores;
      default:
        return [];
    }
  })();

  return (
    <div className="scores-container" style={styles.scoresContainer}>
      <Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
        HOME
      </Button>
      <GameModeMenu
        value={selectedGameMode}
        onSelectOption={gameMode => setSelectedGameMode(gameMode)}
      />
      <div className="player-high-score-box" style={styles.scoresBox}>
        <div style={styles.scoresBoxLabel}>
          <div>Best</div>
          <div style={styles.scoresBoxValue}>{selectedPlayerScore}</div>
        </div>
        <div style={styles.scoresBoxLabel}>
          <div>Rank</div>
          <div style={styles.scoresBoxValue}>{selectedRank}</div>
        </div>
        <div style={styles.scoresBoxLabel}>
          <div>Top</div>
          <div style={styles.scoresBoxValue}>{selectedTop}</div>
        </div>
      </div>
      {selectedScores?.length > 0 ? (
        <div style={{ width: "85%", textAlign: "center" }}>
          <Text size={36}>Top 10</Text>
          <div style={styles.scoresTopTenContainer}>
            {selectedScores.map((score, index) => (
              <div key={index} style={styles.scoresTopTenItem(index)}>
                <Text size={28} style={{ transition: "unset !important" }}>
                  {score}
                </Text>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Text size={28}>No scores yet!</Text>
      )}
    </div>
  );
};
