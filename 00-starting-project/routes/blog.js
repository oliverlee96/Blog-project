const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function(req, res) {
 res.redirect('/posts');
});

router.get('/posts', async function(req, res) {
    const query = `
    SELECT posts.*,authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
    `;
    const [posts] = await db.query(query); //remember that query returns array with 2 items
    res.render('posts-list', {posts: posts});
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

router.get('/posts/:id', async function (req, res) {
    const query = `SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?`;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0 ) {
       return res.status(404).render('404');
    }

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            date: 'numeric'
        })
    };

    res.render('post-detail', { post: postData});
});

module.exports = router;