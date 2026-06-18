const YOUR_LAT = 51.645424;
const YOUR_LNG = 0.449835;
const MAX_DISTANCE_MILES = 6;

function toRad(v) {
    return v * Math.PI / 180;
}

// https://en.wikipedia.org/wiki/Haversine_formula
function getDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function checkPostcode() {
    const postcode = document.getElementById("postcode").value.trim();
    const result = document.getElementById("result");

    if (!postcode) {
        result.innerText = "Please enter a postcode.";
        return;
    }

    result.innerText = "Calculating distance";

    try {
        // thank goodness there is an API that doesnt require a key for this
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postcode)}`);

        const data = await res.json();

        if (!data.length) {
            result.innerText = "Postcode not found.";
            return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        const distance = getDistanceMiles(YOUR_LAT, YOUR_LNG, lat, lng);

        if (distance <= MAX_DISTANCE_MILES) {
            result.innerText = `Inside delivery area (${distance.toFixed(2)} miles)`;
            result.style.color = "#04a904";
        } else {
            result.innerText = `Outside delivery area (${distance.toFixed(2)} miles)`;
            result.style.color = "#560202";
        }

    } catch (err) {
        result.innerText = "Error checking postcode.";
    }
}