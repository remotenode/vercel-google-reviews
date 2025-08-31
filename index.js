//https://github.com/facundoolano/google-play-scraper?tab=readme-ov-file#reviews

import express from "express";
const app = express();
const PORT = 3000;
import gplay from "google-play-scraper";
import path from 'path';
import fs from 'fs';

// Swagger documentation route
app.get('/swagger', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Reviews API - Swagger Documentation</title>
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
                url: '/swagger.json',
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
    res.send(html);
});

// Swagger JSON specification
app.get('/swagger.json', (req, res) => {
    const swaggerSpec = {
        "openapi": "3.0.0",
        "info": {
            "title": "Google Reviews API",
            "description": "API for fetching Google Play Store app reviews with multi-language support",
            "version": "1.0.0",
            "contact": {
                "name": "API Support",
                "url": "https://github.com/remotenode/vercel-google-reviews"
            }
        },
        "servers": [
            {
                "url": "https://google-reviews-9jxjwigrp-artsyomavanesov-gmailcoms-projects.vercel.app",
                "description": "Production server"
            },
            {
                "url": "http://localhost:3000",
                "description": "Development server"
            }
        ],
        "paths": {
            "/app": {
                "get": {
                    "summary": "Get Google Play Store Reviews",
                    "description": "Fetch reviews for a specific app from Google Play Store. Supports multiple languages and countries.",
                    "operationId": "getAppReviews",
                    "parameters": [
                        {
                            "name": "appid",
                            "in": "query",
                            "required": true,
                            "description": "The Google Play Store app ID (e.g., 'com.whatsapp')",
                            "schema": {
                                "type": "string"
                            },
                            "example": "com.whatsapp"
                        },
                        {
                            "name": "country",
                            "in": "query",
                            "required": false,
                            "description": "Country code for region-specific reviews (e.g., 'us', 'gb', 'de')",
                            "schema": {
                                "type": "string"
                            },
                            "example": "us"
                        },
                        {
                            "name": "lang",
                            "in": "query",
                            "required": false,
                            "description": "Language code for specific language reviews. If not provided, fetches reviews in all supported languages.",
                            "schema": {
                                "type": "string"
                            },
                            "example": "en"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "data": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "id": {
                                                            "type": "string",
                                                            "description": "Unique review ID"
                                                        },
                                                        "userName": {
                                                            "type": "string",
                                                            "description": "Name of the reviewer"
                                                        },
                                                        "userImage": {
                                                            "type": "string",
                                                            "description": "URL to reviewer's profile image"
                                                        },
                                                        "content": {
                                                            "type": "string",
                                                            "description": "Review content"
                                                        },
                                                        "score": {
                                                            "type": "number",
                                                            "description": "Rating score (1-5)"
                                                        },
                                                        "thumbsUpCount": {
                                                            "type": "number",
                                                            "description": "Number of thumbs up"
                                                        },
                                                        "reviewCreatedVersion": {
                                                            "type": "string",
                                                            "description": "App version when review was created"
                                                        },
                                                        "at": {
                                                            "type": "string",
                                                            "description": "Review creation date"
                                                        },
                                                        "replyContent": {
                                                            "type": "string",
                                                            "description": "Developer's reply to the review"
                                                        },
                                                        "repliedAt": {
                                                            "type": "string",
                                                            "description": "Date when developer replied"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "example": {
                                        "data": [
                                            {
                                                "id": "gp:AOqpTOHh_123456789",
                                                "userName": "John Doe",
                                                "userImage": "https://lh3.googleusercontent.com/...",
                                                "content": "Great app! Very useful.",
                                                "score": 5,
                                                "thumbsUpCount": 12,
                                                "reviewCreatedVersion": "2.1.0",
                                                "at": "2024-01-15T10:30:00Z",
                                                "replyContent": "Thank you for your feedback!",
                                                "repliedAt": "2024-01-16T09:15:00Z"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Bad request - Missing required parameter",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "example": {
                                        "error": "Missing required parameter: appid"
                                    }
                                }
                            }
                        },
                        "500": {
                            "description": "Internal server error",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "example": {
                                        "error": "Failed to fetch reviews"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/swagger": {
                "get": {
                    "summary": "API Documentation",
                    "description": "Interactive API documentation using Swagger UI",
                    "operationId": "getSwaggerUI",
                    "responses": {
                        "200": {
                            "description": "HTML page with Swagger UI"
                        }
                    }
                }
            },
            "/swagger.json": {
                "get": {
                    "summary": "OpenAPI Specification",
                    "description": "Returns the OpenAPI specification in JSON format",
                    "operationId": "getSwaggerSpec",
                    "responses": {
                        "200": {
                            "description": "OpenAPI specification"
                        }
                    }
                }
            }
        },
        "components": {
            "schemas": {
                "Review": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique review ID"
                        },
                        "userName": {
                            "type": "string",
                            "description": "Name of the reviewer"
                        },
                        "userImage": {
                            "type": "string",
                            "description": "URL to reviewer's profile image"
                        },
                        "content": {
                            "type": "string",
                            "description": "Review content"
                        },
                        "score": {
                            "type": "number",
                            "description": "Rating score (1-5)"
                        },
                        "thumbsUpCount": {
                            "type": "number",
                            "description": "Number of thumbs up"
                        },
                        "reviewCreatedVersion": {
                            "type": "string",
                            "description": "App version when review was created"
                        },
                        "at": {
                            "type": "string",
                            "description": "Review creation date"
                        },
                        "replyContent": {
                            "type": "string",
                            "description": "Developer's reply to the review"
                        },
                        "repliedAt": {
                            "type": "string",
                            "description": "Date when developer replied"
                        }
                    }
                }
            }
        }
    };
    res.json(swaggerSpec);
});

// Define the endpoint
app.get('/app', async (req, res) => {
    const { appid, country, lang } = req.query;

    // Validate required parameter
    if (!appid) {
        return res.status(400).json({ error: 'Missing required parameter: appid' });
    }

    const options = {
        num: 30,
        sort: gplay.sort.NEWEST,
        appId: appid,
    };

    if (country) options.country = country;
    if (lang) {
        options.lang = lang;

        try {
            const reviews = await gplay.reviews(options);
            return res.json(reviews);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch reviews' });
        }

    }

    /* const filePath = 'api/languages.json';// path.join(__dirname, 'api', 'languages.json');
     const rawData = fs.readFileSync(filePath, 'utf8');
     var langs = JSON.parse(rawData);*/

    const fetchPromises = languages.map(async (l) => {
        const langOptions = { ...options, lang: l.code };
        try {
            const result = await gplay.reviews(langOptions);
            return result.data || [];
        } catch (err) {
            console.error(`Error fetching reviews for ${l.code}:`, err.message);
            return [];
        }
    });

    try {
        const results = await Promise.all(fetchPromises);
        let allReviews = results.flat();
        console.log(`Take ${allReviews.length} reviews`);
        const seen = new Set();
        allReviews = allReviews.filter(review => {
            if (!seen.has(review.id)) {
                seen.add(review.id);
                return true;
            }
            return false;
        });


        // Sort by newest date
        allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(`Filter ${allReviews.length} reviews`);
        const reviews = {
            data: allReviews
        };
        res.json(reviews);
    } catch (err) {
        console.error('Error during parallel fetching:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const languages = [
    { "code": "aa", "language": "Afar" },
    { "code": "ab", "language": "Abkhazian" },
    { "code": "af", "language": "Afrikaans" },
    { "code": "ak", "language": "Akan" },
    { "code": "am", "language": "Amharic" },
    { "code": "ar", "language": "Arabic" },
    { "code": "as", "language": "Assamese" },
    { "code": "ay", "language": "Aymara" },
    { "code": "az", "language": "Azerbaijani" },
    { "code": "ba", "language": "Bashkir" },
    { "code": "be", "language": "Belarusian" },
    { "code": "bg", "language": "Bulgarian" },
    { "code": "bh", "language": "Bihari" },
    { "code": "bi", "language": "Bislama" },
    { "code": "bn", "language": "Bengali" },
    { "code": "bo", "language": "Tibetan" },
    { "code": "br", "language": "Breton" },
    { "code": "bs", "language": "Bosnian" },
    { "code": "ca", "language": "Catalan" },
    { "code": "ce", "language": "Chechen" },
    { "code": "co", "language": "Corsican" },
    { "code": "cs", "language": "Czech" },
    { "code": "cy", "language": "Welsh" },
    { "code": "da", "language": "Danish" },
    { "code": "de", "language": "German" },
    { "code": "dz", "language": "Dzongkha" },
    { "code": "el", "language": "Greek" },
    { "code": "en", "language": "English" },
    { "code": "eo", "language": "Esperanto" },
    { "code": "es", "language": "Spanish" },
    { "code": "et", "language": "Estonian" },
    { "code": "eu", "language": "Basque" },
    { "code": "fa", "language": "Persian" },
    { "code": "fi", "language": "Finnish" },
    { "code": "fj", "language": "Fijian" },
    { "code": "fo", "language": "Faroese" },
    { "code": "fr", "language": "French" },
    { "code": "fy", "language": "Frisian" },
    { "code": "ga", "language": "Irish" },
    { "code": "gd", "language": "Scottish Gaelic" },
    { "code": "gl", "language": "Galician" },
    { "code": "gn", "language": "Guarani" },
    { "code": "gu", "language": "Gujarati" },
    { "code": "ha", "language": "Hausa" },
    { "code": "he", "language": "Hebrew" },
    { "code": "hi", "language": "Hindi" },
    { "code": "hr", "language": "Croatian" },
    { "code": "hu", "language": "Hungarian" },
    { "code": "hy", "language": "Armenian" },
    { "code": "ia", "language": "Interlingua" },
    { "code": "id", "language": "Indonesian" },
    { "code": "ie", "language": "Interlingue" },
    { "code": "ik", "language": "Inupiaq" },
    { "code": "is", "language": "Icelandic" },
    { "code": "it", "language": "Italian" },
    { "code": "iu", "language": "Inuktitut" },
    { "code": "ja", "language": "Japanese" },
    { "code": "jv", "language": "Javanese" },
    { "code": "ka", "language": "Georgian" },
    { "code": "kk", "language": "Kazakh" },
    { "code": "kl", "language": "Greenlandic" },
    { "code": "km", "language": "Khmer" },
    { "code": "kn", "language": "Kannada" },
    { "code": "ko", "language": "Korean" },
    { "code": "ks", "language": "Kashmiri" },
    { "code": "ku", "language": "Kurdish" },
    { "code": "ky", "language": "Kyrgyz" },
    { "code": "la", "language": "Latin" },
    { "code": "lb", "language": "Luxembourgish" },
    { "code": "lg", "language": "Ganda" },
    { "code": "li", "language": "Limburgish" },
    { "code": "ln", "language": "Lingala" },
    { "code": "lo", "language": "Lao" },
    { "code": "lt", "language": "Lithuanian" },
    { "code": "lu", "language": "Luba-Katanga" },
    { "code": "lv", "language": "Latvian" },
    { "code": "mg", "language": "Malagasy" },
    { "code": "mh", "language": "Marshallese" },
    { "code": "mi", "language": "Maori" },
    { "code": "mk", "language": "Macedonian" },
    { "code": "ml", "language": "Malayalam" },
    { "code": "mn", "language": "Mongolian" },
    { "code": "mr", "language": "Marathi" },
    { "code": "ms", "language": "Malay" },
    { "code": "mt", "language": "Maltese" },
    { "code": "my", "language": "Burmese" },
    { "code": "na", "language": "Nauru" },
    { "code": "ne", "language": "Nepali" },
    { "code": "nl", "language": "Dutch" },
    { "code": "no", "language": "Norwegian" },
    { "code": "oc", "language": "Occitan" },
    { "code": "om", "language": "Oromo" },
    { "code": "or", "language": "Odia" },
    { "code": "pa", "language": "Punjabi" },
    { "code": "pl", "language": "Polish" },
    { "code": "ps", "language": "Pashto" },
    { "code": "pt", "language": "Portuguese" },
    { "code": "qu", "language": "Quechua" },
    { "code": "rm", "language": "Romansh" },
    { "code": "rn", "language": "Rundi" },
    { "code": "ro", "language": "Romanian" },
    { "code": "ru", "language": "Russian" },
    { "code": "rw", "language": "Kinyarwanda" },
    { "code": "sa", "language": "Sanskrit" },
    { "code": "sc", "language": "Sardinian" },
    { "code": "sd", "language": "Sindhi" },
    { "code": "se", "language": "Northern Sami" },
    { "code": "sg", "language": "Sango" },
    { "code": "si", "language": "Sinhala" },
    { "code": "sk", "language": "Slovak" },
    { "code": "sl", "language": "Slovenian" },
    { "code": "sm", "language": "Samoan" },
    { "code": "sn", "language": "Shona" },
    { "code": "so", "language": "Somali" },
    { "code": "sq", "language": "Albanian" },
    { "code": "sr", "language": "Serbian" },
    { "code": "ss", "language": "Swati" },
    { "code": "st", "language": "Sotho" },
    { "code": "su", "language": "Sundanese" },
    { "code": "sv", "language": "Swedish" },
    { "code": "sw", "language": "Swahili" },
    { "code": "ta", "language": "Tamil" },
    { "code": "te", "language": "Telugu" },
    { "code": "tg", "language": "Tajik" },
    { "code": "th", "language": "Thai" },
    { "code": "ti", "language": "Tigrinya" },
    { "code": "tk", "language": "Turkmen" },
    { "code": "tl", "language": "Tagalog" },
    { "code": "tn", "language": "Tswana" },
    { "code": "to", "language": "Tongan" },
    { "code": "tr", "language": "Turkish" },
    { "code": "ts", "language": "Tsonga" },
    { "code": "tt", "language": "Tatar" },
    { "code": "tw", "language": "Twi" },
    { "code": "ug", "language": "Uyghur" },
    { "code": "uk", "language": "Ukrainian" },
    { "code": "ur", "language": "Urdu" },
    { "code": "uz", "language": "Uzbek" },
    { "code": "ve", "language": "Venda" },
    { "code": "vi", "language": "Vietnamese" },
    { "code": "vo", "language": "Volapük" },
    { "code": "wa", "language": "Walloon" },
    { "code": "wo", "language": "Wolof" },
    { "code": "xh", "language": "Xhosa" },
    { "code": "yi", "language": "Yiddish" },
    { "code": "yo", "language": "Yoruba" },
    { "code": "za", "language": "Zhuang" },
    { "code": "zh", "language": "Chinese" },
    { "code": "zu", "language": "Zulu" }
]