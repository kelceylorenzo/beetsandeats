const { yelpApi } = require('./config/yelp');
const express = require('express');
const path = require('path');
const yelp = require('yelp-fusion');
const client = yelp.client(yelpApi);
const app = express();
// const cors = require('cors');
const PORT = process.env.PORT || 9001;

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/yelp_proxy', (req, res) => {
	const searchRequest = {
		term: req.query.term,
		latitude: req.query.latitude,
		longitude: req.query.longitude,
		radius: req.query.radius
	};
	client.search(searchRequest)
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
