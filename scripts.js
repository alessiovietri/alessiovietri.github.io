let map;
let marker;
let text;
let subtext;

function initMap() {
    const initialPosition = { lat: 40.7128, lng: -74.0060 }; // Posizione di base (New York City)
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialPosition,
        zoom: 12,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                { "color": "#ffffff" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                { "color": "#000000" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels",
                "stylers": [
                { "visibility": "off" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                { "visibility": "off" }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                { "visibility": "off" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                { "color": "#ffffff" }
                ]
            }
        ],
        disableDefaultUI: true, // Disabilita tutti i controlli predefiniti
        zoomControl: true // Abilita solo il controllo dello zoom
    });

    const input = document.getElementById('search-input');
    const searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;

            map.setCenter(place.geometry.location);
            
            addCustomMarker(map.getCenter(), true);

            // Aggiorna il testo visualizzato con l'indirizzo del luogo selezionato
            text = place.formatted_address || place.name;
            document.getElementById('text-container').innerText = text;
            document.getElementById('text-input').value = text;

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            
            addCustomMarker(map.getCenter(), null);
        });

        map.fitBounds(bounds);
    });

    document.querySelectorAll('input[name="pin"]').forEach(radio => {
        radio.addEventListener('change', () => {
            addCustomMarker(map.getCenter());
        });
    });
    
    // Aggiorna il testo visualizzato quando l'utente scrive nel campo di testo
    document.getElementById('text-input').addEventListener('input', (event) => {
        document.getElementById('text-container').textContent = event.target.value;
    });
    
    // Aggiorna il testo visualizzato quando l'utente scrive nel campo di testo
    document.getElementById('subtext-input').addEventListener('input', (event) => {
        document.getElementById('subtext-container').textContent = event.target.value;
    });
}

function addCustomMarker(position, reset = false) {
    if (marker) marker.setMap(null);

    if (reset) {
        return;
    }

    const selectedPin = document.querySelector('input[name="pin"]:checked').value;

    let iconUrl;

    switch (selectedPin) {
        case "red":
            iconUrl = "https://cdn-icons-png.flaticon.com/256/12392/12392532.png"; // Sostituisci con il percorso della tua immagine PNG rossa
            break;
        case "blue":
            iconUrl = "https://cdn-icons-png.freepik.com/256/3177/3177446.png?semt=ais_hybrid"; // Sostituisci con il percorso della tua immagine PNG blu
            break;
        case "green":
            iconUrl = "https://cdn-icons-png.flaticon.com/128/7954/7954340.png"; // Sostituisci con il percorso della tua immagine PNG verde
            break;
        default:
            iconUrl = null; // Nessun pin se "default"
            break;
    }

    if (iconUrl) {
        marker = new google.maps.Marker({
            map,
            position,
            icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(64, 64) // Dimensione scalata del marker
            }
        });
    }
}

window.initMap = initMap;

initMap();