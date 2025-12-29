# Akshaya Shopping Backend API

This is the backend API for the Akshaya Shopping admin panel, built with Node.js, Express, and MongoDB.

## Features

- **Admin Authentication**: Secure login system with JWT tokens
- **Category Management**: CRUD operations for product categories
- **Product Management**: Full product inventory management
- **Review Management**: Customer review approval and management
- **Security**: Rate limiting, CORS, Helmet security headers
- **Validation**: Input validation with express-validator

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── utils/          # Utility functions
├── server.js       # Main server file
├── package.json    # Dependencies
└── .env.example    # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://msarunkal_db_user:MI55JCqRkn4YLRuB@akshayashopping.ezzvehf.mongodb.net/?appName=AkshayaShopping
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:8080
```

### Database Setup

Make sure MongoDB is running on your system. For local MongoDB:
```bash
# Start MongoDB service (Linux/Mac)
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community

# Start MongoDB service (Windows)
net start MongoDB
```

### Database Setup & Admin User

1. Run the setup script to create the default admin user:
```bash
npm run setup
```

This will create an admin user with the following credentials:
- **Email**: admin@akshayashopping.in
- **Password**: msarun.kal@AS

### Running the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `GET /api/auth/logout` - Logout admin

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/dropdown` - Get categories for dropdown
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `GET /api/products/stats` - Get product statistics
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/stats` - Get review statistics
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `PUT /api/reviews/:id/approve` - Approve review
- `PUT /api/reviews/:id/respond` - Respond to review
- `DELETE /api/reviews/:id` - Delete review


## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for frontend-backend communication
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation on all inputs

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup` - Initialize database and create admin user
- `npm test` - Run tests (when implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/akshaya-shopping |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `JWT_COOKIE_EXPIRE` | Cookie expiration days | 30 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8080 |

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Ensure MongoDB connection string is properly configured
3. Set strong `JWT_SECRET`
4. Configure `FRONTEND_URL` for your deployed frontend
5. Use a process manager like PM2 for production

## Contributing

1. Follow the existing code structure
2. Add proper validation to all endpoints
3. Include error handling
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is licensed under the ISC License.