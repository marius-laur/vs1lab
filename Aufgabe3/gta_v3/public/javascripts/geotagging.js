// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html

/* logging copy paste
    console.log("---------- updated");
    console.log(tagLatitude.value);
    console.log(tagLongitude.value);
    console.log(discoveryLatitude.value);
    console.log(discoveryLongitude.value);
*/

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    const mapManager = new MapManager();
    let tagLatitude = document.getElementById("tag-latitude-input");
    let tagLongitude = document.getElementById("tag-longitude-input");
    let discoveryLatitude = document.getElementById("discovery-latitude-input");
    let discoveryLongitude = document.getElementById("discovery-longitude-input");

    const tagCoordsPresent = tagLatitude.value !== "" && tagLongitude.value !== "";
    const discoveryCoordsPresent = discoveryLatitude.value !== "" && discoveryLongitude.value !== "";

    if (tagCoordsPresent || discoveryCoordsPresent) {
        const latitude = tagCoordsPresent ? tagLatitude.value : discoveryLatitude.value;
        const longitude = tagCoordsPresent ? tagLongitude.value : discoveryLongitude.value;
        
        updateMap(mapManager, latitude, longitude);

        return;
    }

    LocationHelper.findLocation((location) => {
        tagLatitude.value = location.latitude;
        tagLongitude.value = location.longitude;
        discoveryLatitude.value = location.latitude;
        discoveryLongitude.value = location.longitude;
        
        updateMap(mapManager, location.latitude, location.longitude);
    });
}

function updateMap(mapManager, latitude, longitude) {
    mapManager.initMap(latitude, longitude);
    
    const mapDiv = document.getElementById("map");
    let tags = [];

    const tagsJson = mapDiv.getAttribute("data-tags");
    if (tagsJson) {
        tags = JSON.parse(tagsJson);
    }

    mapManager.updateMarkers(latitude, longitude, tags);

    let mapImage = document.getElementById("map-image");
    let mapDescription = document.getElementById("map-description");
    if (mapImage) mapImage.remove();
    if (mapDescription) mapDescription.remove();
}

// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
