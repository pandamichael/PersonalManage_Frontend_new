import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        height: "100vh",
        width: "100wh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 5,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#ffffffaa",
            backdropFilter: "blur(10px)",
          }}
        >
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 80, color: "#ff5252", mb: 2 }}
          />
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#ff5252" }}
          >
            404
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, color: "#555" }}>
            找不到頁面
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            很抱歉，您要查找的頁面不存在。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            返回首頁
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
