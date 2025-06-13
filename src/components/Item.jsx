import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";

import {
  Alarm as TimeIcon,
  AccountCircle as UserIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import { formatRelative, isValid, parseISO } from "date-fns";
import { useApp } from "../ThemedApp";

import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

export default function Item({ item, remove, primary, comment, owner }) {
  const navigate = useNavigate();
  const { auth } = useApp();

  function isOwner() {
    if (!auth) return false;
    return auth.id === item.userId || auth.id === owner;
  }

  const getFormattedDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable"; 
    }

    const date = parseISO(String(dateValue));

    if (isValid(date)) {
      return formatRelative(date, new Date());
    } else {
      console.warn("Invalid date format for item.created:", dateValue);
      return "Invalid date";
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      {primary && <Box sx={{ height: 50, bgcolor: green[500] }} />}

      <CardContent
        onClick={() => {
          if (comment) return false;
          navigate(`/comments/${item.id}`);
        }}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TimeIcon fontSize="10" color="success" />
            <Typography variant="caption" sx={{ color: green[500] }}>
              {getFormattedDate(item.created)}
            </Typography>
          </Box>

          {isOwner() && (
            <IconButton
              sx={{ color: "text.fade" }}
              size="small"
              onClick={(e) => {
                remove(item.id);
                e.stopPropagation();
              }}
            >
              <DeleteIcon color="inherit" fontSize="inherit" />
            </IconButton>
          )}
        </Box>

        <Typography sx={{ my: 3 }}>{item.content}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            onClick={(e) => {
              if (item.user?.id) { 
                navigate(`/profile/${item.user.id}`);
              } else {
                console.warn("User ID not available for navigation:", item.user);
              }
              e.stopPropagation();
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <UserIcon fontSize="12" color="info" />
            <Typography variant="caption">{item.user?.name}</Typography>
          </Box>
          <Box>
            <LikeButton item={item} comment={comment} />
            <CommentButton item={item} comment={comment} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
