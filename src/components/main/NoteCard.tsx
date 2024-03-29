import { Fragment, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import NoteMenu from "@/components/main/NoteMenu";
import { useAuthStore } from "@/store/auth";
import { INoteCard } from "@/types/notes";
import formatDate from "@/utils/format-date";
import { useTheme } from "@mui/material/styles";
import SharedWithModal from "../NoteSharedWithModal";
import SharedButton from "./shared-button";

function NoteCard({
  id,
  text,
  category,
  isComplete,
  timestamp,
  email,
  sharedWith,
  userId,
  name,
  disableActions = false,
}: INoteCard) {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const label = (name || email || "a friend") as string;

  const isShared =
    sharedWith &&
    sharedWith?.findIndex(
      (item) => item.trim() === user?.uid || item.trim() === user?.email,
    ) >= 0
      ? true
      : false;

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
            !disableActions ? (
              <IconButton aria-label="more" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            ) : null
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
            Date created {formatDate(new Date(timestamp._seconds * 1000))}
          </Typography>
          {sharedWith && sharedWith.length > 0 && userId === user?.uid ? (
            <SharedButton
              onClick={() => setOpen(true)}
              id={id}
              sharedWith={sharedWith}
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
