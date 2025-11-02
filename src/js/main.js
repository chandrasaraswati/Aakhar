// Import the router's initialization function
import { initRouter } from './router.js';

// --- PWA Install Prompt Logic ---

let deferredPrompt; // This variable will hold the install event
const installButton = document.getElementById('btn-install'); // Get the install button

/**
 * 1. Listen for the browser's 'beforeinstallprompt' event.
 * This event fires if the app is installable.
 */
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Store the event so it can be triggered later.
  deferredPrompt = e;
  
  // Show our custom 'Add to Home Screen' button.
  // We find the button *after* the router has rendered the 'About' page.
  // A more robust way is to use a CSS class on <body> to show/hide.
  console.log('`beforeinstallprompt` event fired. App is installable.');
  
  // A better pattern: We can tell the UI (e.g., about.js) that install is available.
  // For now, let's assume the button will be found when the page renders.
  // The logic in about.js will handle the click.
});

/**
 * 2. Export a function that the 'About' page button can call.
 * This function will trigger the stored prompt.
 */
export function triggerInstallPrompt() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the Aakhar install prompt');
        // Optionally, hide the 'Add to Home Screen' button
      } else {
        console.log('User dismissed the Aakhar install prompt');
      }
      // We can only use the prompt once. Clear it.
      deferredPrompt = null;
    });
  } else {
    console.log('Install prompt not available (already installed or not supported).');
    alert('This app is either already installed or your browser does not support this feature.');
  }
}

// --- End of PWA Logic ---

// --- ** Mobile Navigation Toggle Logic ** ---
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('main-nav-menu');

  if (hamburgerBtn && navMenu) {
    // 1. Toggle menu on hamburger click
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });

    // 2. (Good UX) Close menu when a nav link is clicked
    navMenu.addEventListener('click', (e) => {
      // Check if the clicked element is a link
      if (e.target.tagName === 'A') {
        navMenu.classList.remove('is-open');
      }
    });
  }
}

// ** CALL THE NEW FUNCTION **
initMobileNav();

// --- End of Mobile Nav Logic ---

// 3. Start the application by initializing the router
initRouter();