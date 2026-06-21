const BILLERICAY_CHILL_LATITUDE = 51.645424;
const BILLERICAY_CHILL_LONGITUDE = 0.449835;
const MAX_DISTANCE_MILES = 6;

// Math.toRad doesnt exist...?
function toRad(v) {
    return v * Math.PI / 180;
}

// https://en.wikipedia.org/wiki/Haversine_formula
const EARTH_DIAMETER_MILES = 7917.6;
function haversineDistance(lon1, lat1, lon2, lat2) {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    // https://www.movable-type.co.uk/scripts/latlong.html this example just calls the variable "a"
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return EARTH_DIAMETER_MILES * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// async, fancy stuff.
async function checkPostcode() {
    const postcode = document.getElementById("postcode").value.trim();
    const result = document.getElementById("result");

    if (!postcode) {
        result.innerText = "Please enter a postcode.";
        return;
    }

    result.innerText = "Calculating distance";

    try {
        // thank goodness there is an API that doesnt require a key for this https://postcodes.io/endpoints/
        // my sister said it doesnt rate limit, i hope that's true
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);

        const data = await res.json();

        console.log(data);

        if (data.status !== 200) {
            result.innerText = "Postcode not found.";
            return;
        }

        const POSTCODE_LONGITUDE = parseFloat(data.result.longitude);
        const POSTCODE_LATITUDE = parseFloat(data.result.latitude);

        const distance = haversineDistance(BILLERICAY_CHILL_LONGITUDE, BILLERICAY_CHILL_LATITUDE, POSTCODE_LONGITUDE, POSTCODE_LATITUDE);

        if (distance <= MAX_DISTANCE_MILES) {
            result.innerText = `Inside delivery area (${distance.toFixed(2)} miles)`;
            result.style.color = "#04a904";
        } else {
            result.innerText = `Outside delivery area (${distance.toFixed(2)} miles)`;
            result.style.color = "#560202";
        }

    } catch (err) {
        console.error(err);
        result.innerText = "Error checking postcode.";
    }
}