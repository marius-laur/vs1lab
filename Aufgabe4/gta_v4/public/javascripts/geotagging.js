// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
const DEFAULT_ELEMENTS_PER_PAGE = 5;
const DEFAULT_RADIUS = 10;
let mapManager = null;
let mapInitialized = false;
let currentPage = 0;
let currentTagListLength = 0;

function updateLocation() {
    let tagLatitude = document.getElementById("tag-latitude-input");
    let tagLongitude = document.getElementById("tag-longitude-input");
    let discoveryLatitude = document.getElementById("discovery-latitude-input");
    let discoveryLongitude = document.getElementById("discovery-longitude-input");

    const tagCoordsPresent = tagLatitude.value !== "" && tagLongitude.value !== "";
    const discoveryCoordsPresent = discoveryLatitude.value !== "" && discoveryLongitude.value !== "";

    if (tagCoordsPresent || discoveryCoordsPresent) {
        const latitude = tagCoordsPresent ? tagLatitude.value : discoveryLatitude.value;
        const longitude = tagCoordsPresent ? tagLongitude.value : discoveryLongitude.value;
        
        tagLatitude.value = latitude;
        tagLongitude.value = longitude;
        discoveryLatitude.value = latitude;
        discoveryLongitude.value = longitude;

        updateMap(latitude, longitude, getTagsFromMap());
        return;
    }

    LocationHelper.findLocation((location) => {
        tagLatitude.value = location.latitude;
        tagLongitude.value = location.longitude;
        discoveryLatitude.value = location.latitude;
        discoveryLongitude.value = location.longitude;
        
        updateMap(location.latitude, location.longitude, getTagsFromMap());
    });
}

function updateMap(latitude, longitude, tags = []) {
    if (!mapManager) {
        mapManager = new MapManager();
    }

    if (!mapInitialized) {
        mapManager.initMap(latitude, longitude);
        mapInitialized = true;
    }

    mapManager.updateMarkers(latitude, longitude, tags);

    let mapImage = document.getElementById("map-image");
    let mapDescription = document.getElementById("map-description");
    if (mapImage) mapImage.remove();
    if (mapDescription) mapDescription.remove();
}

function getTagsFromMap() {
    const mapDiv = document.getElementById("map");
    const tagsJson = mapDiv.getAttribute("data-tags");
    if (!tagsJson) return [];
    try {
        return JSON.parse(tagsJson);
    } catch {
        return [];
    }
}

function setTagsToMap(tags) {
    document.getElementById("map").setAttribute("data-tags", JSON.stringify(tags));
}


function updateDiscoveryUI(tags, lat, lng) {
    const ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";

    tags.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = `${tag.name} ( ${tag.latitude},${tag.longitude}) ${tag.hashtag || ""}`;
        ul.appendChild(li);
    });

    try {
        document.getElementById("page-number").textContent = (currentPage + 1);
    } catch (err) {
        alert(err.message)
    }

    setTagsToMap(tags);
    updateMap(lat, lng, tags);
}

// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const tagform = document.getElementById("tag-form");
    const discoveryform = document.getElementById("discovery-form");
    const pageLeftButton = document.getElementById("discovery-nav-left");
    const pageRightButton = document.getElementById("discovery-nav-right");

    tagform.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            let tagName = document.getElementById("tag-name-input").value;
            let tagLat = parseFloat(document.getElementById("tag-latitude-input").value);
            let tagLng = parseFloat(document.getElementById("tag-longitude-input").value);
            let tagHashtag = document.getElementById("tag-hashtag-input").value;
            
            let tag = new GeoTag(tagName, tagLat, tagLng, tagHashtag);
        
            await postGeoTag(tag);
            await runDiscovery();
        } catch (e) {
            alert(e.message);
        }
    });

    discoveryform.addEventListener("submit", async (event) => {
        event.preventDefault();
        currentPage = 0;
        try { 
            await runDiscovery(); 
        } catch (e) { 
            alert(e.message); 
        }
    });

    pageLeftButton.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            runDiscovery();
        }
    });

    pageRightButton.addEventListener("click", () => {
        if (currentTagListLength >= DEFAULT_ELEMENTS_PER_PAGE) {
            currentPage++;
            runDiscovery();
        }
    });
});

async function runDiscovery() {
    const search = document.getElementById("discovery-search-input").value;
    const lat = parseFloat(document.getElementById("discovery-latitude-input").value);
    const lng = parseFloat(document.getElementById("discovery-longitude-input").value);

    const result = await getGeoTags(lat, lng, currentPage, search);
    currentTagListLength = result.tags.length;
    updateDiscoveryUI(result.tags, lat, lng);
}

async function postGeoTag(tag) {
    const res = await fetch("/api/geotags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag)
    });
    return res.json();
}

async function getGeoTags(lat, lng, page, search) {
    const params = new URLSearchParams({
        lat: lat,
        lng: lng,
        rad: DEFAULT_RADIUS,
        page: page,
        elementsPerPage: DEFAULT_ELEMENTS_PER_PAGE
    });

    if (search && search.trim() !== "") {
        params.set("s", search.trim());
    }

    const res = await fetch("/api/geotags?" + params.toString());
    return res.json();
}

//GeoTags Constuctor
class GeoTag {
    constructor(tagName, tagLatitude, tagLongitude, tagHashtag) {
        this.tagName = tagName;
        this.tagLatitude = tagLatitude;
        this.tagLongitude = tagLongitude;
        this.tagHashtag = tagHashtag;
    }
}