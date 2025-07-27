# Finara UI: Your AI-Powered Financial Assistant

## Project Overview

Finara UI is the frontend application for an AI-powered financial assistant, designed to help users manage their finances, set goals, optimize spending, and receive personalized financial recommendations. Built with React and integrated with Firebase for authentication, this application provides an intuitive chat interface and detailed financial dashboards.

## Features

* **User Authentication:** Secure sign-up and sign-in using Firebase Authentication.
* **AI Chat Interface:** Interact with an AI assistant to get quick answers to financial queries.
* **Financial Goal Setting:** Create and track financial goals (e.g., saving for a car, retirement).
* **Personalized Recommendations:** Get tailored financial advice based on user data (future feature, groundwork laid).
* **Spending Optimization:** Tools to help analyze and manage spending habits (future feature, groundwork laid).
* **Interactive Dashboards:** Visualize key financial metrics and progress towards goals using dynamic charts (e.g., Car Goal Dashboard).

## Technologies Used

* **Frontend:** React.js (with TypeScript)
* **Routing:** React Router DOM
* **Authentication:** Firebase Authentication
* **API Interaction:** Custom `apiService` for backend communication.
* **Charting:** Chart.js with `react-chartjs-2` for interactive data visualization.
* **Icons:** React Icons (`react-icons`)
* **Environment Management:** Create React App's built-in `.env` support.
* **Code Quality:** ESLint, Prettier

## Getting Started

Follow these steps to get your development environment up and running.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn (npm comes with Node.js)
* A Firebase Project with Authentication enabled.
* A running backend API that the UI can connect to.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/codebygeni/finara-ui.git](https://github.com/codebygeni/finara-ui.git)
    cd finara-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Finara UI uses environment variables for sensitive keys and API endpoints. You need to create `.env` files in the root directory of the project.

**Important:** **DO NOT** commit your `.env` files to version control. They are already included in `.gitignore`.

1.  **Create `.env.development` for local development:**
    ```
    REACT_APP_API_BASE_URL=http://localhost:YOUR_BACKEND_PORT/api
    REACT_APP_FIREBASE_API_KEY="YOUR_DEV_FIREBASE_API_KEY"
    REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_DEV_FIREBASE_AUTH_DOMAIN"
    REACT_APP_FIREBASE_PROJECT_ID="YOUR_DEV_FIREBASE_PROJECT_ID"
    REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_DEV_FIREBASE_STORAGE_BUCKET"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_DEV_FIREBASE_MESSAGING_SENDER_ID"
    REACT_APP_FIREBASE_APP_ID="YOUR_DEV_FIREBASE_APP_ID"
    ```

2.  **Create `.env.production` for production builds:**
    ```
    REACT_APP_API_BASE_URL=[https://api.yourdeployedapp.com/api](https://api.yourdeployedapp.com/api)
    REACT_APP_FIREBASE_API_KEY="YOUR_PROD_FIREBASE_API_KEY"
    REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_PROD_FIREBASE_AUTH_DOMAIN"
    REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROD_FIREBASE_PROJECT_ID"
    REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_PROD_FIREBASE_STORAGE_BUCKET"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_PROD_FIREBASE_MESSAGING_SENDER_ID"
    REACT_APP_FIREBASE_APP_ID="YOUR_PROD_FIREBASE_APP_ID"
    ```
    **Replace placeholder values** with your actual backend API URL and Firebase project credentials. You can find your Firebase credentials in your Firebase Project Settings.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    This will open the application in your browser at `http://localhost:3000` (or another port if 3000 is in use).

### Available Routes

* `/`: Redirects to `/signin` if not authenticated, or `/chat` if authenticated.
* `/signin`: User sign-in page.
* `/register`: User registration page.
* `/chat`: The main AI chat interface (protected route).
* `/dashboard`: User's financial dashboard (protected route).
* `/car-goal-dashboard`: A specific interactive dashboard visualizing car goal progress (public route).

## Project Structure