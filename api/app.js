//https://github.com/facundoolano/google-play-scraper?tab=readme-ov-file#reviews

import gplay from 'google-play-scraper';
import path from 'path';
import fs from 'fs';

// Define the endpoint
export default async (req, res) => {
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
            return res.json(reviews.data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch reviews' });
        }

    }

   /* const filePath = 'languages.json';// path.join(__dirname, 'api', 'languages.json');
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
};

const languages = [
  {"code": "aa", "language": "Afar"},
  {"code": "ab", "language": "Abkhazian"},
  {"code": "af", "language": "Afrikaans"},
  {"code": "ak", "language": "Akan"},
  {"code": "am", "language": "Amharic"},
  {"code": "ar", "language": "Arabic"},
  {"code": "as", "language": "Assamese"},
  {"code": "ay", "language": "Aymara"},
  {"code": "az", "language": "Azerbaijani"},
  {"code": "ba", "language": "Bashkir"},
  {"code": "be", "language": "Belarusian"},
  {"code": "bg", "language": "Bulgarian"},
  {"code": "bh", "language": "Bihari"},
  {"code": "bi", "language": "Bislama"},
  {"code": "bn", "language": "Bengali"},
  {"code": "bo", "language": "Tibetan"},
  {"code": "br", "language": "Breton"},
  {"code": "bs", "language": "Bosnian"},
  {"code": "ca", "language": "Catalan"},
  {"code": "ce", "language": "Chechen"},
  {"code": "co", "language": "Corsican"},
  {"code": "cs", "language": "Czech"},
  {"code": "cy", "language": "Welsh"},
  {"code": "da", "language": "Danish"},
  {"code": "de", "language": "German"},
  {"code": "dz", "language": "Dzongkha"},
  {"code": "el", "language": "Greek"},
  {"code": "en", "language": "English"},
  {"code": "eo", "language": "Esperanto"},
  {"code": "es", "language": "Spanish"},
  {"code": "et", "language": "Estonian"},
  {"code": "eu", "language": "Basque"},
  {"code": "fa", "language": "Persian"},
  {"code": "fi", "language": "Finnish"},
  {"code": "fj", "language": "Fijian"},
  {"code": "fo", "language": "Faroese"},
  {"code": "fr", "language": "French"},
  {"code": "fy", "language": "Frisian"},
  {"code": "ga", "language": "Irish"},
  {"code": "gd", "language": "Scottish Gaelic"},
  {"code": "gl", "language": "Galician"},
  {"code": "gn", "language": "Guarani"},
  {"code": "gu", "language": "Gujarati"},
  {"code": "ha", "language": "Hausa"},
  {"code": "he", "language": "Hebrew"},
  {"code": "hi", "language": "Hindi"},
  {"code": "hr", "language": "Croatian"},
  {"code": "hu", "language": "Hungarian"},
  {"code": "hy", "language": "Armenian"},
  {"code": "ia", "language": "Interlingua"},
  {"code": "id", "language": "Indonesian"},
  {"code": "ie", "language": "Interlingue"},
  {"code": "ik", "language": "Inupiaq"},
  {"code": "is", "language": "Icelandic"},
  {"code": "it", "language": "Italian"},
  {"code": "iu", "language": "Inuktitut"},
  {"code": "ja", "language": "Japanese"},
  {"code": "jv", "language": "Javanese"},
  {"code": "ka", "language": "Georgian"},
  {"code": "kk", "language": "Kazakh"},
  {"code": "kl", "language": "Greenlandic"},
  {"code": "km", "language": "Khmer"},
  {"code": "kn", "language": "Kannada"},
  {"code": "ko", "language": "Korean"},
  {"code": "ks", "language": "Kashmiri"},
  {"code": "ku", "language": "Kurdish"},
  {"code": "ky", "language": "Kyrgyz"},
  {"code": "la", "language": "Latin"},
  {"code": "lb", "language": "Luxembourgish"},
  {"code": "lg", "language": "Ganda"},
  {"code": "li", "language": "Limburgish"},
  {"code": "ln", "language": "Lingala"},
  {"code": "lo", "language": "Lao"},
  {"code": "lt", "language": "Lithuanian"},
  {"code": "lu", "language": "Luba-Katanga"},
  {"code": "lv", "language": "Latvian"},
  {"code": "mg", "language": "Malagasy"},
  {"code": "mh", "language": "Marshallese"},
  {"code": "mi", "language": "Maori"},
  {"code": "mk", "language": "Macedonian"},
  {"code": "ml", "language": "Malayalam"},
  {"code": "mn", "language": "Mongolian"},
  {"code": "mr", "language": "Marathi"},
  {"code": "ms", "language": "Malay"},
  {"code": "mt", "language": "Maltese"},
  {"code": "my", "language": "Burmese"},
  {"code": "na", "language": "Nauru"},
  {"code": "ne", "language": "Nepali"},
  {"code": "nl", "language": "Dutch"},
  {"code": "no", "language": "Norwegian"},
  {"code": "oc", "language": "Occitan"},
  {"code": "om", "language": "Oromo"},
  {"code": "or", "language": "Odia"},
  {"code": "pa", "language": "Punjabi"},
  {"code": "pl", "language": "Polish"},
  {"code": "ps", "language": "Pashto"},
  {"code": "pt", "language": "Portuguese"},
  {"code": "qu", "language": "Quechua"},
  {"code": "rm", "language": "Romansh"},
  {"code": "rn", "language": "Rundi"},
  {"code": "ro", "language": "Romanian"},
  {"code": "ru", "language": "Russian"},
  {"code": "rw", "language": "Kinyarwanda"},
  {"code": "sa", "language": "Sanskrit"},
  {"code": "sc", "language": "Sardinian"},
  {"code": "sd", "language": "Sindhi"},
  {"code": "se", "language": "Northern Sami"},
  {"code": "sg", "language": "Sango"},
  {"code": "si", "language": "Sinhala"},
  {"code": "sk", "language": "Slovak"},
  {"code": "sl", "language": "Slovenian"},
  {"code": "sm", "language": "Samoan"},
  {"code": "sn", "language": "Shona"},
  {"code": "so", "language": "Somali"},
  {"code": "sq", "language": "Albanian"},
  {"code": "sr", "language": "Serbian"},
  {"code": "ss", "language": "Swati"},
  {"code": "st", "language": "Sotho"},
  {"code": "su", "language": "Sundanese"},
  {"code": "sv", "language": "Swedish"},
  {"code": "sw", "language": "Swahili"},
  {"code": "ta", "language": "Tamil"},
  {"code": "te", "language": "Telugu"},
  {"code": "tg", "language": "Tajik"},
  {"code": "th", "language": "Thai"},
  {"code": "ti", "language": "Tigrinya"},
  {"code": "tk", "language": "Turkmen"},
  {"code": "tl", "language": "Tagalog"},
  {"code": "tn", "language": "Tswana"},
  {"code": "to", "language": "Tongan"},
  {"code": "tr", "language": "Turkish"},
  {"code": "ts", "language": "Tsonga"},
  {"code": "tt", "language": "Tatar"},
  {"code": "tw", "language": "Twi"},
  {"code": "ug", "language": "Uyghur"},
  {"code": "uk", "language": "Ukrainian"},
  {"code": "ur", "language": "Urdu"},
  {"code": "uz", "language": "Uzbek"},
  {"code": "ve", "language": "Venda"},
  {"code": "vi", "language": "Vietnamese"},
  {"code": "vo", "language": "Volapük"},
  {"code": "wa", "language": "Walloon"},
  {"code": "wo", "language": "Wolof"},
  {"code": "xh", "language": "Xhosa"},
  {"code": "yi", "language": "Yiddish"},
  {"code": "yo", "language": "Yoruba"},
  {"code": "za", "language": "Zhuang"},
  {"code": "zh", "language": "Chinese"},
  {"code": "zu", "language": "Zulu"}
]

