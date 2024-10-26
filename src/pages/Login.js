import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("請輸入帳號");
    } else if (!password) {
      setError("請輸入密碼");
    } else if (!emailRegex.test(email)) {
      setError("帳號必須為信箱格式");
    } else {
      api
        .post("/common/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.code === 1000) {
            localStorage.setItem("userName", response.data.result.name);
            localStorage.setItem("userId", response.data.result.id);
            navigate("/user", { state: { user: response.data.result } });
          } else {
            setError(response.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            setError(err.response.data.message);
          } else {
            setError("無法連接到伺服器，請稍後再試");
          }
        });
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #6DD5FA 0%, #2980B9 100%)",
        backgroundSize: "cover",
        height: "100vh",
        width: "100wh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
              歡迎登入
            </Typography>
            {error && (
              <Alert
                severity={error === "登入成功！" ? "success" : "error"}
                sx={{ width: "100%", mt: 2 }}
              >
                {error}
              </Alert>
            )}
            {/* 表單區域 */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="帳號"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密碼"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
              />
              {/* 登入按鈕 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                登入
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
