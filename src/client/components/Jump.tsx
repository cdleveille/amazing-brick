import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { useStyles } from "@/client/hooks/useStyles";

export const Jump = () => {
  const { styles } = useStyles();

  return (
    <>
      <JumpSvg />
      <div className="jump-container absolute-center" style={styles.jumpContainer}>
        <PlayArrowIcon className="blink" sx={styles.jumpArrowLeft} />
        <PlayArrowIcon className="blink" sx={styles.jumpArrowRight} />
      </div>
    </>
  );
};

const JumpSvg = () => {
  const { styles } = useStyles();

  return (
    <svg
      viewBox="0 0 246.891 117.059"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute-center"
      style={styles.jumpSvg}
    >
      <title>Jump</title>
      <path
        style={{
          fill: "#a3a3a3",
          fillOpacity: 1,
          strokeWidth: 1.21417,
          strokeLinejoin: "round",
        }}
        transform="rotate(-44.717 -.163 .721)"
        d="M109.686 192.981h24.229v23.456h-24.229ZM-17.829 66.72l-.239-24.228-23.454.232.239 24.227z"
      />
      <path
        style={{
          fill: "none",
          stroke: "#a3a3a3",
          strokeWidth: 2.13543,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "4.27087,2.13543",
          strokeDashoffset: 0,
          strokeOpacity: 1,
        }}
        d="M127.895 116.908c.334-9.703 26.424-162.44 85.117-101.704 4.892 5.062 8.45 11.175 12.69 19.84m-105.597 81.864c-.334-9.703-26.423-162.44-85.117-101.704-4.892 5.062-8.45 11.175-12.69 19.84"
        transform="translate(-.555 .094)"
      />
    </svg>
  );
};
