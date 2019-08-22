const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const config = require('../config');
const algoliasearch = require('algoliasearch/lite');
const client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
const index = client.initIndex(process.env.indexName);

router.get('/:lang/search', (req, res, next) => {

    const term = req.query.searchtext;

    index.search({
            query: term,
            filters: `language:${app.get('currentCulture')}`
        }, (err, { hits } = {}) => {
            if (err) throw err;

            res.render('search', {
                'hits': hits,
                'term': term
                }, (err2, html) => {
                    if (err2) {
                        next(err2);
                    }
                    else {
                        res.send(html);
                        res.end();
                    }
                });
        });
});

module.exports = router;