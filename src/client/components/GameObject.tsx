import { Brick } from "@/client/components/Brick";
import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";
import { GameMode } from "@/shared/constants";

export const GameObject = () => {
  const { isGameMode } = useApp();
  const { styles } = useStyles();

  return (
    <>
      <div id="wall1-left" className="wall" />
      <div id="wall1-right" className="wall" />
      <div id="wall2-left" className="wall" />
      <div id="wall2-right" className="wall" />
      <div id="block1" className="block" />
      <div id="block2" className="block" />
      <div id="block3" className="block" />
      <div id="block4" className="block" />
      {isGameMode(GameMode.Gotcha) && (
        <>
          <Brick className="gotcha-brick" />
          <Brick className="gotcha-brick" />
        </>
      )}
      {isGameMode(GameMode.Shrouded) && <div className="absolute-center" style={styles.shroud} />}
      <Brick id="brick" style={styles.brick} />
    </>
  );
};
