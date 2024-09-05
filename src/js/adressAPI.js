let startPlace = null;
let endPlace = null;

// Initialisiere Autocomplete für beide Adressfelder
function setupAutocomplete() {
    const startAddress = document.getElementById('startAddress');
    const endAddress = document.getElementById('endAddress');

    const europeanCountries = ['de', 'fr', 'it', 'es', 'gb', 'nl', 'be', 'ch', 'at', 'pl', 'se', 'no', 'dk'];

    const autocompleteStart = new google.maps.places.Autocomplete(startAddress, {
        componentRestrictions: { country: europeanCountries }
    });
    autocompleteStart.addListener('place_changed', () => {
        startPlace = autocompleteStart.getPlace();
        if (!startPlace.geometry) {
            alert("Keine Geometrie-Daten für die Startadresse verfügbar");
        } else {
            document.getElementById('startAddress').value = formatAddress(startPlace);
        }
    });

    const autocompleteEnd = new google.maps.places.Autocomplete(endAddress, {
        componentRestrictions: { country: europeanCountries }
    });
    autocompleteEnd.addListener('place_changed', () => {
        endPlace = autocompleteEnd.getPlace();
        if (!endPlace.geometry) {
            alert("Keine Geometrie-Daten für die Zieladresse verfügbar");
        } else {
            document.getElementById('endAddress').value = formatAddress(endPlace);
        }
    });
}

function formatAddress(place) {
    const components = place.address_components;
    let street = '', postalCode = '', city = '', houseNumber = '';
    components.forEach(comp => {
        if (comp.types.includes('route')) street = comp.long_name;
        if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        if (comp.types.includes('locality')) city = comp.long_name;
        if (comp.types.includes('street_number')) houseNumber = comp.long_name;
    });
    return `${street} ${houseNumber}, ${postalCode} ${city}`;
}

// This function calculates the route and updates price fields
async function calculateRoute() {
    if (!startPlace || !endPlace) {
        alert("Bitte wählen Sie gültige Start- und Zieladressen aus.");
        return;
    }

    const startCoords = startPlace.geometry.location;
    const endCoords = endPlace.geometry.location;

    try {
        const distanceMatrixService = new google.maps.DistanceMatrixService();
        distanceMatrixService.getDistanceMatrix({
            origins: [new google.maps.LatLng(startCoords.lat(), startCoords.lng())],
            destinations: [new google.maps.LatLng(endCoords.lat(), endCoords.lng())],
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date()  // Aktuelle Uhrzeit
            }
        }, (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                const element = response.rows[0].elements[0];

                const distance_km = element.distance.value / 1000;  // Entfernung in Kilometern
                const duration_in_traffic_min = element.duration.value / 60;  // Dauer in Minuten

                // Kilometer und Zeit auf die nächste ganze Zahl abrunden
                document.getElementById("kilometers").value = Math.floor(distance_km);
                document.getElementById("time").value = Math.floor(duration_in_traffic_min);

                // Berechnung der Gesamtkosten aufrufen, sobald Kilometer und Zeit gesetzt sind
                calculateTotal();
            } else {
                alert("Verkehrsinformationen konnten nicht abgerufen werden.");
            }
        });
    } catch (error) {
        alert(`Fehler: ${error.message}`);
    }
}

// Initialize autocomplete on page load
window.onload = function() {
    setupAutocomplete(); // Ensure autocomplete is initialized
    const savedInputs = JSON.parse(localStorage.getItem('savedInputs'));
    if (savedInputs) {
        document.getElementById('kilometers').value = savedInputs.kilometers;
        document.getElementById('time').value = savedInputs.minutes;
        document.getElementById('stops').value = savedInputs.stops;
        document.getElementById('tsz').value = savedInputs.tsz;
        document.getElementById('vehicleType').value = savedInputs.vehicleType;
        document.getElementById('kmFactor').value = savedInputs.kilometerFaktor;
        document.getElementById('timeFactor').value = savedInputs.zeitFaktor;
        document.getElementById('sockelbetrag').value = savedInputs.sockelbetrag;
    }
    calculateTotal(); // Calculate total on page load
};
