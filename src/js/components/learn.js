// Import API functions
import { getAvailableCategories, getCategoryData, getImagePath, shuffle } from '../api.js';

// Configuration: Set to false to hide images, true to show them
const SHOW_IMAGES = false;
const COMMON_WORDS_CATEGORY_ID = 'common_words';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Module-level variables to hold the state
let mainContainer = null;
let categoryData = [];
let allCategoryData = [];
let currentIndex = 0;
let currentCategoryId = '';
let selectedLetter = 'A';
let letterRibbonResizeHandler = null;

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
  if (letterRibbonResizeHandler) {
    window.removeEventListener('resize', letterRibbonResizeHandler);
    letterRibbonResizeHandler = null;
  }

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
  currentCategoryId = categoryId;
  allCategoryData = await getCategoryData(categoryId);
  currentIndex = 0;

  if (letterRibbonResizeHandler) {
    window.removeEventListener('resize', letterRibbonResizeHandler);
    letterRibbonResizeHandler = null;
  }
  
  if (!allCategoryData || allCategoryData.length === 0) {
    mainContainer.innerHTML = '<div class="card"><p>Could not load data for this category.</p></div>';
    return;
  }

  if (isCommonWordsCategory()) {
    const availableLetters = getAvailableCommonWordLetters();
    selectedLetter = availableLetters[0] || 'A';
    applyCommonWordsFilter(selectedLetter);
  } else {
    categoryData = [...allCategoryData];
  }
  
  // Once data is loaded, render the main flashcard UI
  renderFlashcardView();
}

/**
 * Renders the main flashcard UI shell (buttons, containers).
 */
function renderFlashcardView() {
  const letterFilterHtml = isCommonWordsCategory() ? `
      <div class="alphabet-ribbon-wrapper">
        <div class="alphabet-fade-overlay alphabet-fade-left" id="alphabet-fade-left"></div>
        <div class="alphabet-fade-overlay alphabet-fade-right" id="alphabet-fade-right"></div>
        <button class="alphabet-nav-arrow alphabet-nav-prev" id="alphabet-prev-btn" aria-label="Scroll letters left">&lsaquo;</button>
        <button class="alphabet-nav-arrow alphabet-nav-next" id="alphabet-next-btn" aria-label="Scroll letters right">&rsaquo;</button>
        <div class="alphabet-scroll" id="alphabet-scroll"></div>
      </div>
` : '';

  const viewHtml = `
    <div class="flashcard-view">
      
      <div class="flashcard-nav">
        <div class="nav-controls-left">
          <button class="btn" id="learn-back-btn">&larr;</button>
          <button class="btn btn-icon" id="shuffle-btn" title="Shuffle Deck">🔀</button>
        </div>
        <span id="progress-indicator" class="progress"></span>
      </div>

      ${letterFilterHtml}
      
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
  
  if (isCommonWordsCategory()) {
    initCommonWordsLetterSelector();
  }

  // Show the first card
  showCurrentCard();
}

/**
 * Returns true if the currently loaded category is "Common Words".
 * @returns {boolean}
 */
function isCommonWordsCategory() {
  return currentCategoryId === COMMON_WORDS_CATEGORY_ID;
}

/**
 * Gets the starting English letter for a data item.
 * @param {Object} item
 * @returns {string}
 */
function getEnglishStartingLetter(item) {
  const englishText = (item?.English || '').trim();
  const match = englishText.match(/^[^A-Za-z]*([A-Za-z])/);
  return match ? match[1].toUpperCase() : '';
}

/**
 * Gets all letters that have at least one matching word in Common Words.
 * @returns {string[]}
 */
function getAvailableCommonWordLetters() {
  const letters = new Set();
  allCategoryData.forEach(item => {
    const letter = getEnglishStartingLetter(item);
    if (letter) {
      letters.add(letter);
    }
  });

  return ALPHABET.filter(letter => letters.has(letter));
}

/**
 * Applies the selected-letter filter for the Common Words category.
 * @param {string} letter
 */
function applyCommonWordsFilter(letter) {
  selectedLetter = letter;
  categoryData = allCategoryData.filter(item => getEnglishStartingLetter(item) === letter);
  currentIndex = 0;
}

/**
 * Renders and wires the alphabet ribbon used for Common Words filtering.
 */
function initCommonWordsLetterSelector() {
  const scrollContainer = document.getElementById('alphabet-scroll');
  const prevBtn = document.getElementById('alphabet-prev-btn');
  const nextBtn = document.getElementById('alphabet-next-btn');
  const fadeLeft = document.getElementById('alphabet-fade-left');
  const fadeRight = document.getElementById('alphabet-fade-right');

  if (!scrollContainer || !prevBtn || !nextBtn || !fadeLeft || !fadeRight) {
    return;
  }

  ALPHABET.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-filter-btn';
    btn.textContent = letter;
    btn.type = 'button';
    if (letter === selectedLetter) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      if (selectedLetter === letter) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        return;
      }

      scrollContainer.querySelectorAll('.letter-filter-btn').forEach(node => {
        node.classList.remove('active');
      });
      btn.classList.add('active');
      applyCommonWordsFilter(letter);
      showCurrentCard();

      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    scrollContainer.appendChild(btn);
  });

  prevBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
  });

  const updateRibbonIndicators = () => {
    const isAtStart = scrollContainer.scrollLeft <= 1;
    const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

    prevBtn.classList.toggle('hidden', isAtStart);
    nextBtn.classList.toggle('hidden', isAtEnd);
    fadeLeft.style.opacity = isAtStart ? '0' : '1';
    fadeRight.style.opacity = isAtEnd ? '0' : '1';
  };

  scrollContainer.addEventListener('scroll', updateRibbonIndicators);
  letterRibbonResizeHandler = updateRibbonIndicators;
  window.addEventListener('resize', letterRibbonResizeHandler);
  updateRibbonIndicators();

  const activeButton = scrollContainer.querySelector('.letter-filter-btn.active');
  if (activeButton) {
    activeButton.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }
}

/**
 * Updates the flashcard content to show the card at `currentIndex`.
 */
function showCurrentCard() {
  // Get elements to update
  const imgEl = document.getElementById('flashcard-img');
  const translationsEl = document.getElementById('flashcard-translations');
  const progressEl = document.getElementById('progress-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');

  if (!translationsEl || !progressEl || !prevBtn || !nextBtn || !shuffleBtn) {
    return;
  }

  if (!categoryData.length) {
    if (SHOW_IMAGES && imgEl) {
      imgEl.src = '';
      imgEl.alt = 'No image available';
    }

    translationsEl.innerHTML = `
      <div class="empty-letter-state">
        <p>No words found for <strong>${selectedLetter}</strong>. Choose another letter.</p>
      </div>
    `;
    progressEl.textContent = 'Card 0 of 0';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    shuffleBtn.disabled = true;
    return;
  }

  const item = categoryData[currentIndex];

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
  shuffleBtn.disabled = (categoryData.length <= 1);
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
  if (!categoryData.length) {
    return;
  }
  categoryData = shuffle(categoryData);
  currentIndex = 0;
  showCurrentCard();
}
