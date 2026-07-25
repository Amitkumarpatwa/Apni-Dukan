# ApniDukan - Product Showcase + Admin Panel

Production-ready starter with clean modular architecture:

- Backend: Node.js, Express, MongoDB, Cloudinary, JWT
- Frontend: React, Tailwind CSS, Swiper.js
- Pattern: Controller -> Service -> Repository -> Model (feature modules)

## 1) Project Structure

```text
backend/
  src/
    config/
    middleware/
    modules/
      auth/
      product/
    utils/
    app.js
    server.js
frontend/
  src/
    api/
    components/
    context/
    layouts/
    pages/
```

## 2) Backend Setup

1. Open `backend/.env.example` and create `backend/.env`.
2. Fill MongoDB Atlas, JWT, and Cloudinary values.
3. Optional: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` for default admin login.
4. Run:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

Default admin (if not overridden):

- Email: `admin@apnidukan.com`
- Password: `admin123`

## 3) Frontend Setup

1. Open `frontend/.env.example` and create `frontend/.env`.
2. Set API URL (`VITE_API_BASE_URL`).
3. Run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 4) API Endpoints

- `POST /api/auth/register` - create admin
- `POST /api/auth/login` - admin login (JWT)
- `GET /api/products` - list products (search/filter/pagination)
- `GET /api/products/:id` - product details
- `POST /api/products` - create product (protected + multiple images)
- `PUT /api/products/:id` - update product (protected)
- `DELETE /api/products/:id` - delete product (protected)

## 5) MVC + Clean Architecture Flow

1. **Controller** validates request and sends response only.
2. **Service** holds business logic (upload images, query shaping, rules).
3. **Repository** contains DB operations only.
4. **Model** defines schema and indexes.

This keeps low coupling and high cohesion, and makes testing/replacement easier.

## 6) Image Upload Logic

- `upload.middleware.js` uses Multer in memory storage.
- `product.service.js` uploads each file buffer to Cloudinary.
- Cloudinary secure URLs are saved to `images[]` in MongoDB.

## 7) Deployment

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- Images: Cloudinary
