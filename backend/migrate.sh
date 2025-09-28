#!/bin/bash
# Django Migration Script for Park Savvy Space
# This script handles database migrations for users and parking apps

echo "=== Park Savvy Space - Django Migration Script ==="
echo "This script will create and apply migrations for the Django applications."
echo

# Change to the backend directory
cd "$(dirname "$0")"

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 completed successfully"
    else
        echo "❌ $1 failed"
        exit 1
    fi
}

# Function to run Django commands
run_django_command() {
    echo "Running: python manage.py $1"
    python manage.py $1
    check_status "$1"
    echo
}

echo "📋 Step 1: Creating migrations for users app..."
run_django_command "makemigrations users"

echo "📋 Step 2: Creating migrations for parking app..."
run_django_command "makemigrations parking"

echo "📋 Step 3: Applying all migrations..."
run_django_command "migrate"

echo "🎉 All migrations completed successfully!"
echo
echo "Next steps:"
echo "1. Create a superuser: python manage.py createsuperuser"
echo "2. Run the development server: python manage.py runserver"
echo "3. Access the API at: http://localhost:8000/api/v1/"
echo "4. Access the admin panel at: http://localhost:8000/admin/"
echo
