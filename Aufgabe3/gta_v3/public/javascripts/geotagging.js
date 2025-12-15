// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    const mapManager = new MapManager();

    const tagLatitude = document.getElementById("tag-latitude-input");
    const tagLongitude = document.getElementById("tag-longitude-input");
    const discoveryLatitude = document.getElementById("discovery-latitude-input");
    const discoveryLongitude = document.getElementById("discovery-longitude-input");

    const tagCoordsPresent = tagLatitude.value !== "" && tagLongitude.value !== "";
    const discoveryCoordsPresent = discoveryLatitude.value !== "" && discoveryLongitude.value !== "";

    const initMapWithTags = (lat, lng) => {
        mapManager.initMap(lat, lng);

        const mapDiv = document.getElementById("map");
        let tags = [];

        const tagsJson = mapDiv.getAttribute("data-tags");
        if (tagsJson) {
            tags = JSON.parse(tagsJson);
        }

        mapManager.updateMarkers(lat, lng, tags);

        const mapImage = document.getElementById("map-image");
        const mapDescription = document.getElementById("map-description");
        if (mapImage) mapImage.remove();
        if (mapDescription) mapDescription.remove();
    };
    if (tagCoordsPresent || discoveryCoordsPresent) {
        const lat = tagCoordsPresent ? tagLatitude.value : discoveryLatitude.value;
        const lng = tagCoordsPresent ? tagLongitude.value : discoveryLongitude.value;
        initMapWithTags(lat, lng);
        return;
    }

    console.log("updated");
    console.log(tagLatitude.value);
    console.log(tagLongitude.value);
    console.log(discoveryLatitude.value);
    console.log(discoveryLongitude.value);

    LocationHelper.findLocation((location) => {
        tagLatitude.value = location.latitude;
        tagLongitude.value = location.longitude;
        discoveryLatitude.value = location.latitude;
        discoveryLongitude.value = location.longitude;
    
        initMapWithTags(location.latitude, location.longitude);
    });
}

// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});