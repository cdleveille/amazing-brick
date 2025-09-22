import AnnouncementIcon from "@mui/icons-material/Announcement";
import Tooltip from "@mui/material/Tooltip";

import { Brick } from "@/client/components/Brick";
import { Button } from "@/client/components/Button";
import { GameModeMenu } from "@/client/components/GameMode";
import { Text } from "@/client/components/Text";
import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const Home = () => {
  const { gameMode, setGameMode, isDarkMode, setScreen } = useApp();
  const { styles } = useStyles();

  return (
    <div className="home-container" style={styles.homeContainer}>
      <Tooltip
        title="Thanks for playing Amazing Brick! ❤️"
        placement="right"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [-5, -12],
                },
              },
            ],
          },
        }}
        arrow
        open
      >
        <button
          type="button"
          className="btn-dark-mode"
          onClick={() => setScreen("announcement")}
          style={styles.announcementBtn}
          aria-label="Announcement"
        >
          {isDarkMode ? (
            <AnnouncementIcon sx={styles.darkModeBtnIcon("#cccccc")} />
          ) : (
            <AnnouncementIcon sx={styles.darkModeBtnIcon("#555555")} />
          )}
        </button>
      </Tooltip>
      <div className="header-container">
        <h1 className="header" style={styles.homeHeader}>
          AMAZING BRICK&nbsp;
        </h1>
        <Brick style={styles.homeBrick} />
      </div>
      <div className="game-mode-select" style={styles.homeGameModeSelect}>
        <GameModeMenu value={gameMode} onSelectOption={gameMode => setGameMode(gameMode)} />
        <Text size={18} style={styles.homeGameModeDescription}>
          {gameMode.description}
        </Text>
      </div>
      <div style={styles.buttonStack}>
        <Button screenTarget="play" backgroundColor={Color.Green} autoFocus>
          PLAY
        </Button>
        <Button screenTarget="scores" backgroundColor={Color.Blue}>
          SCORES
        </Button>
        <Button screenTarget="rate" backgroundColor={Color.Red}>
          RATE
        </Button>
      </div>
    </div>
  );
};
