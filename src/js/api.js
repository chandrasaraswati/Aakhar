// The base paths for your data and images.
const DATA_PATH = 'assets/data/';
const IMAGE_PATH = 'assets/images/';

// --- NEW ---
// This is now the single source of truth for your categories.
// Just add the JSON filename (without .json) here.
const CATEGORY_IDS = [
  'common_words',
  'common_phrases',
  'relations'
  // To add 'animals.json', just add 'animals' to this list.
  // To add 'food_items.json', just add 'food_items' here.
];

/**
 * Helper function to capitalize the first letter of a string.
 * e.g., "common" -> "Common"
 */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Public Functions (to be exported) ---

/**
 * Fetches the data for a specific category.
 * @param {string} categoryName - The name of the category (e.g., 'common_words').
 * @returns {Promise<Array<Object>>} A promise that resolves to the array of translation objects.
 */
export async function getCategoryData(categoryName) {
  const url = `${DATA_PATH}${categoryName}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok for: ${url}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return [];
  }
}

/**
 * --- MODIFIED ---
 * Gets the list of available categories by transforming the CATEGORY_IDS list.
 * e.g., 'common_words' becomes { id: 'common_words', title: 'Common Words' }
 * @returns {Array<Object>} An array of category objects.
 */
export function getAvailableCategories() {
  return CATEGORY_IDS.map(id => {
    // Transform the ID string into a user-friendly title
    const title = id
      .split('_')              // 'common_words' -> ['common', 'words']
      .map(capitalize)       // ['common', 'words'] -> ['Common', 'Words']
      .join(' ');             // ['Common', 'Words'] -> 'Common Words'
    
    return { id, title };
  });
}

/**
 * A helper function to get the correct image path for a given English term.
 * This implements Characteristic #6.
 * Example: "What is your name?" -> "assets/images/What_is_your_name.jpg"
 * @param {string} englishText - The English text from the JSON data.
 * @returns {string} The full, formatted path to the JPG image.
 */
export function getImagePath(englishText) {
  // Replace all spaces with underscores and append the extension.
  const fileName = englishText.replace(/ /g, '_') + '.jpg';
  return `${IMAGE_PATH}${fileName}`;
}