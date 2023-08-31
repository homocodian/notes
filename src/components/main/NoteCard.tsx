import { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";

import formatDate from "@/utils/formatDate";
import NoteMenu from "@/components/main/NoteMenu";
import useTheme from "@mui/material/styles/useTheme";

interface ITodoCard {
	id: string;
	text: string;
	category: string;
	timestamp: Date;
	isComplete: boolean;
	sharedWith?: Array<string>;
	isShared?: boolean;
	label?: string;
	name?: string;
	email?: string;
}

function NoteCard({
	id,
	text,
	category,
	isComplete,
	timestamp,
	isShared,
	label,
	email,
	name,
}: ITodoCard) {
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<Card sx={{ minWidth: 300 }}>
			<CardHeader
				title={
					label ? (
						<div>
							<Typography
								variant="subtitle1"
								color={theme.palette.text.secondary}
							>
								{label}
							</Typography>
							{email ? (
								<Typography
									variant="subtitle2"
									color={theme.palette.text.secondary}
								>
									{email}
								</Typography>
							) : null}
						</div>
					) : (
						<Chip label={category.toUpperCase()} />
					)
				}
				action={
					<IconButton aria-label="more" onClick={handleClick}>
						<MoreVertIcon />
					</IconButton>
				}
				sx={{ fontWeight: 500 }}
			/>
			<NoteMenu
				id={id}
				text={text}
				category={category}
				anchorEl={anchorEl}
				complete={isComplete}
				setAnchorEl={setAnchorEl}
				isShared={isShared}
			/>
			<CardContent>
				<Typography
					gutterBottom
					color={isComplete ? "text.secondary" : ""}
					style={{
						textDecoration: `${isComplete ? "line-through" : "none"}`,
						whiteSpace: "pre-line",
					}}
				>
					{text}
				</Typography>
			</CardContent>
			<CardActions>
				<Typography
					variant="caption"
					color="text.secondary"
					component={"div"}
					sx={{
						userSelect: "none",
						WebkitUserSelect: "none",
						msUserSelect: "none",
					}}
				>
					Date created {formatDate(timestamp)}
				</Typography>
			</CardActions>
		</Card>
	);
}

export default NoteCard;
