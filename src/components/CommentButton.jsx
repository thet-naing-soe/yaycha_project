import { IconButton, ButtonGroup, Button } from "@mui/material";
import { ChatBubbleOutline as CommentIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function Item({ item, comment }) {
  const navigate = useNavigate();
  return (
    <>
      {!comment && (
        <ButtonGroup sx={{ ml: 3 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              if (item?.id) {
                navigate(`/comments/${item.id}`);
                e.stopPropagation();
              }
            }}
          >
            <CommentIcon fontSize="small" color="info" />
          </IconButton>
          <Button
            sx={{ color: "text.fade" }}
            variant="text"
            size="small"
            onClick={(e) => {
              if (item?.id) {
                navigate(`/comments/${item.id}`);
                e.stopPropagation();
              }
            }}
          >
            {item.comments?.length || 0}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
