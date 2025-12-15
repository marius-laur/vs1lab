// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {

    constructor() {
        // private array (by convention)
        this._geoTags = [];
    }

    /**
     * Add a GeoTag to the store
     */
    addGeoTag(geoTag) {
        if (geoTag) {
            this._geoTags.push(geoTag);
        }
    }

    /**
     * Remove GeoTags by name
     */
    removeGeoTag(name) {
        this._geoTags = this._geoTags.filter(
            tag => tag.name !== name
        );
    }

    /**
     * Return all GeoTags within a radius of a location
     */
    getNearbyGeoTags(latitude, longitude, radius = 0.01) {
        return this._geoTags.filter(tag => {
            const dist = Math.sqrt(
                Math.pow(tag.latitude - latitude, 2) +
                Math.pow(tag.longitude - longitude, 2)
            );
            return dist <= radius;
        });
    }

    /**
     * Return all nearby GeoTags matching a keyword
     */
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {

        const nearby = this.getNearbyGeoTags(latitude, longitude, radius);

        if (!keyword || keyword.trim() === '') {
            return nearby;
        }

        const lowerKeyword = keyword.toLowerCase();

        return nearby.filter(tag =>
            tag.name.toLowerCase().includes(lowerKeyword) ||
            tag.hashtag.toLowerCase().includes(lowerKeyword)
        );
    }
}

module.exports = InMemoryGeoTagStore;
