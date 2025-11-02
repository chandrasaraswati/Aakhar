// Import API functions
import { getAvailableCategories, getCategoryData, shuffle } from '../api.js';

// Module-level variable to hold the main container
let mainContainer = null;
let recallData = [];

/**
 * Renders the "Recall" page.
 * This is the main entry point called by the router.
 * @param {HTMLElement} mainContentElement - The <main> element.
 */
export function renderRecallPage(mainContentElement) {
  mainContainer = mainContentElement;
  renderCategorySelector();
}

/**
 * Renders the UI for selecting a category.
 * (This is very similar to the one in learn.js)
 */
async function renderCategorySelector() {
  const categories = await getAvailableCategories();
  
  let categoryHtml = `
    <div class="card">
      <h2>Recall</h2>
      <p>Please select a category to test your memory.</p>
    </div>
    <div class="category-selector-grid">
  `;
  
  for (const category of categories) {
    categoryHtml += `
      <div class="category-card" data-id="${category.id}">
        <h3>${category.title}</h3>
      </div>
    `;
  }
  
  categoryHtml += '</div>';
  mainContainer.innerHTML = categoryHtml;
  
  // Add click listeners
  mainContainer.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const categoryId = e.currentTarget.dataset.id;
      loadCategory(categoryId); // Call this file's loadCategory
    });
  });
}

/**
 * Fetches data and renders the recall list view.
 * @param {string} categoryId - The ID of the category to load.
 */
async function loadCategory(categoryId) {
  mainContainer.innerHTML = '<div class="card"><p>Loading category...</p></div>';
  
  recallData = await getCategoryData(categoryId);
  
  if (!recallData || recallData.length === 0) {
    mainContainer.innerHTML = '<div class="card"><p>Could not load data for this category.</p></div>';
    return;
  }
  
  // Render the main recall view
  renderRecallView(recallData);
}

/**
 * Renders the list of tap-to-reveal cards.
 * @param {Array<Object>} data - The array of translation items.
 */
function renderRecallView(data) {
  const viewHtml = `
    <div class="recall-view">
      
      <div class="recall-nav">
        <button class="btn" id="recall-back-btn">&larr;</button>
        <button class="btn btn-icon" id="shuffle-btn" title="Shuffle List">🔀</button>
      </div>
      
      <div class="recall-grid">
        ${data.map(item => `
          <div class="card recall-card" tabindex="0">
          </div>
        `).join('')}
      </div>
      
    </div>
  `;
  
  mainContainer.innerHTML = viewHtml;
  
  // Add event listener for the "Back" button
  document.getElementById('recall-back-btn').addEventListener('click', renderCategorySelector);
  document.getElementById('shuffle-btn').addEventListener('click', shuffleRecallList);

  // Add event listeners for each recall card
  mainContainer.querySelectorAll('.recall-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle the 'is-revealed' class on the card
      e.currentTarget.classList.toggle('is-revealed');
    });
    // Add keypress listener for accessibility (Enter or Space)
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.currentTarget.classList.toggle('is-revealed');
      }
    });
  });
}

/**
 * Shuffles the recall list and re-renders it.
 */
function shuffleRecallList() {
  recallData = shuffle(recallData);
  renderRecallView(recallData); // Re-render the view with shuffled data
}