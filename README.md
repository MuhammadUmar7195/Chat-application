# Chat Application

This Chat Application enables real-time communication, leveraging modern technologies to provide a amazing user experience. It is built using a robust tech stack that ensures performance, security, and scalability.

## Features
- **Real-Time Messaging**: Achieved through a socket client-server connection.
- **Secure Authentication**: JWT (JSON Web Token) is used for user authentication.
- **Responsive Design**: Built with Tailwind CSS for a user-friendly interface.
- **State Management**: Redux Toolkit manages application state effectively.
- **RESTful APIs**: Built with Node.js and Express for backend functionality.
- **Data Protection**: Passwords are hashed using bcryptjs.

## Frontend Technologies
- **React.js**: For building the user interface.
- **Redux Toolkit**: For state management.
- **Tailwind CSS**: For styling and responsive design.
- **Socket.io Client**: For real-time data communication with the server.

## Backend Technologies
- **Node.js**: For server-side logic.
- **Express.js**: For routing and building RESTful APIs.
- **JWT**: For secure user authentication.
- **bcryptjs**: For password hashing and security.
- **CORS**: To handle cross-origin resource sharing.
- **Socket.io**: For real-time, bi-directional communication between client and server.

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB for database

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MuhammadUmar7195/Chat-application.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Chat-application
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
  
  
# For Frontend
VITE_CLOUDINARY_NAME=
VITE_BACKEND_URL= 
# For backend
PORT =
FRONTEND_URL =
DATABASE_URL =
JWT_SECRET_KEY = 

5. Cloudinary set api
   -The service where media files are saved through project folder

### Running the Application
1. Start the backend server:
   ```bash
   npm start
   ```
2. Start the frontend application:
   ```bash
   npm run dev
   ```
3. Access the application at `http://localhost:3000`.

## License
There is no license because of my practice based reason.

