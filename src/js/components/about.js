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
        <div class="card-header">
          <h2>Introduction | परिचय</h2>
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
        <div class="card-content">
          <div class="translation-grid">
            <div class="lang-col"> <p>
                  Necessity is the mother of invention, this is proven by the effort of this important, immediately 
                  usable dictionary! It is hoped that this effort will benefit all language and state lovers!
              </p>
              <p>
                I heartily praise this unique effort and give my best wishes!
              </p>
            </div>
            <div class="lang-col"> <p>
                  आवश्यकता आविष्कार की जननी है, यह चरितार्थ होता है इस महत्वपूर्ण तत्काल प्रयोगी शब्दकोष के प्रयास से ! आशा है कि सभी भाषा व् प्रदेश प्रेमियों को यह प्रयास लाभान्वित करेगा !
              </p>
              <p>
                  इस अनूठे प्रयास की मैं भरपूर प्रशंसा करता हूँ तथा शुभकामनाएँ देता हूँ !
              </p>
            </div>
          </div>
          
          <div class="endorsement-profile">
              <img class="team-member-img" src="assets/team/Pushkar_Singh_Dhami.jpg" alt="Pushkar Singh Dhami">
              <div>
                <h3>Shri Pushkar Singh Dhami</h3>
                <p>Chief Minister (Uttarakhand)</p>
              </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Uttarakhand | उत्तराखंड</h2>
        </div>
        <div class="card-content">
          <p>
              Uttarakhand (earlier known as Uttaranchal] is in the northern part of India. It is also referred to as the Devabhumi as number of Hindu temples and pilgrimage centres are spread throughout the state. On 9 November 2000, Uttarakhand became the 27th state of the Republic of India, being carved from the Himalayan districts of Uttar Pradesh.
          </p>
          <p>    
              The state is divided into two divisions, Garhwal and Kumaon, with a total of 13 districts. The temporary capital of Uttarakhand is Dehradun. On 4 March 2020, Gairsain, a town in Chamoli District, was declared the summer capital of the state. The High Court of the state is located in Nainital. The natives of the state are generally called Uttarakhandi, or more specifically either Garhwali, Kumaoni or Jaunsaari by their region of origin.
          </p>
          <img src="assets/other/uttarakhand_map.png" alt="Uttarakhand map" class="map-image">            
        </div>
      </div>

      <div class="card" id="add-to-home-card">
        <div class="card-header">
          <h2>Add to Home Screen</h2>
        </div>
        <div class="card-content">
          <p>
            Install this app on your phone for easy, offline access.
            It works just like a native app!
          </p>
          <button class="btn" id="btn-install">Add to Home Screen</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Acknowledgements</h2>
        </div>
        <div class="card-content">
          <p>This project was made possible by the dedicated individuals below:</p>
          <div class="team-grid">
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Col_Dev_Dimri.jpg" alt="Col. Dev Dimri">
              <h3>Col. Dev Dimri</h3>
              <p>Project Lead</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Saraswati_Prithvi.jpg" alt="Prithvi & Saraswati">
              <h3>Prithvi & Saraswati</h3>
              <p>Developers</p>
            </div>
            <div class="team-member">
              <img class="team-member-img" src="assets/team/Rekha_Dimri.jpg" alt="Rekha_Dimri">
              <h3>Rekha Dimri</h3>
              <p>Coordinator</p>
            </div>
              <div class="team-member">
              <img class="team-member-img" src="assets/team/Arun_Lakhera.jpg" alt="Arun Lakhera">
              <h3>Arun Lakhera</h3>
              <p>Developer</p>
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
            contribute, please contact us at: <strong>p(at)earthlord.io</strong>.
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