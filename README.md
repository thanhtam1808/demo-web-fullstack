# Moonlight Tickets — Hướng dẫn tích hợp Backend + Frontend

## Cấu trúc giao nộp

```
moonlight/
├── backend/                  ← Toàn bộ server mới (copy vào dự án)
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── seed.js
│   └── .env.example
└── frontend-patches/         ← Chỉ các file cần THAY THẾ trong src/ của bạn
    └── src/
        ├── App.js
        ├── api/
        │   ├── axiosClient.js  ← THAY axiosClient.js cũ
        │   └── movieApi.js     ← THÊM mới
        ├── context/
        │   └── AuthContext.js  ← THÊM mới
        ├── components/
        │   └── Navbar.js       ← THAY Navbar.js cũ
        └── pages/
            ├── HomePage.js         ← THAY
            ├── MovieDetailPage.js  ← THAY
            ├── SearchPage.js       ← THAY
            ├── BookingPage.js      ← THAY
            ├── TicketsPage.js      ← THAY
            ├── LoginPage.js        ← THÊM mới
            ├── RegisterPage.js     ← THÊM mới
            └── AdminPage.js        ← THÊM mới
```

---

## Bước 1 — Thiết lập Backend

```bash
# 1. Đặt thư mục backend/ vào dự án của bạn (cùng cấp với frontend/)
cd backend
npm install

# 2. Tạo file .env
cp .env.example .env
# Mở .env và sửa MONGO_URI nếu dùng MongoDB Atlas

# 3. Seed dữ liệu mẫu (6 phim, 4 rạp, 1 admin)
node seed.js

# 4. Chạy server
npm run dev
# → Server: http://localhost:5000
```

**Tài khoản admin:** `admin@moonlight.vn` / `Admin@123`

---

## Bước 2 — Cập nhật Frontend

### Copy file vào đúng vị trí:

| File trong `frontend-patches/src/` | Copy vào `src/` của bạn |
|---|---|
| `api/axiosClient.js` | **Thay** file cũ `src/api/axiosClient.js` |
| `api/movieApi.js` | **Thêm** vào `src/api/` |
| `context/AuthContext.js` | **Thêm** vào `src/context/` (tạo thư mục nếu chưa có) |
| `App.js` | **Thay** `src/App.js` |
| `components/Navbar.js` | **Thay** `src/components/Navbar.js` |
| `pages/HomePage.js` | **Thay** `src/pages/HomePage.js` |
| `pages/MovieDetailPage.js` | **Thay** `src/pages/MovieDetailPage.js` |
| `pages/SearchPage.js` | **Thay** `src/pages/SearchPage.js` |
| `pages/BookingPage.js` | **Thay** `src/pages/BookingPage.js` |
| `pages/TicketsPage.js` | **Thay** `src/pages/TicketsPage.js` |
| `pages/LoginPage.js` | **Thêm** vào `src/pages/` |
| `pages/RegisterPage.js` | **Thêm** vào `src/pages/` |
| `pages/AdminPage.js` | **Thêm** vào `src/pages/` |

### Cấu hình proxy (đã có sẵn):
Trong `package.json` của frontend, thêm dòng:
```json
"proxy": "http://localhost:5000"
```

Hoặc tạo file `.env` trong thư mục frontend:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Chạy frontend:
```bash
cd frontend  (thư mục gốc của bạn)
npm start
# → http://localhost:3000
```

---

## Những thay đổi so với code cũ

### axiosClient.js
- **Cũ:** `baseURL = mindx-mockup-server.vercel.app` + API key bên ngoài
- **Mới:** `baseURL = localhost:5000/api` (backend của mình) + tự động gắn JWT token

### HomePage.js / SearchPage.js
- **Cũ:** `axiosClient.get("/movies?apiKey=...")` → `res.data.data.data`
- **Mới:** `movieApi.getAll()` → trả về mảng thẳng, dùng `movie._id` thay `movie.id`

### MovieDetailPage.js
- **Cũ:** Lấy list rồi `find(m => m.id === id)`
- **Mới:** `movieApi.getById(id)` trực tiếp + thêm phần đánh giá phim

### BookingPage.js
- **Cũ:** Chọn 1 ghế, bấm Confirm không làm gì
- **Mới:** Chọn rạp + ngày + giờ + nhiều ghế, gọi API đặt vé thật

### TicketsPage.js
- **Cũ:** Hardcode dữ liệu "Ponyo B3 20/03/2026"
- **Mới:** Load vé thật từ API, QR code chứa thông tin thật

---

## API Endpoints

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/movies` | Danh sách phim |
| GET | `/api/movies/:id` | Chi tiết phim |
| POST | `/api/movies` | Thêm phim *(admin)* |
| PUT | `/api/movies/:id` | Sửa phim *(admin)* |
| DELETE | `/api/movies/:id` | Xoá phim *(admin)* |
| GET | `/api/cinemas` | Danh sách rạp |
| POST | `/api/bookings` | Đặt vé |
| GET | `/api/bookings/my` | Vé của tôi |
| POST | `/api/ratings` | Đánh giá phim |
| GET | `/api/admin/stats` | Thống kê *(admin)* |
| GET | `/api/admin/users` | Người dùng *(admin)* |
| PATCH | `/api/admin/users/:id/toggle` | Khoá/mở user *(admin)* |
