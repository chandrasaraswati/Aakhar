/**
 * Renders the "Uttarakhand" page content into the main container.
 * @param {HTMLElement} mainContentElement - The <main> element to inject content into.
 */
export function renderUttarakhandPage(mainContentElement) {
  // 1. Define the HTML content for the 'Uttarakhand' page
  const uttarakhandHtml = `
    <div class="uttarakhand-container">

      <div class="card">
        <div class="card-header">
          <h2>🏔️ About Uttarakhand</h2>
        </div>
        <div class="card-content">
          <p>
            Uttarakhand, formerly known as Uttaranchal, is a state in the northern part of India.             On <strong>9 November 2000</strong>, Uttarakhand became the 27th state of the Republic of India, carved from the Himalayan districts of Uttar Pradesh. It is rich in natural resources especially water and forests with many glaciers, rivers, dense forests and snow-clad mountain peaks.
          </p>
          <p>
            It is often referred to as <strong>Devabhumi</strong> (Land of the Gods) due to the many Hindu temples and pilgrimage centers spread throughout the state. Char-dhams, the four most sacred and revered Hindu temples of Badrinath,Kedarnath, Gangotri and Yamunotri are nestled in the mighty mountains. 
          </p>
          <p>
            The state is divided into two main divisions: <strong>Garhwal</strong> and <strong>Kumaon</strong>. The temporary capital is <strong>Dehradun</strong>, and <strong>Gairsain</strong> (in Chamoli District) was declared the summer capital on March 4, 2020. The state's High Court is located in Nainital.
          </p>
          <img src="assets/other/uttarakhand_map.png" alt="Map of Uttarakhand" class="map-image">
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>📜 History</h2>
        </div>
        <div class="card-content">
          <p>The history of Uttarakhand, literally "the Northern Land," stretches back to prehistoric times. Archaeological evidence, including Stone Age rock shelters at places like Lakhudyar, confirms human settlement from the very earliest periods. Ancient Hindu scriptures, such as the Puranas, refer to this region as the combined area of <strong>Kedarkhand</strong> (Garhwal) and <strong>Manaskhand</strong> (Kumaon), revering it as <em>Devbhumi</em>, or the "Land of the Gods."</p>
          <p>Over the centuries, the region was inhabited by various peoples, including the Kols, Kiratas, and Khasas. The first major dynasty to consolidate power was the <strong>Kunindas</strong> in the 2nd century BC. Following them, a succession of dynasties, including the Kushanas, Guptas, and notably the <strong>Katyuris</strong>, held sway. The Katyuris ruled over a unified, extensive kingdom from the 7th to the 11th centuries, marking a golden age of art and temple architecture.</p>
          <p>After the Katyuri decline, the region fragmented. The <strong>Chand dynasty</strong> rose to prominence in Kumaon, ruling from their capital in Champawat and later Almora. Simultaneously, the <strong>Parmar (or Panwar) dynasty</strong> unified the Garhwal region, ruling first from Chandpur Garhi and later moving their capital to Srinagar. These two kingdoms, Garhwal and Kumaon, often warred with each other for centuries.</p>
          <p>In 1791, the Gurkhas of Nepal invaded and captured Kumaon, eventually overpowering Garhwal as well by 1804. Their harsh rule lasted until 1815, when the British defeated them in the Anglo-Nepalese War. The subsequent <strong>Treaty of Sugauli</strong> (1816) forced the Gurkhas to cede Kumaon and Eastern Garhwal to the British, while Western Garhwal was restored to the Parmar king as the princely state of Tehri.</p>
          <p>During British rule and after India's independence in 1947, the region remained part of the United Provinces (later Uttar Pradesh). However, a long-standing movement for a separate state, based on unique cultural, economic, and geographical identity, gained momentum in the 1990s. Following intense popular agitation, Uttarakhand was finally carved out of Uttar Pradesh and became the <strong>27th state of India on November 9, 2000</strong> (initially named Uttaranchal, before being renamed Uttarakhand in 2007).</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>🗺️ State Administrative Details</h2>
        </div>
        <div class="card-content">
          <table class="admin-table">
            <tbody>
              <tr><td>Total Area</td><td>53,483 sq km</td></tr>
              <tr><td>Forest Area</td><td>38,000 sq km</td></tr>
              <tr><td>International Borders</td><td>China, Nepal</td></tr>
              <tr><td>State Borders</td><td>Uttar Pradesh, Himachal Pradesh</td></tr>
              <tr><td>Divisions (Mandal)</td><td>2 (Garhwal and Kumaon)</td></tr>
              <tr><td>Districts</td><td>13</td></tr>
              <tr><td>Tehsils</td><td>113</td></tr>
              <tr><td>Development Blocks</td><td>95</td></tr>
              <tr><td>Lok Sabha Seats</td><td>5</td></tr>
              <tr><td>Rajya Sabha Seats</td><td>3</td></tr>
              <tr><td>Vidhan Sabha Seats</td><td>70</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>⚽ State Symbols of Uttarakhand</h2>
        </div>
        <div class="card-content">
          <div class="symbols-grid">
            
            <div class="symbol-item"><img src="assets/symbols/Emblem.png" alt="Uttarakhand State Emblem" class="symbol-img"><div><h3>Diamond Shield</h3><p>State Emblem</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Dhol.jpg" alt="Dhol" class="symbol-img"><div><h3>Dhol</h3><p>State Instrument</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Alpine_Musk_Deer.jpg" alt="Alpine Musk Deer" class="symbol-img"><div><h3>Alpine Musk Deer</h3><p>State Mammal</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Himalayan_Monal.jpg" alt="Himalayan Monal" class="symbol-img"><div><h3>Himalayan Monal</h3><p>State Bird</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Brahma_Kamal.jpg" alt="Brahma Kamal" class="symbol-img"><div><h3>Brahma Kamal</h3><p>State Flower</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Kafal.jpg" alt="Kafal" class="symbol-img"><div><h3>Kafal</h3><p>State Fruit</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Buransh.jpg" alt="Buransh" class="symbol-img"><div><h3>Buransh (Rhododendron)</h3><p>State Tree</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Kandali.jpg" alt="Kandali" class="symbol-img"><div><h3>Kandali (Stinging Nettle)</h3><p>State Vegetable</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Bal_Mithai.jpg" alt="Bal Mithai" class="symbol-img"><div><h3>Bal Mithai</h3><p>State Sweet</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Ganges.jpg" alt="Ganges" class="symbol-img"><div><h3>Ganges</h3><p>State River</p></div></div>
            <div class="symbol-item"><img src="assets/symbols/Football.jpg" alt="Football" class="symbol-img"><div><h3>Football</h3><p>State Sport</p></div></div>

          </div>
        </div>
      </div>

      <div class="card">      
        <p class="credits-link">
            <a href="credits.html" target="_self">Image Credits for this page</a>
        </p>
      </div>

    </div>
  `;

  // 2. Inject the HTML into the main content area
  mainContentElement.innerHTML = uttarakhandHtml;

  // 3. Add Event Listeners for Accordion (Collapsible Cards)
  mainContentElement.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.currentTarget.parentElement.classList.toggle('is-open');
    });
    header.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.currentTarget.parentElement.classList.toggle('is-open');
        e.preventDefault();
      }
    });
  });

  // 4. Make all cards open by default
  setTimeout(() => {
    if (window.innerWidth <= 600) {
      mainContentElement.querySelectorAll('.card').forEach(card => {
        card.classList.add('is-open');
      });
    }
  }, 100);
}