const { yelpApi } = require('./config/yelp');
const express = require('express');
const path = require('path');
const yelp = require('yelp-fusion');
const client = yelp.client(yelpApi);
const app = express();
const PORT = process.env.PORT || 9001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client')));

function termTest(req) {
	let pattern = /food|bar/g;
	if (pattern.test(req.query.term)) {
		var term = req.query.term;
	}
	return term;
}

function latitudeTest(req) {
	let pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,10}/;
	if (pattern.test(req.query.latitude)) {
		var latitude = req.query.latitude;
	}
	return latitude;
}

function longitudeTest(req) {
	let pattern = /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,10}/;
	if (pattern.test(req.query.longitude)) {
		var longitude = req.query.longitude;
	}
	return longitude;
}

function radiusTest(req) {
	let pattern = /^[0-9]{5}$/;
	if (pattern.test(req.query.radius)) {
		var radius = req.query.radius;
	}
	return radius;
}

app.get('/yelp_proxy', (req, res) => {
	const searchRequest = {
		term: req.query.term,
		latitude: req.query.latitude,
		longitude: req.query.longitude,
		radius: req.query.radius
	};
	client
		.search(searchRequest)
		.then((response) => {
			const firstResult = response.jsonBody.businesses;
			const prettyJson = JSON.stringify(firstResult, null, 4);
			res.send(prettyJson);
		})
		.catch((e) => {
			console.log(e);
		});
});

app.listen(PORT, () => {
	console.log('Server connected on ', PORT);
});
