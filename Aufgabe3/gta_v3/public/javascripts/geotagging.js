// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html

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

const hasCoordinates = tagLatitude.value !== ""
        && tagLongitude.value !== "" 
        && discoveryLatitude.value !== "" 
        && discoveryLongitude.value !== "";

    if (!hasCoordinates) {
    
        console.log("updated");

        LocationHelper.findLocation((location) => {
            tagLatitude.value = location.latitude;
            tagLongitude.value = location.longitude;
            discoveryLatitude.value = location.latitude;
            discoveryLongitude.value = location.longitude;

            mapManager.initMap(location.latitude, location.longitude);

            // Read GeoTags from data-tags
            let mapDiv = document.getElementById("map");
            let tagsJson = mapDiv.getAttribute("data-tags");
            let tagsArray = [];
            if (tagsJson) {
                tagsArray = JSON.parse(tagsJson);
            }

            // Update markers including GeoTags
            mapManager.updateMarkers(location.latitude, location.longitude, tagsArray);

            document.getElementById("map-image").remove();
            document.getElementById("map-description").remove();
        });
    }
}

// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});