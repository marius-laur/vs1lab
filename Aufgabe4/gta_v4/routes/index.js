// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagExamples = require('../models/geotag-examples');
const InMemoryGeoTagStore = require('../models/geotag-store');


// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

const radius = 10; //in km
const geoTagStore = new InMemoryGeoTagStore();

router.get('/', (req, res) => {
  GeoTagExamples.fillExampleTags(geoTagStore);

  res.render('index', {
    taglist: [],
    tagLat: "",
    tagLong: "",
    disLat: "",
    disLong: ""
  });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  
  try {
    let geoTags = geoTagStore.getNearbyGeoTags(req.body.tagLatitude, req.body.tagLongitude, radius);
    
    if (req.query) {
      geoTags = geoTagStore.searchNearbyGeoTags(req.body.tagLatitude, req.body.tagLongitude, radius, req.query);
    }

    res.json(JSON.stringify(geoTags));

  } catch (err) {
    console.error(err.message());
  }
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  
  try {
    let geoTag = new GeoTag(req.body.tagName, req.body.tagLatitude, req.body.tagLongitude, req.body.tagHashtag);
    geoTagStore.addGeoTag(geoTag);

    res.location('/api/geotags/' + geoTag.id);
    res.json(JSON.stringify(geoTag));

  } catch (err) {
    console.error(err.message());
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id"', (req, res) => {
  
  try {    
    let id = req.params.id;
    let tag = geoTagStore.searchGeoTagById(id);

    res.json(JSON.stringify(tag));

  } catch (err) {
    console.error(err.message());
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id"', (req, res) => {
  
  try {    
    let id = req.params.id;
    let tag = geoTagStore.getGeoTagById(id);

    //res.json(JSON.stringify(tag));

  } catch (err) {
    console.error(err.message());
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id"', (req, res) => {
  
  try {    
    let id = req.params.id;
    geoTagStore.removeGeoTagById(id);

  } catch (err) {
    console.error(err.message());
  }
});

module.exports = router;
