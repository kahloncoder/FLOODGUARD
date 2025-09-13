# Dockerfile for the FloodGuard Project

# ------------------------------------------------------------------------------------
# Stage 1: Frontend Builder
# Purpose: Build the React/TypeScript frontend into static files.
# ------------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

# Set the working directory for the frontend build process
WORKDIR /usr/src/frontend

# Copy package manifests first to leverage Docker layer caching
COPY frontend/package.json frontend/package-lock.json* ./

# Install frontend dependencies securely and reproducibly
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ ./

# Run the build script defined in package.json to generate static files
# The output will be in the `/usr/src/frontend/dist` directory (Vite's default)
RUN npm run build

# ------------------------------------------------------------------------------------
# Stage 2: Backend Runtime
# Purpose: Create the final, optimized Python environment for our application.
# ------------------------------------------------------------------------------------
# We use a 'slim' image to keep the final size smaller.
FROM python:3.11-slim AS final-image

# A good practice to prevent Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Ensures Python output is sent straight to the terminal without buffering
ENV PYTHONUNBUFFERED=1

# Set the working directory for the backend application
WORKDIR /usr/src/app

# --- CRITICAL: Install System Dependencies for Geospatial Libraries ---
# Many Python GIS libraries (like those using GDAL) are wrappers around C/C++ libraries.
# We must install them using the system's package manager (apt-get) BEFORE pip install.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libgdal-dev \
       gdal-bin \
       libgeos-dev \
       libproj-dev \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install required build tools
RUN pip install --upgrade pip setuptools wheel

# Copy only the dependency definition files first for caching
COPY pyproject.toml ./

# Install Python dependencies using pip with pyproject.toml
RUN pip install -e .

# Install additional dependencies for production
RUN pip install python-dotenv

# Copy the backend source code into the container
COPY . .

# --- KEY STEP: Copy the built frontend from the first stage ---
# We take the static files from the 'frontend-builder' stage and place them
# in a '/static' directory. Our FastAPI app will be configured to serve these files.
COPY --from=frontend-builder /usr/src/frontend/dist ./static

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' --shell /bin/bash user \
    && chown -R user:user /usr/src/app
USER user

# Expose the port the FastAPI application will run on
EXPOSE 5000

# The command to run when the container starts.
# --host 0.0.0.0 is essential to make the server accessible from outside the container.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]