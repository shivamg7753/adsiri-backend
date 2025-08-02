# Adsiri Growth Hub Backend

A comprehensive backend API for the Adsiri Growth Hub digital marketing platform, featuring contact form management, admin authentication, and MySQL database integration.

## Features

- **Contact Form Management**: Store and manage contact form submissions in MySQL
- **Admin Dashboard**: Complete admin portal with real-time statistics
- **Email Notifications**: Optional email notifications for new submissions
- **WhatsApp Integration**: Generate WhatsApp links for customer communication
- **JWT Authentication**: Secure admin login system
- **Database Integration**: MySQL with Sequelize ORM
- **RESTful API**: Clean, documented API endpoints

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adsiri-growth-hub/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL Database**
   ```bash
   # Create a new MySQL database
   mysql -u root -p
   CREATE DATABASE adsiri_growth_hub;
   USE adsiri_growth_hub;
   EXIT;
   ```

4. **Environment Configuration**
   ```bash
   # Copy the environment example file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d


# CORS Configuration
CORS_ORIGIN=http://localhost:3000


```

## Database Setup

The application will automatically create the necessary tables when it starts. The main table is:

### Contacts Table
- `id` (Primary Key)
- `firstName` (Required)
- `lastName` (Required)
- `email` (Required, validated)
- `phone` (Optional)
- `service` (Required, enum: seo, social-media, ppc, content, email, other)
- `message` (Required, text)
- `company` (Optional)
- `website` (Optional)
- `budget` (Optional)
- `timeline` (Optional)
- `status` (Default: 'new', enum: new, replied, in-progress, closed)
- `createdAt` (Auto-generated)
- `updatedAt` (Auto-generated)

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin only)
- `GET /api/contact/:id` - Get specific contact (Admin only)
- `PUT /api/contact/:id` - Update contact status (Admin only)
- `GET /api/contact/stats` - Get contact statistics (Admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### WhatsApp
- `GET /api/whatsapp` - Get WhatsApp links

### Health Check
- `GET /health` - Server health status

## Admin Portal Features

- **Real-time Statistics**: View total submissions, new messages, response rates
- **Contact Management**: View, search, and update contact status
- **Search & Filter**: Find contacts by name, email, or company
- **Pagination**: Handle large numbers of submissions
- **Status Updates**: Mark contacts as new, replied, in-progress, or closed

## Email Integration (Optional)

The application can send email notifications when new contact forms are submitted. To enable this:

1. Configure your Gmail SMTP settings in the `.env` file
2. Use an App Password for Gmail (not your regular password)
3. The system will send:
   - Notification email to admin
   - Welcome email to the contact

## Frontend Integration

The frontend React application connects to this backend via:

- Contact form submissions: `POST http://localhost:5000/api/contact`
- Admin dashboard data: `GET http://localhost:5000/api/contact`
- Statistics: `GET http://localhost:5000/api/contact/stats`

## Security Features

- CORS protection
- Helmet security headers
- Input validation
- JWT authentication for admin routes
- SQL injection protection via Sequelize

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists: `mysql -u root -p -e "USE adsiri_growth_hub;"`

### Email Issues
- Check Gmail App Password setup
- Verify SMTP settings
- Check firewall/network settings

### CORS Issues
- Ensure `CORS_ORIGIN` matches your frontend URL
- Check if frontend is running on the correct port

## Development

### Adding New Features
1. Create database models in `src/models/`
2. Add routes in `src/routes/`
3. Update middleware as needed
4. Test with the frontend application

### Database Migrations
The application uses Sequelize sync for simplicity. For production, consider using migrations:

```bash
npx sequelize-cli init
npx sequelize-cli migration:generate --name add-new-field
```

## License

MIT License - see LICENSE file for details 