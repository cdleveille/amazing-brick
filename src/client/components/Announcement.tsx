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
        <Announcement_9_21_2025 />
      </div>
    </div>
  );
};

const Announcement_9_21_2025 = () => {
  return (
    <>
      <p>9/21/2025</p>
      <p>
        Just made some updates that should help the game server run more smoothly! So hopefully no
        more glitches, but please leave a rating letting me know if you notice any issues.
      </p>
      <p>
        I have read quite a few ratings commenting on how difficult the game is. And yes, I totally
        agree with you! It is designed to be challenging, and I promise if you keep trying you will
        get better. But I hear you, and I want to make it fun for the less hardcore players as well,
        so I am looking into designing an easier, more casual game mode. Check back soon!
      </p>
      <p>Oh, whoever got 932 - you're an animal.</p>
      <p>Keep on brickin',</p>
      <p>Chris</p>
      <p>
        P.S. Check out some of my other games and projects{" "}
        <a href="https://cdleveille.net/#projects" target="_blank" rel="noreferrer">
          here
        </a>
        !
      </p>
    </>
  );
};

// const Announcement_9_19_2025 = () => {
//   return (
//     <>
//       <p>9/19/2025</p>
//       <p>
//         Hey all, just wanted to say thanks for playing this little game I made in my free time. And
//         thanks for the great feedback (positive and negative) many of you have left in the ratings.
//         It's just a hobby project and I never expected this many people would ever discover this
//         existed let alone enjoy playing it on the regular!
//       </p>
//       <p>
//         I do acknowledge that there is some occasional glitchiness with submitting scores to the
//         server at the end of a run, and I apologize to any of you who may have run into this. It
//         looks like the game server (which I have running on free tier cloud resources) gets
//         overloaded fairly easily when enough people are playing simultaneously. I am looking into a
//         fix, so hang in there!
//       </p>
//       <p>Happy brickin',</p>
//       <p>Chris</p>
//     </>
//   );
// };
