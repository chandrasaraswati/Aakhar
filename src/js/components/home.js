/**
 * Renders the "Home" (landing) page content into the main container.
 * @param {HTMLElement} mainContentElement - The <main> element to inject content into.
 */
export function renderHomePage(mainContentElement) {
  const homeHtml = `
    <div class="home-container">
      
      <div class="home-logo-card">
        <div class="home-logo">आखर | Aakhar</div>
      </div>

      <div class="home-content">
        <div class="home-text-block">
          <h1 class="home-title-hindi">उत्तराखंडी भाषा तत्काल लघु शब्दकोश</h1>
          <p class="home-subtitle-hindi">हिंदी / अंग्रेज़ी / गढ़वाली / कुमाऊँनी / जौनसारी</p>
        </div>
        
        <div class="home-text-block">
          <h1 class="home-title-english">Uttarakhandi Language Instant Short Dictionary</h1>
          <p class="home-subtitle-english">Hindi / English / Garhwali / Kumaoni / Jaunsari</p>
        </div>
        <div class="home-cta-buttons">
          <a href="#learn" class="btn">Start Learning &rarr;</a>
          <a href="#uttarakhand" class="btn btn-secondary">About Uttarakhand</a>
        </div>
      </div>
    </div>
  `;
  mainContentElement.innerHTML = homeHtml;
}