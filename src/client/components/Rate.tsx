import { Textarea } from "@mui/joy";
import { useState } from "react";
import { Button } from "@/client/components/Button";
import { Offline } from "@/client/components/Offline";
import { Text } from "@/client/components/Text";
import { usePostRating } from "@/client/hooks/useApi";
import { useApp } from "@/client/hooks/useApp";
import { useIsOffline } from "@/client/hooks/useIsOffline";
import { useStyles } from "@/client/hooks/useStyles";
import { Color } from "@/shared/constants";

export const Rate = () => {
  const [isThumbsUp, setIsThumbsUp] = useState<boolean>();
  const [comments, setComments] = useState<string>("");

  const { mutate: postRating } = usePostRating();

  const isOffline = useIsOffline();

  const { styles } = useStyles();

  const { setScreen, player_id } = useApp();

  if (isOffline) return <Offline message="Internet connection required to submit rating" />;

  const isSubmitDisabled = typeof isThumbsUp !== "boolean" || comments.trim() === "";

  const placeholder =
    isThumbsUp === true
      ? "What do you like about Amazing Brick?"
      : isThumbsUp === false
        ? "What could be improved in Amazing Brick?"
        : "What do you think of Amazing Brick?";

  return (
    <div className="rate-container" style={styles.rateContainer}>
      <div style={styles.rateThumbButtons}>
        <RateButton
          type="thumbs-up"
          onClick={() => setIsThumbsUp(true)}
          isSelected={isThumbsUp === true}
        />
        <RateButton
          type="thumbs-down"
          onClick={() => setIsThumbsUp(false)}
          isSelected={isThumbsUp === false}
        />
      </div>
      <Textarea
        className="text-area"
        value={comments}
        sx={styles.rateTextArea}
        onChange={e => setComments(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
      />
      <div style={styles.buttonStack}>
        <Button
          disabled={isSubmitDisabled}
          onClick={() => {
            if (isSubmitDisabled) return;
            postRating({
              player_id,
              is_thumbs_up: isThumbsUp,
              comments: comments.trim(),
            });
            setScreen("thanks");
          }}
          backgroundColor={Color.Green}
        >
          <Text size={26}>SUBMIT</Text>
        </Button>
        <Button screenTarget="home" backgroundColor={Color.Blue}>
          BACK
        </Button>
      </div>
    </div>
  );
};

type TRateButtonProps = {
  type: "thumbs-up" | "thumbs-down";
  onClick: () => void;
  isSelected: boolean;
};

const RateButton = ({ type, onClick, isSelected }: TRateButtonProps) => {
  const { styles } = useStyles();

  return (
    <button
      type="button"
      className="btn-rate"
      onClick={onClick}
      style={styles.rateThumbButton(isSelected)}
      disabled={isSelected}
      aria-label={`${type === "thumbs-up" ? "Thumbs Up" : "Thumbs Down"}`}
    >
      {type === "thumbs-up" ? <ThumbsUpSvg /> : <ThumbsDownSvg />}
    </button>
  );
};

const ThumbsUpSvg = () => {
  const { styles } = useStyles();

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styles.rateThumbSvg}
    >
      <title>Thumbs Up</title>
      <path
        d="M12.313 5.531c0-2.9 2.124-3.583 3.312-3.562 2.413 0 3.082 2.009 3.281 3.078.248 1.33.006 4.509-.106 5.969l-.003.041a2.25 2.25 0 0 1 .515-.057h3.858c1.56 0 2.83 1.27 2.83 2.83 0 .806-.259 1.535-.765 2.05 1.044.461 1.765 1.428 1.765 2.544 0 1.023-.463 1.92-1.364 2.418.823.511 1.364 1.366 1.364 2.332 0 1.107-.543 2.069-1.598 2.533.375.386.598.96.598 1.794 0 1.38-.969 2.502-2.83 2.502h-3.858c-.045 0-.09 0-.134-.003h-3.131C5.609 30.172 5 23.406 5 20.656c0-5.156 2.298-6.689 4.34-8.051.966-.644 1.875-1.25 2.457-2.183.488-.783.515-1.5.515-4.89Z"
        fill="#FFC83D"
      />
      <path
        d="M19 11c-1.02.031-4 .594-4 2.969 0 1.25.469 1.953 1.031 2.344-.562.25-1.062 1.178-1.062 2.328 0 1.28 1.062 2.218 1.062 2.218s-1.062 1.032-1.062 2.266c0 .932.408 1.62 1.062 2.088-.354.2-1.062.893-1.062 2.068 0 1.401 1.308 2.575 3.87 2.68-1.248-.231-1.855-1.375-1.855-2.46 0-.358.134-.934.467-1.442H23a.5.5 0 0 0 0-1h-5.411c-.405-.53-.605-1.218-.605-1.885 0-.416.157-1.088.546-1.674H23a.5.5 0 0 0 0-1h-5.25c-.513-.55-.766-1.325-.766-2.076 0-.357.116-.905.396-1.424H23a.5.5 0 0 0 0-1h-5.173c-.564-.597-.843-1.484-.843-2.17 0-.81.443-2.6 2.016-2.81V11Z"
        fill="#D67D00"
      />
    </svg>
  );
};

const ThumbsDownSvg = () => {
  const { styles } = useStyles();

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styles.rateThumbSvg}
    >
      <title>Thumbs Down</title>
      <path
        d="M19.688 26.44c0 2.9-2.125 3.584-3.313 3.563-2.412 0-3.082-2.01-3.281-3.078-.248-1.33-.005-4.51.106-5.97l.003-.04c-.159.036-.33.057-.515.057H8.83c-1.56 0-2.83-1.27-2.83-2.83 0-.806.259-1.535.765-2.051C5.721 15.63 5 14.663 5 13.548c0-1.023.463-1.921 1.364-2.418C5.541 10.617 5 9.764 5 8.797c0-1.108.543-2.07 1.598-2.534C6.223 5.878 6 5.304 6 4.47c0-1.379.969-2.502 2.83-2.502h3.857c.046 0 .09.001.135.004h3.131C26.391 1.8 27 8.565 27 11.315c0 5.156-2.298 6.69-4.34 8.052-.966.644-1.875 1.25-2.457 2.183-.488.782-.515 1.5-.515 4.89Z"
        fill="#FFC83D"
      />
      <path
        d="M14.394 6.913H9a.5.5 0 0 1 0-1h5.549c.333-.509.467-1.085.467-1.443 0-1.085-.607-2.228-1.855-2.46 2.562.106 3.87 1.28 3.87 2.68 0 1.175-.708 1.869-1.062 2.068.654.469 1.062 1.157 1.062 2.089 0 1.234-1.062 2.265-1.062 2.265s1.062.938 1.062 2.219c0 1.15-.5 2.078-1.062 2.328.562.39 1.031 1.094 1.031 2.344 0 2.375-2.98 2.937-4 2.969v-.02c1.573-.21 2.016-2 2.016-2.81 0-.687-.28-1.574-.843-2.17H9a.5.5 0 0 1 0-1h5.62c.28-.52.396-1.067.396-1.424 0-.751-.253-1.527-.767-2.076H9a.5.5 0 0 1 0-1h5.47c.39-.586.546-1.259.546-1.674 0-.467-.14-1.258-.622-1.885Z"
        fill="#D67D00"
      />
    </svg>
  );
};
