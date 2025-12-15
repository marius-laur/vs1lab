// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html

// Global variable to store mapManager instance
let mapManager;

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    mapManager = new MapManager();
    let tagLatitude = document.getElementById("tag-latitude-input");
    let tagLongitude = document.getElementById("tag-longitude-input");
    let discoveryLatitude = document.getElementById("discovery-latitude-input");
    let discoveryLongitude = document.getElementById("discovery-longitude-input");

    const hasCoordinates = tagLatitude.value !== ""
        && tagLongitude.value !== "" 
        && discoveryLatitude.value !== "" 
        && discoveryLongitude.value !== "";

    // Helper function to initialize map and display markers
    const processLocation = (latitude, longitude) => {
        mapManager.initMap(latitude, longitude);

        // Read GeoTags from data-tags
        let mapDiv = document.getElementById("map");
        let tagsJson = mapDiv.getAttribute("data-tags");
        let tagsArray = [];
        if (tagsJson) {
            tagsArray = JSON.parse(tagsJson);
        }

        // Update markers including GeoTags
        mapManager.updateMarkers(latitude, longitude, tagsArray);

        // Remove placeholder elements if they exist
        let mapImage = document.getElementById("map-image");
        let mapDescription = document.getElementById("map-description");
        if (mapImage) {
            mapImage.remove();
        }
        if (mapDescription) {
            mapDescription.remove();
        }

        // Add click event listeners to result items
        attachResultItemClickListeners(tagsArray);
    };

    if (!hasCoordinates) {
        // Only request location if coordinates are not available
        LocationHelper.findLocation((location) => {
            tagLatitude.value = location.latitude;
            tagLongitude.value = location.longitude;
            discoveryLatitude.value = location.latitude;
            discoveryLongitude.value = location.longitude;

            processLocation(location.latitude, location.longitude);
        });
    } else {
        // Use existing coordinates from form fields
        processLocation(parseFloat(tagLatitude.value), parseFloat(tagLongitude.value));
    }
}

/**
 * Attach click event listeners to result list items
 * @param {Array} tagsArray Array of GeoTag objects
 */
function attachResultItemClickListeners(tagsArray) {
    let resultItems = document.querySelectorAll('.discovery__results li');
    
    resultItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (tagsArray[index]) {
                let tag = tagsArray[index];
                mapManager.panToLocation(parseFloat(tag.latitude), parseFloat(tag.longitude), 18);
            }
        });
    });
}

// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});