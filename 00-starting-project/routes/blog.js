const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function(req, res) {
 res.redirect('/posts');
});

router.get('/posts', function(req, res) {
    db.query('SELECT * FROM posts INNER JOIN authors ON posts.author_id = authors.id')
    res.render('posts-list');
});

router.get('/new-post', async function(req, res) {
    const [authors] = await db.query('SELECT * FROM authors');
    res.render('create-post', {authors: authors});
});

router.post('/posts', async function(req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,
    ];
    await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]); //will replace the question mark with the array values we insert
    res.redirect('/posts'); //redirect to all posts page after a new post is created
});

module.exports = router;