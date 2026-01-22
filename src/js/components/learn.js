// Import API functions
import { getAvailableCategories, getCategoryData, getImagePath, shuffle } from '../api.js';

// Configuration: Set to false to hide images, true to show them
const SHOW_IMAGES = false;

// Module-level variables to hold the state
let mainContainer = null;
let categoryData = [];
let currentIndex = 0;

/**
 * Renders the "Learn" page.
 * This is the main entry point called by the router.
 * @param {HTMLElement} mainContentElement - The <main> element.
 */
export function renderLearnPage(mainContentElement) {
  // Store the main container so other functions can use it
  mainContainer = mainContentElement;
  
  // Start by showing the category selection screen
  renderCategorySelector();
}

/**
 * Renders the UI for selecting a learning category.
 */
async function renderCategorySelector() {
  const categories = await getAvailableCategories();
  
  let categoryHtml = `
    <div class="card">
      <h2>Learn</h2>
      <p>Please select a category to start learning.</p>
    </div>
    <div class="category-selector-grid">
  `;
  
  // Create a card for each available category
  for (const category of categories) {
    categoryHtml += `
      <div class="category-card" data-id="${category.id}">
        <h3>${category.title}</h3>
      </div>
    `;
  }
  
  categoryHtml += '</div>';
  mainContainer.innerHTML = categoryHtml;
  
  // Add click listeners to the new category cards
  mainContainer.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Get the category ID we stored in the 'data-id' attribute
      const categoryId = e.currentTarget.dataset.id;
      loadCategory(categoryId);
    });
  });
}

/**
 * Fetches data for the selected category and renders the flashcard view.
 * @param {string} categoryId - The ID of the category to load (e.g., 'common_words').
 */
async function loadCategory(categoryId) {
  // Show a loading state
  mainContainer.innerHTML = '<div class="card"><p>Loading category...</p></div>';
  
  // Fetch the data
  categoryData = await getCategoryData(categoryId);
  currentIndex = 0;
  
  if (!categoryData || categoryData.length === 0) {
    mainContainer.innerHTML = '<div class="card"><p>Could not load data for this category.</p></div>';
    return;
  }
  
  // Once data is loaded, render the main flashcard UI
  renderFlashcardView();
}

/**
 * Renders the main flashcard UI shell (buttons, containers).
 */
function renderFlashcardView() {
const viewHtml = `
    <div class="flashcard-view">
      
      <div class="flashcard-nav">
        <div class="nav-controls-left">
          <button class="btn" id="learn-back-btn">&larr;</button>
          <button class="btn btn-icon" id="shuffle-btn" title="Shuffle Deck">🔀</button>
        </div>
        <span id="progress-indicator" class="progress"></span>
      </div>
      
      <div class="card flashcard-content-wrapper">
        <img id="flashcard-img" src="" alt="Learning Image" class="flashcard-img" 
             style="${SHOW_IMAGES ? '' : 'display: none;'}">
        <div id="flashcard-translations"></div>
      </div>

      <div class="flashcard-controls">
        <button class="btn" id="prev-btn">&larr; Previous</button>
        <button class="btn" id="next-btn">Next &rarr;</button>
      </div>
      
    </div>
    `;
  
  mainContainer.innerHTML = viewHtml;
  
  // Add event listeners for the new buttons
  document.getElementById('learn-back-btn').addEventListener('click', renderCategorySelector);
  document.getElementById('prev-btn').addEventListener('click', () => navigateCard(-1));
  document.getElementById('next-btn').addEventListener('click', () => navigateCard(1));
  document.getElementById('shuffle-btn').addEventListener('click', shuffleDeck);

  // Show the first card
  showCurrentCard();
}

/**
 * Updates the flashcard content to show the card at `currentIndex`.
 */
function showCurrentCard() {
  const item = categoryData[currentIndex];
  
  // Get elements to update
  const imgEl = document.getElementById('flashcard-img');
  const translationsEl = document.getElementById('flashcard-translations');
  const progressEl = document.getElementById('progress-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Only update and load the image if SHOW_IMAGES is true
  if (SHOW_IMAGES && imgEl) {
    imgEl.src = getImagePath(item.English);
    imgEl.alt = item.English;
  }
  
  // Check for special "Number" or "Letter" keys
  let specialRowHtml = '';
  if (item.Number) {
    specialRowHtml = `
      <tr class="special-row">
        <td>Number</td>
        <td>${item.Number}</td>
      </tr>
    `;
  } else if (item.Letter) {
    specialRowHtml = `
      <tr class="special-row">
        <td>Letter</td>
        <td>${item.Letter}</td>
      </tr>
    `;
  }

  // Update Translations
  // We will inject the specialRowHtml at the top of the table
  translationsEl.innerHTML = `
    <table class="translations-table">
      <tbody>
        ${specialRowHtml} <tr>
          <td>English</td>
          <td>${item.English}</td>
        </tr>
        <tr>
          <td>Hindi</td>
          <td>${item.Hindi || 'N/A'}</td>
        </tr>
        <tr>
          <td>Garhwali</td>
          <td>${item.Garhwali || 'N/A'}</td>
        </tr>
        <tr>
          <td>Kumaoni</td>
          <td>${item.Kumaoni || 'N/A'}</td>
        </tr>
        <tr>
          <td>Jaunsari</td>
          <td>${item.Jaunsari || 'N/A'}</td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Update Progress
  progressEl.textContent = `Card ${currentIndex + 1} of ${categoryData.length}`;
  
  // Update Button States
  prevBtn.disabled = (currentIndex === 0);
  nextBtn.disabled = (currentIndex === categoryData.length - 1);
}

/**
 * Moves the card index forward or backward.
 * @param {number} direction - 1 for next, -1 for previous.
 */
function navigateCard(direction) {
  const newIndex = currentIndex + direction;
  
  // Check bounds
  if (newIndex >= 0 && newIndex < categoryData.length) {
    currentIndex = newIndex;
    showCurrentCard();
  }
}

/**
 * Shuffles the deck and returns to the first card.
 */
function shuffleDeck() {
  categoryData = shuffle(categoryData);
  currentIndex = 0;
  showCurrentCard();
}
