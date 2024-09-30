const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if the DB works
db.connect((err) => {
    if (err) return console.log("Error connecting to MYSQL", err);
    console.log("Connected to MYSQL as id: ", db.threadId); 
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.render('data', { title: 'Patients List', results: results });
        }
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.render('data', { title: 'Providers List', results: results });
        }
    });
});

// 3. Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.firstName;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error filtering patients');
        } else {
            res.render('data', { title: `Patients with First Name: ${firstName}`, results: results });
        }
    });
});

// 4. Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers by specialty');
        } else {
            res.render('data', { title: `Providers with Specialty: ${specialty}`, results: results });
        }
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    app.get('/', (req, res) => {
        res.redirect('/patients')
        
        ;
    });
});
