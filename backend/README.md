# Event Management System Backend

This is the backend for an Event Management System, built with Node.js, Express, and Prisma ORM.

## Setup

1. Clone the repository
2. Install dependencies:
   npm install
3. Set up your environment variables in a `.env` file:
   DATABASE_URL="your_database_connection_string"
   JWT_SECRET="your_jwt_secret"
   EMAIL_USER="your_email@example.com"
   EMAIL_PASS="your_email_password"
4. Run database migrations:
   npx prisma migrate dev
5. Start the server:
   npm run start OR npm run dev for developement

## Features

- User authentication and authorization
- Event creation, management, and booking
- Ticket management
- Email notifications
- Admin and Manager dashboard functionalities

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - User login
- POST /auth/logout - User logout

### Users
- GET /users - Get all users (Admin only)
- GET /users/:id - Get user by ID
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user
- POST /users/manager-request - Request manager role
- PUT /users/verify/:id - Verify user account (Admin only)

### Events
- POST /events - Create a new event
- GET /events - Get all events
- GET /events/:id - Get event by ID
- PUT /events/:id - Update event
- DELETE /events/:id - Delete event
- GET /events/active - Get active events
- GET /events/pending - Get pending events (Admin only)
- PUT /events/:id/approve - Approve event (Admin only)
- PUT /events/:id/cancel - Cancel event

### Reservations
- POST /reservations - Create a new reservation
- GET /reservations - Get all reservations
- GET /reservations/:id - Get reservation by ID
- PUT /reservations/:id/cancel - Cancel reservation

### Reviews
- POST /reviews - Create a new review
- GET /reviews/event/:id - Get reviews for an event
- DELETE /reviews/:id - Delete a review

## Database Schema

The database schema includes tables for Users, Events, Reservations, Reviews, and more. Refer to the `prisma/schema.prisma` file for detailed schema information.

## Services

- UserService: Handles user-related operations
- EventService: Manages event creation, updates, and queries
- ReservationService: Handles booking and cancellation of event tickets
- EmailService: Manages sending of notification emails

## Authentication

JWT (JSON Web Tokens) is used for authentication. Tokens are issued upon login and must be included in the Authorization header for protected routes.

## Error Handling

The application uses a centralized error handling mechanism. All errors are logged and appropriate error responses are sent to the client.

## Testing

Run tests using:
npm test

# {Featured update with DOCKER}

## Deployment 

For production deployment:
1. Set up your production environment variables
2. Build the project:
   npm run build
3. Start the production server:
   npm start
