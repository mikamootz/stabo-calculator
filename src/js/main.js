// Kilometer- und Zeitstufen wie zuvor definiert
const stufen = {
    kilometerstufen: [
        { stufe: [0, 10], preisProKm: 0.30 }, 
        { stufe: [10, 15], preisProKm: 0.33 }, 
        { stufe: [15, 20], preisProKm: 0.35 }, 
        { stufe: [20, 30], preisProKm: 0.38 }, 
        { stufe: [30, 50], preisProKm: 0.40 }, 
        { stufe: [50, 75], preisProKm: 0.50 }, 
        { stufe: [75, 100], preisProKm: 0.60 }, 
        { stufe: [100, Infinity], preisProKm: 0.85 }
    ],
    zeitstufen: [
        { stufe: [0, 10], preisProMinute: 0.85 }, 
        { stufe: [10, 15], preisProMinute: 0.80 }, 
        { stufe: [15, 20], preisProMinute: 0.70 }, 
        { stufe: [20, 30], preisProMinute: 0.65 }, 
        { stufe: [30, 60], preisProMinute: 0.60 }, 
        { stufe: [60, 90], preisProMinute: 0.55 }, 
        { stufe: [90, 120], preisProMinute: 0.50 }, 
        { stufe: [120, Infinity], preisProMinute: 0.20 }
    ]
};

// Fahrzeugspezifische Faktoren und Sockelbeträge
const fahrzeugData = {
    PKW: { kilometerFaktor: 1, zeitFaktor: 1, sockelbetrag: 20 },
    Kombi: { kilometerFaktor: 1.03, zeitFaktor: 1.03, sockelbetrag: 20 },
    Kastenwagen: { kilometerFaktor: 1.05, zeitFaktor: 1.05, sockelbetrag: 25 },
    Transporter: { kilometerFaktor: 1.13, zeitFaktor: 1.13, sockelbetrag: 40 },
    'XL-Transporter': { kilometerFaktor: 1.40, zeitFaktor: 1.50, sockelbetrag: 50 }
};

// Funktion zur Aktualisierung der fahrzeugspezifischen Felder
function updateVehicleSpecificFields() {
    const vehicleType = document.getElementById('vehicleType').value;
    const { kilometerFaktor, zeitFaktor, sockelbetrag } = fahrzeugData[vehicleType];

    // Setze Standardwerte der fahrzeugspezifischen Felder, wenn der Fahrzeugtyp gewechselt wird
    document.getElementById('kmFactor').value = kilometerFaktor;
    document.getElementById('timeFactor').value = zeitFaktor;
    document.getElementById('sockelbetrag').value = sockelbetrag;
}

// Berechnungsfunktion
function calculateTotal() {
    const kilometers = parseFloat(document.getElementById('kilometers').value) || 0;
    const minutes = parseFloat(document.getElementById('time').value) || 0;
    const stops = parseInt(document.getElementById('stops').value) || 0;
    const tsz = parseFloat(document.getElementById('tsz').value) || 0;

    const kilometerFaktor = parseFloat(document.getElementById('kmFactor').value) || 1;
    const zeitFaktor = parseFloat(document.getElementById('timeFactor').value) || 1;
    const sockelbetrag = parseFloat(document.getElementById('sockelbetrag').value) || 20;

    const kilometerKosten = berechneKilometerpreis(kilometers, kilometerFaktor);
    const zeitKosten = berechneZeitpreis(minutes, zeitFaktor);
    const stoppKosten = stops * 5;

    const totalPrice = kilometerKosten + zeitKosten + stoppKosten;
    const finalPrice = Math.max(totalPrice, sockelbetrag);
    const tszPrice = (finalPrice * (tsz / 100));  // TSZ-Preis berechnen

    // Den TSZ-Preis zum Gesamtpreis hinzufügen
    const finalPriceWithTSZ = finalPrice + tszPrice;

    // Update der Felder
    document.getElementById('totalPrice').textContent = `${finalPriceWithTSZ.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('priceDetails').textContent = `${tszPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('kilometerPrice').textContent = `${kilometerKosten.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('timePrice').textContent = `${zeitKosten.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Funktion zur Berechnung des Kilometerpreises (unter Berücksichtigung der Stufen)
function berechneKilometerpreis(kilometer, kilometerFaktor) {
    let kilometerPreis = 0;

    stufen.kilometerstufen.forEach(stufe => {
        const [start, ende] = stufe.stufe;
        if (kilometer > start) {
            const kmInDieserStufe = Math.min(kilometer, ende) - start;
            kilometerPreis += kmInDieserStufe * stufe.preisProKm * kilometerFaktor;
        }
    });

    return kilometerPreis;
}

// Funktion zur Berechnung des Zeitpreises (unter Berücksichtigung der Stufen)
function berechneZeitpreis(minuten, zeitFaktor) {
    let zeitPreis = 0;

    stufen.zeitstufen.forEach(stufe => {
        const [start, ende] = stufe.stufe;
        if (minuten > start) {
            const minutenInDieserStufe = Math.min(minuten, ende) - start;
            zeitPreis += minutenInDieserStufe * stufe.preisProMinute * zeitFaktor;
        }
    });

    return zeitPreis;
}

// Event Listener zur dynamischen Berechnung
document.querySelectorAll('#vehicleType, #kilometers, #time, #stops, #tsz, #kmFactor, #timeFactor, #sockelbetrag').forEach(input => {
    input.addEventListener('input', calculateTotal);
});
