import { SwaggerSpec } from '../types';
import { SWAGGER_CONFIG } from '../constants';

/**
 * Service for generating and serving Swagger documentation
 */
export class SwaggerService {
  /**
   * Generate OpenAPI specification
   */
  generateSwaggerSpec(baseUrl: string): SwaggerSpec {
    return {
      openapi: "3.0.0",
      info: {
        title: SWAGGER_CONFIG.TITLE,
        description: SWAGGER_CONFIG.DESCRIPTION,
        version: SWAGGER_CONFIG.VERSION,
        contact: {
          name: SWAGGER_CONFIG.CONTACT_NAME,
          url: SWAGGER_CONFIG.CONTACT_URL,
        },
      },
      servers: [
        {
          url: baseUrl,
          description: "Production server",
        },
      ],
      paths: {
        "/app": {
          get: {
            summary: "Get Google Play Store Reviews",
            description: "Fetch reviews for a specific app from Google Play Store. Supports multiple languages and countries.",
            operationId: "getAppReviews",
            parameters: [
              {
                name: "appid",
                in: "query",
                required: true,
                description: "The Google Play Store app ID (e.g., 'com.whatsapp')",
                schema: {
                  type: "string",
                },
                example: "com.whatsapp",
              },
              {
                name: "country",
                in: "query",
                required: false,
                description: "Country code for region-specific reviews (e.g., 'us', 'gb', 'de')",
                schema: {
                  type: "string",
                },
                example: "us",
              },
              {
                name: "lang",
                in: "query",
                required: false,
                description: "Language code for specific language reviews. If not provided, fetches reviews in all supported languages.",
                schema: {
                  type: "string",
                },
                example: "en",
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ReviewResponse",
                    },
                    example: {
                      data: [
                        {
                          id: "gp:AOqpTOHh_123456789",
                          userName: "John Doe",
                          userImage: "https://lh3.googleusercontent.com/...",
                          content: "Great app! Very useful.",
                          score: 5,
                          thumbsUpCount: 12,
                          reviewCreatedVersion: "2.1.0",
                          at: "2024-01-15T10:30:00Z",
                          replyContent: "Thank you for your feedback!",
                          repliedAt: "2024-01-16T09:15:00Z",
                        },
                      ],
                    },
                  },
                },
              },
              "400": {
                description: "Bad request - Missing required parameter",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiError",
                    },
                    example: {
                      error: "Missing required parameter: appid",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiError",
                    },
                    example: {
                      error: "Failed to fetch reviews",
                    },
                  },
                },
              },
            },
          },
        },
        "/swagger": {
          get: {
            summary: "API Documentation",
            description: "Interactive API documentation using Swagger UI",
            operationId: "getSwaggerUI",
            responses: {
              "200": {
                description: "HTML page with Swagger UI",
              },
            },
          },
        },
        "/swagger.json": {
          get: {
            summary: "OpenAPI Specification",
            description: "Returns the OpenAPI specification in JSON format",
            operationId: "getSwaggerSpec",
            responses: {
              "200": {
                description: "OpenAPI specification",
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Review: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique review ID",
              },
              userName: {
                type: "string",
                description: "Name of the reviewer",
              },
              userImage: {
                type: "string",
                description: "URL to reviewer's profile image",
              },
              content: {
                type: "string",
                description: "Review content",
              },
              score: {
                type: "number",
                description: "Rating score (1-5)",
              },
              thumbsUpCount: {
                type: "number",
                description: "Number of thumbs up",
              },
              reviewCreatedVersion: {
                type: "string",
                description: "App version when review was created",
              },
              at: {
                type: "string",
                description: "Review creation date",
              },
              replyContent: {
                type: "string",
                description: "Developer's reply to the review",
              },
              repliedAt: {
                type: "string",
                description: "Date when developer replied",
              },
            },
          },
          ReviewResponse: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Review",
                },
              },
            },
          },
          ApiError: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
        },
      },
    };
  }

  /**
   * Generate Swagger UI HTML
   */
  generateSwaggerUI(baseUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SWAGGER_CONFIG.TITLE} - Swagger Documentation</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        body { margin: 0; padding: 0; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #3b4151; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '${baseUrl}/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
  }
}

// Export singleton instance
export const swaggerService = new SwaggerService();
