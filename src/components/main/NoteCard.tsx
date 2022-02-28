import { useState } from "react";
import formatDate from "../../utils/formatDate";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import NoteMenu from "./NoteMenu";

interface ITodoCard {
  id: string;
  text: string;
  category: string;
  timestamp: Date;
  isComplete: boolean;
}

function NoteCard({ id, text, category, isComplete, timestamp }: ITodoCard) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Card sx={{ minWidth: 300 }}>
      <CardHeader
        title={<Chip label={category.toUpperCase()} />}
        action={
          <IconButton aria-label="more" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
      />
      <NoteMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        id={id}
        complete={isComplete}
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
