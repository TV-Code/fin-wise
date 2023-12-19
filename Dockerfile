# Use an official Python runtime as a base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code
COPY backend /app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the Django app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "financebackend.wsgi:application"]
