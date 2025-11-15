# Admin Panel Setup Guide

## Prerequisites
- Node.js installed
- Database credentials configured in `.env.local`

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run db:generate
```

### 3. Push Database Schema
```bash
npm run db:push
```

This will create the following tables:
- `admins` - Admin users
- `properties` - Property listings
- `property_translations` - Multi-language property content (EN, DE, ES)

### 4. Seed Admin User
```bash
npm run db:seed
```

This creates a default admin user:
- **Email**: admin@propertyicon.com
- **Password**: admin123
- ⚠️ **Change the password after first login!**

### 5. Start Development Server
```bash
npm run dev
```

## Admin Panel Access

Navigate to: `http://localhost:3000/admin/login`

### Default Credentials
- Email: `admin@propertyicon.com`
- Password: `admin123`

## Features

### ✅ Admin Dashboard
- View statistics (Total Properties, Available, Sold, Total Value)
- Quick actions

### ✅ Property Management
- **View All Properties**: List all properties with search functionality
- **Add New Property**: Create new property with multi-language support
- **Edit Property**: Update existing property details
- **Delete Property**: Remove property from database
- **View Property**: Preview property on frontend

### ✅ Multi-Language Support
Each property can have translations in:
- English (EN)
- German (DE)
- Spanish (ES)

### ✅ Property Fields
- Basic Info: Slug, Status, Type, Year, Price, Bedrooms, Bathrooms, Area, Location
- Images: Multiple image URLs
- Translations: Title, Subtitle, Description, Features (for each language)
- Coordinates: JSON format for maps
- Featured: Mark property as featured

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin user

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

## Database Schema

### Admin Table
```sql
- id: UUID (primary key)
- email: String (unique)
- password: String (hashed)
- name: String (optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Property Table
```sql
- id: UUID (primary key)
- slug: String (unique, URL-friendly)
- status: String (available, sold, leased, etc.)
- type: String (residential, commercial, hospitality, land)
- year: Int (optional)
- price: Float
- bedrooms: Int (optional)
- bathrooms: Int (optional)
- area: Float (optional, m²)
- location: String
- coordinates: String (optional, JSON)
- featured: Boolean
- images: String[] (array of URLs)
- createdAt: DateTime
- updatedAt: DateTime
```

### Property Translation Table
```sql
- id: UUID (primary key)
- propertyId: UUID (foreign key)
- locale: String (en, de, es)
- title: String
- description: Text
- subtitle: String (optional)
- features: String[] (array)
- Unique constraint on (propertyId, locale)
```

## Security Notes

1. **Change Default Password**: Immediately change the admin password after first login
2. **JWT Secret**: Update `JWT_SECRET` in `.env.local` for production
3. **HTTPS**: Always use HTTPS in production
4. **Cookie Settings**: Admin tokens are httpOnly and secure in production

## Troubleshooting

### Database Connection Issues
- Verify `.env.local` has correct database credentials
- Check network connectivity to Supabase
- Ensure database URL uses correct connection pooling

### Prisma Client Errors
- Run `npm run db:generate` again
- Restart the development server

### Authentication Issues
- Clear browser cookies
- Verify JWT_SECRET is set in `.env.local`
- Check server logs for errors

