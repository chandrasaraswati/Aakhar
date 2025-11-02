// The base paths for your data and images.
const DATA_PATH = 'assets/data/';
const IMAGE_PATH = 'assets/images/';

// This will store the category list after we fetch it
let categoryCache = null;

/**
 * Helper: Fetches the list of category IDs from our manifest file.
 * Caches the result so we only fetch it once.
 */
async function fetchCategoryIds() {
  if (categoryCache) {
    return categoryCache; // Return from cache if available
  }
  
  try {
    const response = await fetch(`${DATA_PATH}_categories.json`);
    if (!response.ok) {
      throw new Error('Failed to load category manifest');
    }
    const data = await response.json();
    categoryCache = data; // Store in cache
    return data;
  } catch (error) {
    console.error('Error fetching category list:', error);
    return []; // Return empty on error
  }
}

/**
 * Shuffles an array in place.
 * (Fisher-Yates Algorithm)
 * @param {Array<any>} array The array to shuffle.
 * @returns {Array<any>} The shuffled array.
 */
export function shuffle(array) {
  let a = [...array]; // Create a copy
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
export async function getAvailableCategories() {
  // 1. Await the list of IDs from our new function
  const categoryIds = await fetchCategoryIds();
  
  // 2. Transform the IDs into titles (same logic as before)
  return categoryIds.map(id => {
    const title = id
      .split('_')
      .map(capitalize)
      .join(' ');
    
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
  const fileName = englishText
    .replaceAll(" ", '_')    // First, replace all spaces with underscores
    .replaceAll("?", '_')    // Then, remove all question marks
    .replaceAll("'", '_')    // Then, remove all ' marks
      + '.png';
  return `${IMAGE_PATH}${fileName}`;
}