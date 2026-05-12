# MergeMarket

MergeMarket is a full-stack buy-sell marketplace for the IIIT Hyderabad community. Users can register with an IIIT email, log in with password or IIIT CAS, list items, search listings, manage carts, place orders, verify deliveries with OTP, review sellers, and use a Gemini-powered support chatbot.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Auth: JWT, bcrypt, IIIT CAS login
- Bot: Google Gemini API
- Protection: Google reCAPTCHA v3 on registration
- Deployment: Vercel for frontend, Render or another Node host for backend

## Project Structure

```txt
Buy-sell/
  backend/
    models/          MongoDB schemas for users, items, orders
    routes/          Express API routes
    middleware/      JWT auth middleware
    server.js        Express server entrypoint
  frontend/
    src/
      pages/         React pages
      components/    Shared UI components
      config.js      API base URL config
    vercel.json      SPA routing rewrites for Vercel
```

## Features

- User registration with IIIT email validation and reCAPTCHA
- Password login with JWT sessions
- IIIT CAS login
- Product listings with categories, quantities, and seller ownership
- Search and category filtering
- Cart management
- Checkout with OTP-based delivery verification
- Order history, received orders, cancellation, and seller reviews
- Editable user profile
- Gemini-powered support chat

## Data Storage

Persistent app data is stored in MongoDB through these models:

- `User`: profile details, hashed password, cart, seller reviews
- `Item`: listing details, category, seller, quantity, reserved count, status
- `Order`: buyer, seller, item, transaction ID, OTP, status

The frontend stores the JWT token and user object in browser `localStorage`.

Chat sessions are currently stored in backend memory in `backend/routes/chat.js`, so chat history is lost when the backend restarts or redeploys.

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key
```

For production, set these in the deployment dashboards instead of relying on local `.env` files:

- Vercel frontend: `VITE_API_URL`, `VITE_RECAPTCHA_SITE_KEY`
- Backend host: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `RECAPTCHA_SECRET_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL, usually:

```txt
http://localhost:5173
```

## API Overview

Auth routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/cas-login`

Item routes:

- `POST /api/items/add`
- `GET /api/items`
- `GET /api/items/my-listings`
- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PUT /api/items/:id/quantity`
- `DELETE /api/items/:id`

User routes:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/cart`
- `POST /api/users/cart/add/:itemId`
- `DELETE /api/users/cart/:itemId`
- `POST /api/users/reviews/:sellerId`
- `DELETE /api/users/reviews/:reviewId`

Order routes:

- `POST /api/orders/checkout`
- `GET /api/orders/history`
- `GET /api/orders/received`
- `POST /api/orders/verify-otp`
- `POST /api/orders/cancel/:orderId`

Chat routes:

- `POST /api/chat/start`
- `POST /api/chat/message`
- `GET /api/chat/history/:sessionId`

Most routes require the JWT in this header:

```txt
x-auth-token: <token>
```

## Deployment Notes

Deploy the frontend as a Vite app on Vercel:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Deploy the backend as a long-running Node.js service on Render or a similar host:

- Root directory: `backend`
- Start command: `npm start`

Set `FRONTEND_URL` on the backend to the deployed frontend URL, for example:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Set `VITE_API_URL` on Vercel to the deployed backend URL, for example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

If using reCAPTCHA in production, add the production domain in the Google reCAPTCHA admin console.

## Useful Checks

Build the frontend:

```bash
cd frontend
npm run build
```

Check backend syntax:

```bash
cd backend
node --check server.js
```

Check which Gemini models your API key can access:

```bash
cd backend
node check.js
```

