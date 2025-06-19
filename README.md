# Smart Booking Suite

A comprehensive booking management system with role-based access control.

## Project Structure

```
smart-booking-suite/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── tests/          # Test files
├── docs/               # Documentation
├── .env.example        # Environment variables example
└── .gitignore          # Git ignore file
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-booking-suite.git
   cd smart-booking-suite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Git Flow

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Branch Naming

- `feature/add-user-authentication`
- `bugfix/fix-login-issue`
- `hotfix/security-patch`

## API Documentation

API documentation is available at `/api-docs` when running the development server.

## Testing

Run tests with:
```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.