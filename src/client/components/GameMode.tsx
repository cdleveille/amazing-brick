import { Dispatch, MouseEvent, SetStateAction, useState } from "react";

import { Color } from "@constants";
import { gameModes } from "@game";
import { useAppContext } from "@hooks";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

import type { TGameMode } from "@types";
const GameModeOptions = ({
	handleClose,
	setGameMode
}: {
	handleClose: () => void;
	setGameMode: Dispatch<SetStateAction<TGameMode>>;
}) => {
	return (
		<>
			{gameModes.map(mode => (
				<MenuItem
					onClick={() => {
						setGameMode(mode);
						handleClose();
					}}
					disableRipple
					key={mode.name}
				>
					{mode.name}
				</MenuItem>
			))}
		</>
	);
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
				backgroundColor: isDarkMode ? Color.DarkGray : Color.LightGray
			}
		}
	}
}));

export const GameModeMenu = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const {
		canvas: { scaleRatio },
		isDarkMode,
		gameMode,
		setGameMode
	} = useAppContext();

	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				id="demo-customized-button"
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
				{gameMode.name}
			</Button>
			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button"
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				scaleRatio={scaleRatio}
				isDarkMode={isDarkMode}
			>
				<GameModeOptions handleClose={handleClose} setGameMode={setGameMode} />
			</StyledMenu>
		</div>
	);
};
