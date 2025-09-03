# Google Reviews API v2.0.0

A modern, TypeScript-based API for fetching Google Play Store app reviews with multi-language support.

## 🚀 Features

- **TypeScript Implementation** - Full type safety and modern JavaScript features
- **Modular Architecture** - Clean separation of concerns with services, controllers, and utilities
- **Multi-language Support** - 100+ supported languages
- **Country-specific Reviews** - Region-based review filtering
- **Real-time Data** - Live Google Play Store data
- **Comprehensive API** - Reviews, app info, search, and suggestions
- **Swagger Documentation** - Interactive API documentation
- **Performance Monitoring** - Built-in metrics and logging
- **Error Handling** - Robust error handling with proper HTTP status codes
- **Rate Limiting** - Built-in protection against abuse
- **Vercel Ready** - Optimized for serverless deployment

## 🏗️ Architecture

```
src/
├── types/           # TypeScript interfaces and types
├── constants/       # Application constants and configuration
├── utils/           # Utility functions and helpers
├── services/        # Business logic services
├── controllers/     # Request/response handlers
├── routes/          # API route definitions
├── app.ts          # Express application setup
└── index.ts        # Application entry point

api/
└── app.ts          # Vercel serverless function

dist/               # Compiled JavaScript output
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd google-reviews-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Development

### Local Development
```bash
npm run dev
```
This starts the development server with hot reloading at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint      # ESLint checking
npm run format    # Prettier formatting
```

## 🌐 API Endpoints

### Core Endpoints
- `GET /app` - Get app reviews
- `GET /app/info` - Get app information
- `GET /app/search` - Search for apps
- `GET /app/suggestions` - Get app suggestions

### Documentation
- `GET /swagger` - Interactive API documentation
- `GET /swagger.json` - OpenAPI specification
- `GET /health` - API health status
- `GET /info` - API information

## 📖 Usage Examples

### Get App Reviews
```bash
# Basic usage
curl "https://your-domain.com/app?appid=com.whatsapp"

# With country and language
curl "https://your-domain.com/app?appid=com.whatsapp&country=us&lang=en"

# Multiple languages (default)
curl "https://your-domain.com/app?appid=com.whatsapp&country=vn"
```

### Search for Apps
```bash
curl "https://your-domain.com/app/search?q=whatsapp&limit=10"
```

### Get App Information
```bash
curl "https://your-domain.com/app/info?appid=com.whatsapp"
```

## 🔧 Configuration

### Environment Variables
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=production         # Environment (development/production)
```

### API Configuration
The API behavior can be configured in `src/constants/index.ts`:
- Default review count
- Request timeout
- Rate limiting delay
- Supported languages

## 🚀 Deployment

### Vercel Deployment
1. **Push to GitHub** - The repository is configured for automatic Vercel deployment
2. **Custom Domain** - Configure your domain in Vercel dashboard
3. **Environment Variables** - Set any required environment variables

### Manual Deployment
```bash
npm run build
vercel --prod
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "review-id",
        "userName": "User Name",
        "content": "Review content",
        "score": 5,
        "at": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🛠️ Development

### Project Structure
- **Services** - Handle business logic and external API calls
- **Controllers** - Manage HTTP requests and responses
- **Routes** - Define API endpoints
- **Utils** - Common utility functions
- **Types** - TypeScript type definitions
- **Constants** - Application constants

### Adding New Features
1. **Define types** in `src/types/index.ts`
2. **Add constants** in `src/constants/index.ts`
3. **Create service** in `src/services/`
4. **Add controller** in `src/controllers/`
5. **Update routes** in `src/routes/index.ts`
6. **Update Vercel function** in `api/app.ts`

### Testing
```bash
npm test
```

## 🔒 Security Features

- **Input Validation** - All inputs are validated and sanitized
- **CORS Protection** - Configurable cross-origin resource sharing
- **Security Headers** - XSS protection, content type options
- **Rate Limiting** - Built-in protection against abuse
- **Error Handling** - No sensitive information in error messages

## 📈 Performance

- **Parallel Processing** - Multi-language reviews fetched concurrently
- **Caching** - Built-in caching for repeated requests
- **Performance Monitoring** - Request timing and memory usage tracking
- **Optimized Queries** - Efficient Google Play Store data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- **Documentation**: `/swagger` endpoint
- **Issues**: GitHub Issues
- **Contact**: API Support team

## 🔄 Migration from v1.0

The new TypeScript version maintains API compatibility while providing:
- Better type safety
- Improved error handling
- Enhanced performance monitoring
- Modular architecture
- Better maintainability

All existing API calls will continue to work without changes.
