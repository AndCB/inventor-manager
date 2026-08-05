# Inventory Management API

> **Languages:** [English](README.MD) | [Español](README.es.md)

This project is a web-based application that allows users to manage inventory items and viewing inventory records. The system supports pagination, filtering, and sorting of inventory items to enhance usability. It also features an easy-to-use UI for managing inventory and interacting with the backend API.
The API allows you to perform CRUD operations on inventory items, including fetching all items, fetching an item by ID, creating new items, updating existing items, and deleting items.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Running Unit Tests](#running-unit-tests)

## Features

- Retrieve all inventory items with pagination support.
- Fetch specific inventory items by their unique ID.
- Add new inventory items to the database.
- Update existing inventory items.
- Delete inventory items from the database.
- User registration and login with JWT authentication.
- Write operations (create, update, delete) are protected and require a valid token.
- Real-time feedback using snackbars for user actions

## Technologies Used

### Backend

- **ASP.NET Core**: For building the web API.
- **Entity Framework Core**: For interacting with the database.
- **ASP.NET Core Identity**: For user management and password hashing.
- **JWT (JwtBearer)**: For issuing and validating authentication tokens.
- **xUnit**: For unit testing.
- **Moq**: For mocking dependencies in tests.
- **SQL Server**: For database management.
- **Swagger**: For API documentation.

### Frontend

- **React**: Javascript library for building interfaces.
- **Material-UI**: Component library for building responsive and accesible UIs.
- **Axios**: For making HTTP requests to the backend API.
- **Typescript**: For type safety in the frontend code.
- **Vite**: For bundling and development server.
- **Tailwind CSS**: For styling.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/) (recommended). The easiest way to run SQL Server via `docker compose`.
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0). The repo pins this version via `global.json`, so `dotnet` commands automatically use it.
- [Node.js](https://nodejs.org/) (for the frontend)

## Quick Start (Docker)

```bash
# 1. Start SQL Server 2022 (default SA password: Inventory!Dev123)
docker compose up -d

# 2. Backend: apply migrations and run (swagger at http://localhost:5147/swagger)
cd backend
dotnet ef database update
dotnet run

# 3. Frontend: install and run (first create frontend/.env.local with VITE_API_URL=http://localhost:5147/api)
cd ../frontend
npm install
npm run dev
```

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/andcb/inventory-management-api.git
    ```

2.  Setup the backend:

    - Navigate to the backend folder

      ```bash
      cd backend
      ```

    - Restore NuGet packages

      ```bash
      dotnet restore
      ```

    - Start SQL Server via Docker (the connection string in `appsettings.json` already targets this instance):

      ```bash
      docker compose up -d
      ```

    - Apply migrations to the database (migrations for the inventory table and the Identity user tables are included in the repo)

      ```bash
      dotnet ef database update
      ```

    - Build the project

      ```bash
      dotnet build
      ```

3.  Frontend Setup:

    - Navigate to the frontend folder

      ```bash
      cd ../frontend
      ```

    - Install npm packages

      ```bash
      npm install
      ```

    - Create a `.env.local` file with the address of the api (the default `dotnet run` port is 5147):

      ```bash
      VITE_API_URL=http://localhost:5147/api
      ```

## Setting up the databse

If you don't want to use EntityFramework migrations you can also create the database manually:

```sql
  CREATE TABLE [InventoryItems] (
       [Id] int NOT NULL IDENTITY,
       [Name] nvarchar(max) NOT NULL,
       [Quantity] int NOT NULL,
       [Price] decimal(10,2) NOT NULL,
       CONSTRAINT [PK_InventoryItems] PRIMARY KEY ([Id])
   );
```

You can also use the following data for populating the database:

<details>

```sql
INSERT INTO [InventoryItems] ([Name], [Quantity], [Price])
VALUES
('Apple MacBook Pro 16"', 50, 2399.99),
('Samsung Galaxy S21', 120, 799.99),
('Sony WH-1000XM4 Headphones', 75, 349.99),
('Dell XPS 13', 80, 1299.99),
('HP Spectre x360', 60, 1399.99),
('Google Pixel 5', 90, 699.99),
('Microsoft Surface Pro 7', 40, 899.99),
('Fitbit Versa 3', 100, 229.99),
('Logitech MX Master 3 Mouse', 110, 99.99),
('Amazon Echo Dot (4th Gen)', 150, 49.99),
('Nikon D3500 Camera', 30, 499.99),
('Canon EOS Rebel T7', 25, 449.99),
('iPad Pro 11"', 65, 799.99),
('Samsung Galaxy Tab S7', 55, 649.99),
('Razer Blade 15 Gaming Laptop', 20, 2499.99),
('Asus ROG Zephyrus G14', 15, 1799.99),
('Bose SoundLink Revolve', 45, 199.99),
('GoPro HERO9 Black', 35, 399.99),
('Anker PowerCore 10000', 200, 29.99),
('Sony A7 III Camera', 10, 1999.99),
('DJI Mavic Air 2', 18, 799.99),
('Oculus Quest 2', 25, 299.99),
('HP Omen 15 Gaming Laptop', 22, 1399.99),
('Apple AirPods Pro', 150, 249.99),
('Microsoft Xbox Series X', 30, 499.99),
('Sony PlayStation 5', 20, 499.99),
('Nintendo Switch', 40, 299.99),
('iPhone 12', 75, 999.99),
('Samsung 970 EVO SSD 1TB', 50, 149.99),
('Western Digital My Passport 2TB', 65, 89.99),
('Seagate Backup Plus 4TB', 45, 99.99),
('Lenovo ThinkPad X1 Carbon', 25, 1699.99),
('Acer Aspire 5', 55, 549.99),
('LG OLED55CXPUA TV', 15, 1399.99),
('Vizio 55-Inch 4K Smart TV', 30, 649.99),
('Samsung Galaxy Buds+', 80, 149.99),
('Bose QuietComfort 35 II', 20, 299.99),
('HP Envy 13', 45, 999.99),
('Apple Watch Series 6', 65, 399.99),
('Fitbit Charge 4', 100, 149.99),
('Roku Streaming Stick 4K', 150, 49.99),
('Google Nest Hub', 70, 99.99),
('Philips Hue White LED Smart Bulb', 200, 14.99),
('Keurig K-Elite Coffee Maker', 50, 129.99),
('Instant Pot Duo 7-in-1', 80, 89.99),
('KitchenAid Stand Mixer', 20, 349.99),
('Nespresso Vertuo Coffee Maker', 30, 199.99),
('Dyson V11 Torque Drive', 25, 599.99),
('Shark Navigator Lift-Away', 45, 199.99),
('iRobot Roomba 675', 35, 299.99),
('Breville Smart Oven', 15, 199.99),
('Cuisinart 14-Cup Food Processor', 18, 199.99),
('Hamilton Beach Slow Cooker', 50, 49.99),
('Vitamix 5200 Blender', 20, 449.99),
('Black+Decker 20V Max Drill', 55, 79.99),
('Makita 18V LXT Circular Saw', 30, 149.99),
('DeWalt 20V Max Lithium-Ion Cordless Combo Kit', 25, 349.99),
('Craftsman 20-Piece Socket Set', 50, 89.99),
('Ryobi 18V Cordless Drill', 40, 99.99),
('Milwaukee M18 Fuel 1/2" Hammer Drill', 22, 199.99),
('Stanley 77-Piece Mechanics Tool Set', 35, 159.99),
('Dremel 4300 Rotary Tool Kit', 30, 199.99),
('Greenworks 20-Inch Cordless Lawn Mower', 18, 349.99),
('Sun Joe Electric Pressure Washer', 20, 159.99),
('Toro 22-Inch Recycler Mower', 25, 299.99),
('Black+Decker Electric Leaf Blower', 40, 99.99),
('Coleman Portable Camping Chair', 100, 39.99),
('REI Co-op Flash 22 Pack', 80, 59.99),
('YETI Rambler 20 oz Tumbler', 150, 29.99),
('LifeStraw Personal Water Filter', 200, 19.99),
('Patagonia Black Hole Duffel Bag', 30, 129.99),
('Columbia Bugaboo II Fleece Interchange Jacket', 25, 89.99),
('The North Face Recon Backpack', 20, 99.99);
```
</details>

## Running the Application

To run the application locally, use the following commands:

- backend
  ```bash
  dotnet run
  ```
- frontend
  ```bash
  npm run dev
  ```

## API Documentation

The project uses Swagger for documenting the API.

1.  Start the API by running `dotnet run` from the `backend` folder.
2.  Navigate to `http:\\localhost:PORT/swagger` to explore and interact with the API.
3.  The Swagger UI includes an **Authorize** button where you can paste the JWT returned by the `/api/auth/login` or `/api/auth/register` endpoints.

### Authentication

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Registers a new account. Body: `{ "username": "...", "password": "..." }` |
| `/api/auth/login` | POST | Logs in and returns a JWT. Body: `{ "username": "...", "password": "..." }` |

Both endpoints return `{ "token": "<jwt>", "username": "..." }`. The token expires after 24 hours.

The `GET` inventory endpoints are public. Creating, updating, and deleting items requires a valid JWT sent as the `Authorization: Bearer <token>` header.

The JWT signing key, issuer, and audience are configured under the `JWT` section of `appsettings.json`. **Change the `Key` to a strong, unique secret before deploying.**

## Running Unit Tests

The project includes tests for the backend using xunit and Moq for mocking the repository dependencies.

To run the tests:

1.  Navigate to `backendTests` folder:

```bash
cd backendTests
```

2.  Run the unit tests using the following command:

```bash
dotnet test
```

The tests cover the `InventoryController` endpoints as well as the authentication flow:

- Fetching all items
- Fetching an item by Id.
- Creating new items.
- Updating items.
- Deleting items.
- Registering a new account and receiving a JWT.
- Rejecting duplicate usernames and weak passwords.
- Logging in with valid and invalid credentials.
- Generating JWTs with the correct claims, expiry, and signature.

For further information check out xunit's official documantation at [https://xunit.net/]
