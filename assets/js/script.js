

function initMap() {
  const svetivlas = { lat: 42.7133, lng: 27.7655 };

  const map = new google.maps.Map(document.getElementById("customMap"), {
    center: svetivlas,
    zoom: 13,
    zoomControl: true,
    disableDefaultUI: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#cccccc" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#aadaff" }]
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }]
      }
    ]
  });

  new google.maps.Marker({
    position: svetivlas,
    map: map,
    title: "Sveti Vlas"
  });
}



//WEATHER
async function getWeatherAndSun(lat, lon) {
const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=auto`);
const data = await res.json();
return {
  current: data.current_weather,
  sunrise: data.daily.sunrise[0],
  sunset: data.daily.sunset[0],
};
}

function getWeatherInfo(code) {
  if (code === 0) return { icon: 'fa-sun', text: 'Слънчево', color: '#EAB875' };                     // Clear sky
  if (code === 1) return { icon: 'fa-sun', text: 'Предимно слънчево', color: '#FFD580' };                 // Mostly clear
  if (code === 2) return { icon: 'fa-cloud-sun', text: 'Разкъсана облачност', color: '#ccc' };        // Partly cloudy
  if (code === 3) return { icon: 'fa-cloud', text: 'Облачно', color: '#999' };                        // Overcast
  if ([45, 48].includes(code)) return { icon: 'fa-smog', text: 'Мъгла', color: '#888' };              // Fog
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { icon: 'fa-cloud-showers-heavy', text: 'Дъждовно', color: '#4A90E2' }; // Rain
  if (code >= 95) return { icon: 'fa-bolt', text: 'Гръмотевици', color: '#D9534F' };                  // Thunderstorm
  return { icon: 'fa-question', text: 'Неизвестно време', color: '#000' };
}

async function updateWeatherDisplay() {
const lat = 42.7136;
const lon = 27.7587;

const data = await getWeatherAndSun(lat, lon);
const now = new Date();
const sunrise = new Date(data.sunrise);
const sunset = new Date(data.sunset);
const isNight = now < sunrise || now > sunset;

const iconElem = document.querySelector('.fa-sun, .fa-cloud, .fa-cloud-showers-heavy, .fa-bolt, .fa-question');
const textElem = iconElem?.nextElementSibling;

if (isNight) {
  if (iconElem) {
    iconElem.className = `fas fa-moon`;
    iconElem.style.color = '#444'; // Darker moon color
  }
  if (textElem) {
    textElem.textContent = 'В момента е нощ';
  }
} else {
  const info = getWeatherInfo(data.current.weathercode);
  if (iconElem) {
    iconElem.className = `fas ${info.icon}`;
    iconElem.style.color = info.color;
  }
  if (textElem) {
    textElem.textContent = info.text;
  }
}
}

updateWeatherDisplay();


//QUENDOO

  (function(w,e){
      let key = 'SRPyvNF91V'; 
      let locale = 'bg-BG';
      let currency = 'BGN';
      let uiSettings = {buttonText:'Резервирай', colorTheme:'null'};
      if(!w.isLoadedQuendooBCW){
          w.isLoadedQuendooBCW = true;
          let s=w.document.createElement('script');s.type='text/javascript';s.async=!0;
          s.src='http'+(w.location.protocol=='http:'?'':'s')+'://booking.quendoo.com/fe-widgets/booking-calendar/widget.js?v=1&t='+Date.now();
          s.onload = function(){
          initQuendooBookingCalendarWidget(w,e,key,locale,currency,uiSettings);
          };
          (w.document.getElementsByTagName('head')[0]||w.document.getElementsByTagName('body')[0]).appendChild(s);
      } else {
          initQuendooBookingCalendarWidget(w,e,key,locale,currency,uiSettings);
      }
  })(window,document.getElementById('quendoo-bcw'));



//REVIEWS
async function fetchReviews() {
    const corsProxy = 'https://corsproxy.io/?';
    const targetUrl = encodeURIComponent(
'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJtRiii3MgpEARYaRsYT4TfXM&fields=name,reviews&language=bg&key=AIzaSyBdyGbeCSZC1gsTDybBb7KEHT9efWzjC6o'
);


    try {
      const response = await fetch(corsProxy + targetUrl);
      const data = await response.json();

      const reviewsDiv = document.getElementById('scrollContainer');

      if (!data.result) {
        reviewsDiv.innerHTML = `<p>Could not load reviews. Check API key or Place ID.</p>`;
        return;
      }

      const placeName = data.result.name;
      const reviews = data.result.reviews || [];

   

      reviews.forEach(review => {
        const reviewBlock = document.createElement('div');
        const stars = '★★★★★☆☆☆☆☆'.slice(5 - Math.round(review.rating), 10 - Math.round(review.rating));

        reviewBlock.innerHTML = `
        <div class="carousel-card bg-white p-4 text-left flex-shrink-0" style="width: 350px;">
          <p class="review-stars" style="color: gold;">${stars}</p>
          <p class="text-dark reveiws-text">${review.text}</p>
          <p class="text-info fw-semibold small reveiws-name">- ${review.author_name}</p>
        </div>
        `;
        reviewsDiv.appendChild(reviewBlock);
        
      });
    } catch (err) {
      console.error('Fetch error:', err);
      document.getElementById('reviews').innerHTML = `<p>Error fetching reviews. Check CORS settings or try again later.</p>`;
    }
  }

  fetchReviews();

  
const container = document.getElementById('scrollContainer');
document.getElementById('scrollLeft').addEventListener('click', () => {
  container.scrollBy({ left: -320, behavior: 'smooth' });
});
document.getElementById('scrollRight').addEventListener('click', () => {
  container.scrollBy({ left: 320, behavior: 'smooth' });
});


//LANGUAGE
window.gtranslateSettings = {"default_language":"bg","languages":["bg","ro","en","uk","ru","de","pl","sr","mk","hu"],"wrapper_selector":".gtranslate_wrapper","flag-size":48}


//SCROLL TO DIV
function scrollToDiv() {
  const target = document.getElementById('targetDiv');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}