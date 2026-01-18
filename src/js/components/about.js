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
      
      <div id="add-to-home-card">
        <button class="btn" id="btn-install">Add to Home Screen</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Motivation | उद्देश्य</h2>
        </div>
        <div class="card-content">
          <div class="translation-grid">
            <div class="lang-col"> <p>
                Aakhar is a community-driven project aimed at preserving and promoting the local languages
                of Uttarakhand: <strong>Garhwali, Kumaoni and Jaunsari</strong>.
              </p>
              <p>
                As the usage of these beautiful languages declines, this app serves as a simple,
                accessible tool for anyone looking to learn and practice commonly used words and phrases.
              </p>
            </div>
            <div class="lang-col"> <p>
                  आखर एक सामुदायिक परियोजना है जिसका उद्देश्य उत्तराखंड की स्थानीय भाषाओं - <strong>गढ़वाली, कुमाऊँनी और जौनसारी</strong> - का संरक्षण और संवर्धन करना है।
              </p>
              <p>
                  यह ऐप उन सभी लोगों के लिए एक सरल और सुलभ उपकरण है जो आमतौर पर इस्तेमाल होने वाले शब्दों और वाक्यांशों को सीखना और उनका अभ्यास करना चाहते हैं। इसका उद्देश्य भाषाओं के हर प्रयोग को पुनः स्थापित करने में मदद करना है।
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Encouragement | प्रोत्साहन</h2>
        </div>
        <div class="endorsement-profile">
            <img class="team-member-img" src="assets/team/Pushkar_Singh_Dhami.jpg" alt="Pushkar Singh Dhami">
            <div>
              <h3>Shri Pushkar Singh Dhami</h3>
              <p>Chief Minister (Uttarakhand)</p>
            </div>
        </div>
        <div class="card-content">
          <div class="translation-grid">
            <div class="lang-col"> <p>
                  Necessity is the mother of invention. This is proven by the effort of this important, immediately
                  usable dictionary. It is hoped that this effort will benefit all language and state lovers, youth in particular!
              </p>
              <p>
                I heartily appreciate and extend my best wishes for this unique purposeful effort by Col (Dr) Dimri and team.
                I hope this dictionary will be useful for all looking to learn Utharakandi languages.
              </p>
            </div>
            <div class="lang-col"> 
            <p>
                आवश्यकता आविष्कार की जननी है। यह बात इस महत्वपूर्ण तत्काल प्रयोगी शब्दकोष के प्रयास से सिद्ध होता है! आशा है कि यह शब्दकोष सभी भाषा तथा राज्य प्रेमियों, विशेषत: युवाओं के लिए लाभप्रद होगा!
              </p>
              <p>
              मैं कर्नल (डॉ) डिमरी और उनकी टीम की इस अत्यावश्यक एवं उद्देश्यपूर्ण प्रयास की हार्दिक प्रशंसा करता हूँ। मुझे पूर्ण आशा है कि यह शब्दकोष सभी उत्तराखंडी भाषा सीखने वालों के लिए उपयोगी सिद्ध होगा।
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Project Team | परियोजना समूह</h2>
        </div>
        <div class="card-content">
          <p>This project was made possible by the dedicated individuals below:</p>
          <div class="team-grid">
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Col_Dev_Dimri.jpg" alt="Col. Dev Dimri">
              <h3>Col (Dr) D P Dimri</h3>
              <p>Project Lead</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Saraswati_Prithvi.jpg" alt="Prithvi & Saraswati">
              <h3>Saraswati & Prithvi</h3>
              <p>Developers</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Rekha_Dimri.jpg" alt="Rekha_Dimri">
              <h3>Rekha Dimri</h3>
              <p>Coordinator</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Urmila_Singh.jpg" alt="Urmila Singh">
              <h3>Urmila Singh</h3>
              <p>Contributor</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Puran_Kandpal.jpg" alt="Puran Kandpal">
              <h3>Puran Kandpal</h3>
              <p>Contributor</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2>Feedback</h2>
        </div>
        <div class="card-content">
          <p>
            This app is for the community. If you have feedback, suggestions, or would like to
            contribute, please contact us at: <strong>devdimri@gmail.com</strong>
          </p>
        </div>
      </div>

    </div>
  `;

  // 2. Inject the HTML into the main content area
  mainContentElement.innerHTML = aboutHtml;

  // 3. Add Event Listeners for PWA Install
  const installButton = document.getElementById('btn-install');
  if (installButton) {
    installButton.addEventListener('click', () => {
      triggerInstallPrompt();
    });
  }
  
  // 4. **NEW: Add Event Listeners for Accordion (Collapsible Cards)**
  mainContentElement.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', (e) => {
      // Find the parent .card and toggle its "is-open" class
      e.currentTarget.parentElement.classList.toggle('is-open');
    });
    // Add keypress listener for accessibility
    header.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.currentTarget.parentElement.classList.toggle('is-open');
        e.preventDefault();
      }
    });
  });

  // **NEW: Make all cards open by default on first load (for mobile)**
  // On mobile, the CSS will close them. This JS opens them.
  // A timeout ensures the CSS has loaded.
  setTimeout(() => {
    if (window.innerWidth <= 600) {
      mainContentElement.querySelectorAll('.card').forEach(card => {
        card.classList.add('is-open');
      });
    }
  }, 100);
}