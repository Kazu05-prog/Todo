const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP MySQL user
    password: '', // Default XAMPP MySQL password
    database: 'ce_chores_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// Get all chores
app.get('/', (req, res) => {
    db.query('SELECT * FROM chores ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error fetching chores:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('index', { chores: results });
    });
});

// Add a new chore
app.post('/add', (req, res) => {
    const { task } = req.body;
    if (task) {
        db.query('INSERT INTO chores (task) VALUES (?)', [task], (err, result) => {
            if (err) {
                console.error('Error adding chore:', err);
                res.status(500).send('Error adding data');
                return;
            }
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

// Toggle chore completion
app.post('/toggle/:id', (req, res) => {
    const choreId = req.params.id;
    db.query('UPDATE chores SET completed = NOT completed WHERE id = ?', [choreId], (err, result) => {
        if (err) {
            console.error('Error toggling chore:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.redirect('/');
    });
});

// Delete a chore
app.post('/delete/:id', (req, res) => {
    const choreId = req.params.id;
    db.query('DELETE FROM chores WHERE id = ?', [choreId], (err, result) => {
        if (err) {
            console.error('Error deleting chore:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});