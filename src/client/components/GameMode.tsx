import { MouseEvent, useState } from "react";

import { Color } from "@constants";
import { gameModes } from "@game";
import { useAppContext } from "@hooks";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

import type { TGameMode } from "@types";

const getNextGameMode = (gameMode: TGameMode) => {
	const nextIndex = gameModes.findIndex(mode => mode.name === gameMode.name) + 1;
	return gameModes[nextIndex % gameModes.length];
};

const getPreviousGameMode = (gameMode: TGameMode) => {
	const previousIndex = gameModes.findIndex(mode => mode.name === gameMode.name) - 1;
	return gameModes[(previousIndex + gameModes.length) % gameModes.length];
};

const StyledMenu = styled(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ scaleRatio, isDarkMode, ...props }: MenuProps & { scaleRatio: number; isDarkMode: boolean }) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center"
			}}
			{...props}
		/>
	)
)(({ scaleRatio, isDarkMode }) => ({
	"& .MuiPaper-root": {
		marginTop: `${0 * scaleRatio}px`,
		minWidth: `${180 * scaleRatio}px`,
		color: isDarkMode ? Color.White : Color.Black,
		border: `1px solid ${isDarkMode ? Color.DarkGray : Color.Gray}`,
		overflow: "hidden",
		"& .MuiMenu-list": {
			padding: `${4 * scaleRatio}px 0`,
			backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
			overflow: "hidden"
		},
		"& .MuiMenuItem-root": {
			fontSize: 20 * scaleRatio,
			fontFamily: "Roboto-Regular",
			padding: `${8 * scaleRatio}px ${8 * scaleRatio}px`,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			minHeight: `${48 * scaleRatio}px`,
			"& .MuiSvgIcon-root": {
				fontSize: 20 * scaleRatio,
				color: isDarkMode ? Color.White : Color.Black,
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
				marginRight: `${8 * scaleRatio}px`,
				padding: `${8 * scaleRatio}px ${8 * scaleRatio}px`
			},
			"&:active": {
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White
			},
			"&:hover": {
				backgroundColor: isDarkMode ? Color.DarkGray : Color.Gray
			},
			"&:focus": {
				backgroundColor: isDarkMode ? Color.DarkGray : Color.Gray
			}
		}
	}
}));

export const GameModeMenu = ({
	value,
	onSelectOption
}: {
	value: TGameMode;
	onSelectOption: (gameMode: TGameMode) => void;
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const {
		canvas: { scaleRatio },
		isDarkMode
	} = useAppContext();

	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				columnGap: `${8 * scaleRatio}px`
			}}
		>
			<button className="arrow-btn" onClick={() => onSelectOption(getPreviousGameMode(value))}>
				<ChevronLeftIcon
					sx={{ fontSize: `${36 * scaleRatio}px`, color: isDarkMode ? Color.White : Color.Black }}
				/>
			</button>
			<Button
				id="game-mode-menu-btn"
				aria-controls={open ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="outlined"
				disableElevation
				onClick={handleClick}
				endIcon={
					<span
						style={{
							borderLeft: `${6 * scaleRatio}px solid transparent`,
							borderRight: `${6 * scaleRatio}px solid transparent`,
							borderTop: `${10 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`
						}}
					></span>
				}
				color="inherit"
				sx={{
					fontFamily: "Roboto-Regular",
					fontSize: `${20 * scaleRatio}px`,
					padding: 0,
					borderRadius: `${32 * scaleRatio}px`,
					boxShadow: "none",
					width: `${224 * scaleRatio}px`,
					height: `${56 * scaleRatio}px`,
					transition: "inherit",
					":active": {
						transform: "none"
					}
				}}
			>
				{value.name}
			</Button>
			<button className="arrow-btn" onClick={() => onSelectOption(getNextGameMode(value))}>
				<ChevronRightIcon
					sx={{ fontSize: `${36 * scaleRatio}px`, color: isDarkMode ? Color.White : Color.Black }}
				/>
			</button>
			<StyledMenu
				id="game-mode-menu"
				MenuListProps={{
					"aria-labelledby": "game-mode-menu-btn"
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				scaleRatio={scaleRatio}
				isDarkMode={isDarkMode}
			>
				{gameModes.map(mode => (
					<MenuItem
						onClick={() => {
							onSelectOption(mode);
							handleClose();
						}}
						disableRipple
						key={mode.name}
					>
						{mode.name}
					</MenuItem>
				))}
			</StyledMenu>
		</div>
	);
};
