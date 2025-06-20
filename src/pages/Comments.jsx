import { Box, Button, TextField, Alert } from "@mui/material";

import Item from "../components/Item";

import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../ThemedApp";
import { useApp } from "../ThemedApp";
import {
  fetchComments,
  postComment,
  deletePost,
  deleteComment,
} from "../libs/fetcher";

export default function Comments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contentInput = useRef();

  const { setGlobalMsg, auth } = useApp();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => fetchComments(id),
  });

  const addComment = useMutation({
    mutationFn: (content) => postComment(content, id),
    onSuccess: async (comment) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = [...old.comments, comment];
        return { ...old };
      });
      setGlobalMsg("A comment added");
    },
  });

  const removePost = useMutation({
    mutationFn: async (id) => deletePost(id),
    onSuccess: async () => {
      await queryClient.refetchQueries("posts");

      navigate("/");
      setGlobalMsg("A post deleted");
    },
  });

  const removeComment = useMutation({
    mutationFn: async (id) => deleteComment(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = old.comments.filter((comment) => comment.id !== id);
        return { ...old };
      });
      setGlobalMsg("A comment deleted");
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }
  if (!data) {
    return <Box sx={{ textAlign: "center" }}>No post found for comments.</Box>;
  }
  return (
    <Box>
      <Item primary item={data} remove={removePost.mutate} />
      {data.comments?.map((comment) => {
        return (
          <Item
            comment
            key={comment.id}
            item={comment}
            remove={removeComment.mutate}
            owner={data.userId}
          />
        );
      })}
      {data.comments?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
          No comments yet.
        </Box>
      )}

      {auth && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = contentInput.current.value;
            if (!content) return false;

            addComment.mutate(content);

            e.currentTarget.reset();
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 3,
            }}
          >
            <TextField
              inputRef={contentInput}
              multiline
              placeholder="Your Comment"
            />
            <Button type="submit" variant="contained">
              Reply
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
