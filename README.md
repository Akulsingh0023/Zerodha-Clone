# Zerodha Clone - MERN Stock Trading Platform

## Project Description
Zerodha Clone is a MERN stack stock trading platform that simulates core trading workflows like account access, market watchlists, buying and selling stocks, and portfolio tracking. It provides a responsive, dashboard-driven experience designed to mirror modern brokerage apps.

## Features
- User registration and login
- Trading dashboard with key metrics
- Watchlist management
- Buy and sell stock flows
- Portfolio and holdings overview
- Responsive UI across devices

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Vite (frontend tooling)

## Installation Steps
1. Clone the repository.
2. Install backend dependencies:
	```bash
	cd Backend
	npm install
	```
3. Install dashboard dependencies:
	```bash
	cd ../dashboard
	npm install
	```
4. Install landing frontend dependencies:
	```bash
	cd ../Frontend
	npm install
	```

## Environment Variables
Create a `.env` file in the `Backend` folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Usage Instructions
1. Start the backend server:
	```bash
	cd Backend
	npm start
	```
2. Start the dashboard app:
	```bash
	cd ../dashboard
	npm run dev
	```
3. Start the landing frontend (optional):
	```bash
	cd ../Frontend
	npm run dev
	```
4. Open the local URLs shown in the terminal to view the app(s).

## Folder Structure
```
Backend/
  controllers/
  middleware/
  model/
  routes/
  schemas/
  services/
  index.js
dashboard/
  public/
  src/
	 components/
	 data/
	 utils/
  index.html
Frontend/
  public/
  src/
	 assets/
	 landing_page/
  index.html
```

## Future Improvements
- Real-time market data integration
- Advanced charting and indicators
- Order history and trade analytics
- Two-factor authentication
- Role-based admin tools

## Author
- Akul
- Shreyash
