// Import the functions that will build and render each "page"
// We'll create these files next (e.g., in src/js/components/)
import { renderAboutPage } from './components/about.js';
import { renderUttarakhandPage } from './components/uttarakhand.js';
import { renderLearnPage } from './components/learn.js';
import { renderQuizPage } from './components/quiz.js';

/**
 * A simple mapping of URL hash routes to their corresponding render functions.
 */
const routes = {
  '#about': renderAboutPage,
  '#uttarakhand': renderUttarakhandPage,
  '#learn': renderLearnPage,
  '#quiz': renderQuizPage,
};

/**
 * The main content container element from index.html.
 * We will inject all page content into this element.
 */
const mainContentElement = document.getElementById('app-content');

/**
 * The core router function.
 * It parses the current URL hash and calls the correct render function.
 */
function handleRouteChange() {
  // Get the current hash from the URL (e.g., "#learn")
  // If no hash exists, default to "#about"
  const hash = window.location.hash || '#about';

  // Find the render function corresponding to the current hash.
  // If the hash is not in our routes, default to the 'About' page function.
  const renderFunction = routes[hash] || routes['#about'];

  // Clear the existing content from the main container
  mainContentElement.innerHTML = '';

  // Call the selected render function, passing it the container to fill.
  try {
    renderFunction(mainContentElement);
  } catch (error) {
    console.error(`Error rendering route ${hash}:`, error);
    mainContentElement.innerHTML = `<p class="error">Error: Could not load page. Please try again.</p>`;
  }

  // Bonus: Highlight the active navigation link
  updateActiveNav(hash);
}

/**
 * Helper function to update the visual state of the main navigation links.
 * @param {string} activeHash - The currently active route hash (e.g., "#learn")
 */
function updateActiveNav(activeHash) {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    if (link.hash === activeHash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initializes the router by setting up event listeners.
 * This is the only function that needs to be exported.
 */
export function initRouter() {
  // Listen for changes to the URL hash
  window.addEventListener('hashchange', handleRouteChange);
  
  // Handle the initial page load
  window.addEventListener('load', handleRouteChange);
}