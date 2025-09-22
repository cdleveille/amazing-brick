import { Button } from "@/client/components/Button";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const Announcement = () => {
  const { styles } = useStyles();

  return (
    <div style={styles.thanksContainer}>
      <Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
        HOME
      </Button>
      <div style={styles.announcementText}>
        <p>9/19/2025</p>
        <p>
          Hey all, just wanted to say thanks for playing this little game I made in my free time.
          And thanks for the great feedback (positive and negative) many of you have left in the
          ratings. It's just a hobby project and I never expected this many people would ever
          discover this existed let alone enjoy playing it on the regular!
        </p>
        <p>
          I do acknowledge that there is some occasional glitchiness with submitting scores to the
          server at the end of a run, and I apologize to any of you who may have run into this. It
          looks like the game server (which I have running on free tier cloud resources) gets
          overloaded fairly easily when enough people are playing simultaneously. I am looking into
          a fix, so hang in there!
        </p>
        <p>Happy brickin',</p>
        <p>Chris</p>
      </div>
    </div>
  );
};
