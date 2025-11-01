// We import the function that will let us trigger the install prompt
import { triggerInstallPrompt } from '../main.js';

/**
 * Renders the "About" page content into the main container.
 * @param {HTMLElement} mainContentElement - The <main> element to inject content into.
 */
export function renderAboutPage(mainContentElement) {
  // 1. Define the HTML content for the 'About' page
  const aboutHtml = `
    <div class="about-container">
      <div class="card">
        <h2>About Aakhar</h2>
        <p>
          Aakhar is a community-driven project aimed at preserving and promoting the local languages
          of Uttarakhand: <strong>Garhwali, Kumaoni, and Jaunsari</strong>.
        </p>
        <p>
          As the usage of these beautiful languages declines, this app serves as a simple,
          accessible tool for anyone looking to learn the basic words, phrases, and relations.
        </p>
      </div>

      <div class="card">
        <h2>Uttarakhand</h2>
        <p>A map and brief info about the state can go here.</p>
        </div>

      <div class="card">
        <h2>Add to Your Home Screen</h2>
        <p>
          Install this app on your phone or computer for easy, offline access.
          It works just like a native app!
        </p>
        <button class="btn" id="btn-install">Add to Home Screen</button>
      </div>

      <div class="card">
        <h2>Acknowledgements</h2>
        <p>This project was made possible by the dedicated individuals below:</p>
        
        <div class="team-grid">
          
          <div class="team-member">
            <img class="team-member-img" src="assets/team/Col_Dev_Dimri.jpg" alt="Col. Dev Dimri">
            <h3>Col. Dev Dimri</h3>
            <p>Project Lead</p>
          </div>

          <div class="team-member">
            <img class="team-member-img" src="assets/team/Saraswati_Prithvi.jpg" alt="Saraswati & Prithvi">
            <h3>Saraswati & Prithvi</h3>
            <p>Developers</p>
          </div>

          <div class="team-member">
            <img class="team-member-img" src="assets/team/TBD.jpg" alt="TBD">
            <h3>TBD</h3>
            <p>TBD role</p>
          </div>

          </div>
      </div>
      <div class="card">
        <h2>Feedback</h2>
        <p>
          This app is for the community. If you have feedback, suggestions, or would like to
          contribute, please contact us at: <strong>p(at)earthlord.io</strong>.
        </p>
      </div>
    </div>
  `;

  // 2. Inject the HTML into the main content area
  mainContentElement.innerHTML = aboutHtml;

  // 3. Add Event Listeners
  const installButton = document.getElementById('btn-install');
  
  // This check is important. We only add the listener if the button exists.
  // The button's visibility will be controlled by main.js.
  if (installButton) {
    installButton.addEventListener('click', () => {
      // Call the globally managed trigger function from main.js
      triggerInstallPrompt();
    });
  }
}
