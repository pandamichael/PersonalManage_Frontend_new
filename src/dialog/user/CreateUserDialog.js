import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../../api";

// 定義「新增使用者」彈窗元件，使用 React Hook 管理狀態
export default function CreateUserDialog({ open, onClose, onSave }) {

  // 初始化表單數據和狀態，useState 用於管理狀態
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    phone: "",
    birthday: null,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    name: false,
    gender: false,
    phone: false,
    birthday: false,
  });

  const [helperTexts, setHelperTexts] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    phone: "",
    birthday: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false); // 控制 Snackbar 的顯示狀態
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar 的訊息內容

  // 當 open狀態變為 true 時，重置表單資料
  useEffect(() => {
    if (open) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        phone: "",
        birthday: null,
      });
      setErrors({
        email: false,
        password: false,
        confirmPassword: false,
        name: false,
        gender: false,
        phone: false,
        birthday: false,
      });
      setHelperTexts({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        phone: "",
        birthday: "",
      });
    }
  }, [open]);

  // 處理表單輸入變更的函數
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {

      // 使用正則表達式檢查 Email 格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          email: "信箱格式不正確",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          email: "",
        }));
      }
    } else if (name === "password") {
      // 8-12位，至少包含一個大寫字母、一個小寫字母、一個數字
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;

      if (!passwordRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, password: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          password: "密碼格式需為8-12碼，且包含大寫、小寫字母及數字",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, password: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          password: "",
        }));
      }

      // 同時檢查確認密碼是否一致
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          confirmPassword: "密碼不一致",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          confirmPassword: "",
        }));
      }
    } else if (name === "confirmPassword") {
      // 檢查確認密碼是否與密碼一致
      if (value !== formData.password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          confirmPassword: "密碼不一致",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          confirmPassword: "",
        }));
      }
    } else if (name === "phone") {
      const phoneRegex = /^[0-9]*$/;
      if (!phoneRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          phone: "電話欄位只能輸入數字",
        }));
      } else if (value.length > 10) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          phone: `電話長度不能超過 10 個字元，目前為 ${value.length} 個字元`,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, phone: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          phone: "",
        }));
      }
    } else if (name === "name") {
      if (value.length > 15) {
        setErrors((prevErrors) => ({ ...prevErrors, name: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          name: `姓名長度不能超過 15 個字元，目前為 ${value.length} 個字元`,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          name: "",
        }));
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, [name]: "" }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, birthday: newDate });
    setErrors((prevErrors) => ({ ...prevErrors, birthday: false }));
    setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, birthday: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          [key]: "此欄位為必填",
        }));
        isValid = false;
      }
    });

    if (!isValid) return;

    try {
      await api.post(`/user`, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        birthday: formData.birthday.getTime(),// 轉換生日為時間戳格式
      });
      onSave();
      onClose();
    } catch (error) {
      // 捕捉錯誤並顯示錯誤訊息
      setSnackbarMessage(error.response?.data?.message || "新增使用者失敗");
      setOpenSnackbar(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>新增使用者</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="信箱"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            error={errors.email}
            helperText={helperTexts.email}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="密碼"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            error={errors.password}
            helperText={helperTexts.password}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="確認密碼"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            error={errors.confirmPassword}
            helperText={helperTexts.confirmPassword}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="姓名"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            helperText={helperTexts.name}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="性別"
            name="gender"
            select
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            helperText={helperTexts.gender}
            required
          >
            <MenuItem value="male">男性</MenuItem>
            <MenuItem value="female">女性</MenuItem>
            <MenuItem value="other">其他</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="電話"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            helperText={helperTexts.phone}
            required
            sx={{ mb: 3 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="生日"
              value={formData.birthday}
              maxDate={new Date()}
              format="yyyy/MM/dd"
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={errors.birthday}
                  helperText={helperTexts.birthday}
                  required
                />
              )}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      ;{" "}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          取消
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          新增使用者
        </Button>
      </DialogActions>
      {/* 錯誤訊息彈出通知 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </Dialog>
  );
}
