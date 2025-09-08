/**
 * Country to Languages Mapping Configuration
 * Each country maps to its 10 most likely used languages
 */

export const countryLanguagesMap: { [key: string]: string[] } = {
  // North America
  'US': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'CA': ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'MX': ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  
  // South America
  'BR': ['pt', 'es', 'en', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'AR': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'CL': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'CO': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'PE': ['es', 'qu', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko'],
  'VE': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'EC': ['es', 'qu', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko'],
  'UY': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'PY': ['es', 'gn', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko'],
  'BO': ['es', 'qu', 'ay', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja'],
  
  // Europe
  'GB': ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'DE': ['de', 'en', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'FR': ['fr', 'en', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'ES': ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'IT': ['it', 'en', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'PT': ['pt', 'en', 'es', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
  'NL': ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'BE': ['nl', 'fr', 'de', 'en', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'CH': ['de', 'fr', 'it', 'en', 'es', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'AT': ['de', 'en', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  'SE': ['sv', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'NO': ['no', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'DK': ['da', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'FI': ['fi', 'en', 'sv', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja'],
  'PL': ['pl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'CZ': ['cs', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'HU': ['hu', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'RO': ['ro', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'BG': ['bg', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'HR': ['hr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'RS': ['sr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'SI': ['sl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'SK': ['sk', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'LT': ['lt', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'LV': ['lv', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'EE': ['et', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'IE': ['en', 'ga', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'IS': ['is', 'en', 'da', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja'],
  'LU': ['lb', 'fr', 'de', 'en', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
  'MT': ['mt', 'en', 'it', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'ko'],
  'CY': ['el', 'en', 'tr', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja'],
  
  // Asia
  'CN': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'JP': ['ja', 'en', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'KR': ['ko', 'en', 'ja', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'IN': ['hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'],
  'ID': ['id', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'TH': ['th', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'VN': ['vi', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'PH': ['tl', 'en', 'es', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'it'],
  'MY': ['ms', 'en', 'zh', 'ta', 'ja', 'ko', 'ru', 'fr', 'de', 'es'],
  'SG': ['en', 'zh', 'ms', 'ta', 'ja', 'ko', 'ru', 'fr', 'de', 'es'],
  'TW': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'HK': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'MO': ['zh', 'pt', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it'],
  'BD': ['bn', 'en', 'hi', 'ur', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'PK': ['ur', 'en', 'hi', 'bn', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'LK': ['si', 'ta', 'en', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'MM': ['my', 'en', 'th', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'KH': ['km', 'en', 'th', 'vi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'LA': ['lo', 'en', 'th', 'vi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'MN': ['mn', 'en', 'ru', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'KZ': ['kk', 'ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'UZ': ['uz', 'ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'KG': ['ky', 'ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'TJ': ['tg', 'ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'TM': ['tk', 'ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'AF': ['fa', 'ps', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr'],
  'IR': ['fa', 'en', 'ar', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr'],
  'IQ': ['ar', 'ku', 'en', 'fa', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr'],
  'SA': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'AE': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'QA': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'KW': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'BH': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'OM': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'YE': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'JO': ['ar', 'en', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'LB': ['ar', 'en', 'fr', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'de'],
  'SY': ['ar', 'en', 'ku', 'ur', 'hi', 'ja', 'ko', 'zh', 'ru', 'fr'],
  'IL': ['he', 'ar', 'en', 'ru', 'ja', 'ko', 'zh', 'fr', 'de', 'es'],
  'TR': ['tr', 'en', 'ku', 'ar', 'ru', 'ja', 'ko', 'zh', 'fr', 'de'],
  'GE': ['ka', 'en', 'ru', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'AM': ['hy', 'en', 'ru', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  'AZ': ['az', 'en', 'ru', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it'],
  
  // Africa
  'ZA': ['en', 'af', 'zu', 'xh', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'NG': ['en', 'ha', 'yo', 'ig', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
  'EG': ['ar', 'en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'KE': ['en', 'sw', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'GH': ['en', 'ak', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'ET': ['am', 'en', 'om', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'TZ': ['sw', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'UG': ['en', 'sw', 'lg', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'DZ': ['ar', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'MA': ['ar', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'TN': ['ar', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'LY': ['ar', 'en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'SD': ['ar', 'en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'ZW': ['en', 'sn', 'nd', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'ZM': ['en', 'bem', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'BW': ['en', 'tn', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'NA': ['en', 'af', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'MW': ['en', 'ny', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'MZ': ['pt', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'AO': ['pt', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'MG': ['mg', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'MU': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'SC': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'RW': ['rw', 'en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'BI': ['rn', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'DJ': ['fr', 'ar', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'SO': ['so', 'ar', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'ER': ['ti', 'ar', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es'],
  'SS': ['en', 'ar', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'CF': ['fr', 'sg', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'TD': ['fr', 'ar', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'CM': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'NE': ['fr', 'ha', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'BF': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'ML': ['fr', 'bm', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'SN': ['fr', 'wo', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
  'GM': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'GN': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'SL': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'LR': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'CI': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'CV': ['pt', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'ST': ['pt', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'GQ': ['es', 'fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'it', 'pt'],
  
  // Oceania
  'AU': ['en', 'zh', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'NZ': ['en', 'mi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'FJ': ['en', 'fj', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'PG': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'SB': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'VU': ['en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'NC': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'PF': ['fr', 'en', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it', 'pt'],
  'WS': ['en', 'sm', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'TO': ['en', 'to', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'KI': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'TV': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'NR': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'MH': ['en', 'mh', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'FM': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'PW': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'CK': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'NU': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'TK': ['en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
  'AS': ['en', 'sm', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'GU': ['en', 'ch', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'MP': ['en', 'ch', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
  'VI': ['en', 'es', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'it', 'pt'],
  'PR': ['es', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'it', 'pt'],
  
  // Default fallback for any country not in the map
  'DEFAULT': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
};

/**
 * Get the 10 most likely languages for a given country
 * @param country - ISO 3166-1 alpha-2 country code
 * @returns Array of 10 language codes
 */
export function getCountryLanguages(country: string): string[] {
  const upperCountry = country.toUpperCase();
  const languages = countryLanguagesMap[upperCountry];
  if (languages) {
    return languages;
  }
  // Return DEFAULT languages (guaranteed to exist)
  return ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
}

/**
 * Get all supported countries
 * @returns Array of country codes
 */
export function getSupportedCountries(): string[] {
  return Object.keys(countryLanguagesMap).filter(country => country !== 'DEFAULT');
}
