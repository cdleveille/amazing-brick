import { CSSProperties, MouseEvent, useCallback, useState } from "react";

import { useStyles } from "@hooks";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import type { TGameMode } from "@types";
import { GAME_MODES } from "@utils";

type TGameModeMenuProps = {
	value: TGameMode;
	onSelectOption: (gameMode: TGameMode) => void;
};

export const GameModeMenu = ({ value, onSelectOption }: TGameModeMenuProps) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const { styles } = useStyles();

	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	const getNextGameMode = useCallback(
		(gameMode: TGameMode) => {
			const nextIndex = GAME_MODES.findIndex(mode => mode.name === gameMode.name) + 1;
			return GAME_MODES[nextIndex % GAME_MODES.length];
		},
		[GAME_MODES]
	);

	const getPreviousGameMode = useCallback(
		(gameMode: TGameMode) => {
			const previousIndex = GAME_MODES.findIndex(mode => mode.name === gameMode.name) - 1;
			return GAME_MODES[(previousIndex + GAME_MODES.length) % GAME_MODES.length];
		},
		[GAME_MODES]
	);

	return (
		<div style={styles.gameModeContainer}>
			<button
				className="arrow-btn"
				onClick={() => onSelectOption(getPreviousGameMode(value))}
				aria-label="Previous Game Mode"
			>
				<ChevronLeftIcon sx={styles.gameModeArrowBtn} />
			</button>
			<Button
				id="game-mode-menu-btn"
				aria-controls={open ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="outlined"
				disableElevation
				onClick={handleClick}
				endIcon={<span style={styles.gameModeEndIcon(open)}></span>}
				color="inherit"
				sx={styles.gameModeMenuBtn}
			>
				{value.name}
			</Button>
			<button
				className="arrow-btn"
				onClick={() => onSelectOption(getNextGameMode(value))}
				aria-label="Next Game Mode"
			>
				<ChevronRightIcon sx={styles.gameModeArrowBtn} />
			</button>
			<StyledMenu
				id="game-mode-menu"
				MenuListProps={{ "aria-labelledby": "game-mode-menu-btn" }}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				styles={styles.gameModeDropdown}
			>
				{GAME_MODES.map(mode => (
					<MenuItem
						onClick={() => {
							onSelectOption(mode);
							handleClose();
						}}
						disableRipple
						key={mode.name}
						autoFocus={mode.name === value.name}
					>
						{mode.name}
					</MenuItem>
				))}
			</StyledMenu>
		</div>
	);
};

const StyledMenu = styled(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ styles, ...props }: MenuProps & { styles: Record<string, CSSProperties> }) => (
		<Menu
			elevation={0}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			transformOrigin={{ vertical: "top", horizontal: "center" }}
			{...props}
		/>
	)
)(({ styles }) => styles);
