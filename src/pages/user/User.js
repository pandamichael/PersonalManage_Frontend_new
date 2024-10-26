import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import EditUserDialog from "../../dialog/user/EditUserDialog"; // 引入編輯彈窗元件
import CreateUserDialog from "../../dialog/user/CreateUserDialog"; // 引入新增彈窗元件

export default function User() {
  const [users, setUsers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false); // 編輯彈窗狀態
  const [openCreateDialog, setOpenCreateDialog] = useState(false); // 新增彈窗狀態
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 刪除確認彈窗狀態
  const [currentUser, setCurrentUser] = useState(null); // 當前編輯的使用者資料
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10; // 每頁顯示的使用者數量
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const loginUserId = localStorage.getItem("userId");
  console.log(loginUserId);

  useEffect(() => {
    if (!userName) {
      navigate("/login");
    }
  }, [userName, navigate]);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // 查詢使用者列表 API
  const fetchUsers = async (page) => {
    const offset = (page - 1) * limit;
    try {
      const response = await api.get(`/user?limit=${limit}&offset=${offset}`);
      setUsers(response.data.result.data);
      setTotalCount(response.data.result.count);
    } catch (error) {
      console.error("無法取得使用者列表", error);
    }
  };

  // 開啟編輯彈窗
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

  // 開啟新增彈窗
  const handleCreateClick = () => {
    setOpenCreateDialog(true);
  };

  // 開啟刪除確認彈窗
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  // 刪除使用者
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/user/${currentUser.id}`);
      fetchUsers(page);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("刪除使用者失敗", error);
    }
  };

  // 關閉編輯彈窗
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentUser(null);
  };

  // 關閉新增彈窗
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // 關閉刪除確認彈窗
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentUser(null);
  };

  // 分頁處理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          my: 4,
          py: 2,
          px: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #6DD5FA, #2980B9)",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: "white",
              color: "#2980B9",
              mr: 2,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {userName ? `${userName}，您好` : "使用者管理頁面"}
          </Typography>
        </Box>
        {/* 登出按鈕 */}
        <IconButton
          onClick={() => {
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
          sx={{
            p: 1,
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <LogoutIcon fontSize="large" />
        </IconButton>
      </Box>
      {/* 新增按鈕 */}
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateClick} // 使用傳入的按鈕點擊事件
          sx={{
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
            fontWeight: "bold",
          }}
          startIcon={<AddIcon />} // 加入圖示到按鈕左側
        >
          新增
        </Button>
      </Box>
      {/* 列表標題部分 */}
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
      ></Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["姓名", "信箱", "性別", "電話", "生日", "操作"].map(
                (header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      color: "#ffffff",
                      backgroundColor: "#1976d2",
                      fontWeight: "bold",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const isCurrentUser = user.id === loginUserId;
              return (
                <TableRow key={user.id}>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">
                    {user.gender === "male"
                      ? "男性"
                      : user.gender === "female"
                      ? "女性"
                      : "其他"}
                  </TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                  <TableCell align="center">
                    {new Date(user.birthday).toLocaleDateString("zh-TW")}
                  </TableCell>
                  <TableCell align="center">
                    {/* 編輯按鈕 */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(user)}
                      sx={{ mr: 1 }}
                    >
                      編輯
                    </Button>

                    {/* 刪除按鈕 - 當前使用者設為禁用狀態 */}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        if (isCurrentUser) {
                          alert("無法刪除當前登入者帳號！");
                        } else {
                          handleDeleteClick(user);
                        }
                      }}
                      disabled={isCurrentUser}
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分頁元件 */}
      <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
        <Pagination
          count={Math.ceil(totalCount / limit)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      {/* 編輯使用者的彈窗 */}
      {openEditDialog && (
        <EditUserDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          user={currentUser}
          onSave={() => fetchUsers(page)}
        />
      )}

      {/* 新增使用者的彈窗 */}
      {openCreateDialog && (
        <CreateUserDialog
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          onSave={() => fetchUsers(page)}
        />
      )}

      {/* 刪除確認彈窗 */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            您確定要刪除使用者「{currentUser?.name}」嗎？此操作無法撤銷。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            取消
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
