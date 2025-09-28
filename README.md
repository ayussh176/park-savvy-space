# Park Savvy Space 🅿️

A modern full-stack parking management system that helps users find, reserve, and manage parking spaces efficiently.

## 🌟 Features

- **Smart Parking Search**: Find available parking spots with real-time data
- **User Authentication**: Secure registration and login system with JWT
- **Space Reservation**: Book parking spaces in advance
- **Interactive Dashboard**: Manage bookings and view parking history
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RESTful API**: Well-documented API endpoints for all operations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for modern UI components
- **React Router** for navigation

### Backend
- **Django 5.0** with Python
- **Django REST Framework** for API development
- **Django REST Framework SimpleJWT** for authentication
- **PostgreSQL** database
- **Django CORS Headers** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ayussh176/park-savvy-space.git
cd park-savvy-space
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE park_savvy_db;

-- Create user (optional, you can use existing user)
CREATE USER park_savvy_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE park_savvy_db TO park_savvy_user;

-- Exit PostgreSQL
\q
```

### 3. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment variables file
cp .env.example .env  # Create this if it doesn't exist

# Edit .env file with your database credentials:
# DATABASE_NAME=park_savvy_db
# DATABASE_USER=park_savvy_user
# DATABASE_PASSWORD=your_password
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# SECRET_KEY=your_django_secret_key
# DEBUG=True

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

The Django backend will be available at `http://localhost:8000`

### 4. Frontend Setup (React)

Open a new terminal window:

```bash
# Navigate to project root (if not already there)
cd park-savvy-space

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The React frontend will be available at `http://localhost:5173`

## 🔧 Alternative Setup with Migration Script

For backend setup, you can also use the provided migration script:

```bash
cd backend
chmod +x migrate.sh
./migrate.sh
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Parking Management
- `GET /api/parking/spaces/` - List all parking spaces
- `POST /api/parking/spaces/` - Create new parking space
- `GET /api/parking/spaces/{id}/` - Get specific parking space
- `PUT /api/parking/spaces/{id}/` - Update parking space
- `DELETE /api/parking/spaces/{id}/` - Delete parking space
- `GET /api/parking/search/` - Search parking spaces with filters

### Reservations
- `GET /api/parking/reservations/` - List user reservations
- `POST /api/parking/reservations/` - Create new reservation
- `GET /api/parking/reservations/{id}/` - Get specific reservation
- `PUT /api/parking/reservations/{id}/` - Update reservation
- `DELETE /api/parking/reservations/{id}/` - Cancel reservation

## 📱 Development

### Project Structure

```
park-savvy-space/
├── backend/                 # Django backend
│   ├── backend/            # Main Django project settings
│   ├── parking/            # Parking app (models, views, etc.)
│   ├── users/              # Users app (authentication)
│   ├── manage.py           # Django management script
│   ├── migrate.sh          # Database migration script
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend source
├── public/                 # Static assets
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md              # This file
```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `python manage.py runserver` - Start Django development server
- `python manage.py makemigrations` - Create database migrations
- `python manage.py migrate` - Apply database migrations
- `python manage.py test` - Run tests
- `python manage.py collectstatic` - Collect static files

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
django.db.utils.OperationalError: could not connect to server
```
- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Check if the database exists

**2. CORS Issues**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```
- Ensure `django-cors-headers` is installed
- Check CORS settings in `backend/settings.py`
- Verify frontend URL is in `CORS_ALLOWED_ORIGINS`

**3. Node.js Version Issues**
```
Error: Node.js version X.X.X is not supported
```
- Use Node.js v18 or higher
- Consider using nvm to manage Node.js versions

**4. Python Virtual Environment Issues**
```
ModuleNotFoundError: No module named 'django'
```
- Ensure virtual environment is activated
- Install requirements: `pip install -r requirements.txt`

**5. Migration Issues**
```
django.db.utils.ProgrammingError: relation does not exist
```
- Delete migration files (except `__init__.py`)
- Run `python manage.py makemigrations`
- Run `python manage.py migrate`

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_NAME=park_savvy_db
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 🚀 Deployment

### Backend Deployment (Django)
1. Set `DEBUG=False` in production
2. Configure production database
3. Set up proper `ALLOWED_HOSTS`
4. Configure static files serving
5. Use a production WSGI server like Gunicorn

### Frontend Deployment (React)
1. Run `npm run build` to create production build
2. Deploy `dist` folder to your hosting service
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ayush** - [ayussh176](https://github.com/ayussh176)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for efficient parking management
- Thanks to the open-source community for the amazing tools and libraries

---

**Happy Coding!** 🚀

For any questions or issues, please open an issue on GitHub or contact the maintainers.
