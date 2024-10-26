import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../../api";

export default function EditUserDialog({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    gender: user.gender || "",
    phone: user.phone || "",
    birthday: user.birthday ? new Date(user.birthday) : null,
  });

  const [errors, setErrors] = useState({
    name: false,
    gender: false,
    phone: false,
    birthday: false,
  });

  const [helperTexts, setHelperTexts] = useState({
    name: "",
    gender: "",
    phone: "",
    birthday: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (value.length > 20) {
        setErrors((prevErrors) => ({ ...prevErrors, name: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          name: `姓名長度不能超過 20 個字元，目前為 ${value.length} 個字元`,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: false }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          name: "",
        }));
      }
    } else if (name === "phone") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) {
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
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, [name]: "" }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, birthday: newDate });

    if (!newDate) {
      setErrors((prevErrors) => ({ ...prevErrors, birthday: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        birthday: "生日為必填項目",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, birthday: false }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        birthday: "",
      }));
    }
  };

  const validateField = (name, value) => {
    if (
      (name === "birthday" && value === null) ||
      (typeof value === "string" && value.trim() === "")
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        [name]: name === "birthday" ? "生日為必填項目" : "此欄位為必填",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key]) {
        isValid = false;
      }
    });

    if (!isValid) return;

    try {
      await api.put(`/user/${user.id}`, {
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        birthday: formData.birthday.getTime(),
      });

      // 如果修改的是當前登入使用者，更新 header 的名字
      const loginUserId = localStorage.getItem("userId");
      if (loginUserId === user.id) {
        localStorage.setItem("userName", formData.name);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("更新使用者失敗", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>編輯使用者 - {user.name}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="信箱"
            value={user.email}
            disabled
            variant="filled"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="姓名"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            helperText={helperTexts.name}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="電話"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            helperText={helperTexts.phone}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="性別"
            name="gender"
            select
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.gender}
            helperText={helperTexts.gender}
            required
            sx={{ mb: 4 }}
          >
            <MenuItem value="male">男性</MenuItem>
            <MenuItem value="female">女性</MenuItem>
            <MenuItem value="other">其他</MenuItem>
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="生日"
              value={formData.birthday}
              onChange={handleDateChange}
              maxDate={new Date()}
              format="yyyy/MM/dd"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={errors.birthday}
                  helperText={helperTexts.birthday}
                  required
                  sx={{ mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          取消
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          儲存變更
        </Button>
      </DialogActions>
    </Dialog>
  );
}
