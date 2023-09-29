import { Fragment, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";

import formatDate from "@/utils/format-date";
import NoteMenu from "@/components/main/NoteMenu";
import useTheme from "@mui/material/styles/useTheme";
import { useAuth } from "@/context/AuthContext";
import SharedWithModal from "../NoteSharedWithModal";
import { deleteField, updateDoc } from "firebase/firestore";
import { noteDocReference } from "@/firebase";

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
	userId: string;
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
	sharedWith,
	userId,
}: ITodoCard) {
	const { user } = useAuth();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [open, setOpen] = useState(false);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<Fragment>
			<Card sx={{ minWidth: 300 }}>
				<CardHeader
					title={
						label && isShared ? (
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
							<Chip
								label={category}
								variant={category === "important" ? "filled" : "outlined"}
								color={category === "important" ? "error" : "secondary"}
								size="small"
								sx={{
									textTransform: "capitalize",
								}}
							/>
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
				<CardActions
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
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
					{sharedWith && sharedWith.length > 0 && userId === user?.uid ? (
						<Chip
							label={"Shared + " + sharedWith.length}
							variant="outlined"
							onClick={() => {
								setOpen(true);
							}}
							onDelete={async () => {
								await updateDoc(noteDocReference(id), {
									sharedWith: deleteField(),
								});
							}}
						/>
					) : null}
				</CardActions>
			</Card>
			<SharedWithModal
				open={open}
				setOpen={setOpen}
				sharedWith={sharedWith}
				id={id}
			/>
		</Fragment>
	);
}

export default NoteCard;
