# Injibara University Transport System API Documentation

## Overview

Base URL: `http://localhost:5000/api`

All API endpoints require authentication unless specified otherwise. Authentication is performed using JWT tokens.

## Authentication

### Login
```http
POST /auth/login