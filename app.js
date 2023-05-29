const mysql = require('mysql')

const cors = require('cors')
const express = require('express');

const fs = require('fs')

const app = express();
app.use(cors())


const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345'
})

connection.connect((err) => {
    if (err) throw new Error(err)
    console.log("connected")
    connection.query('CREATE DATABASE IF NOT EXISTS mydb', (err) => {
        if (err) throw new Error(err)
        console.log("Database Created/exists")
        connection.changeUser({ database: 'mydb'}, () => {
            if (err) throw new Error(err)
            createTable()
        })
    })
})

function createTable() {
    connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        nome VARCHAR(100),
        photo LONGBLOB
    )`, (err) => {
        if (err) throw new Error(err)
        console.log("Table Created/exists")
    })
}

app.get('/api', (req, res) => {
    connection.query('SELECT photo FROM users WHERE id = 1', (err, result) => {
        if (err) throw new Error(err)
        res.set("content-disposition", 'inline; filename=' + "EU.jpg")
        res.set("content-Type", "EU.jpg")
        res.send(result[0].photo)
    })
})


app.post('/api', (req, res) => {
    connection.query('INSERT INTO users SET ?', {
        nome: 'Emmanuel',
        photo: Buffer.from(fs.readFileSync('./EU.jpg')),
    }, (err) => {
        if (err) throw new Error(err)
        console.log("1 record inserted")
        res.end()
    })
})


app.put('/api', (req, res) => {
    connection.query('UPDATE users SET ? WHERE id = 1', {
        nome: 'Martonio',
        photo: Buffer.from(fs.readFileSync('./EU.jpg')),
    }, (err) => {
        if (err) throw new Error(err)
        console.log("1 record updated")
        res.end()
    })
})

app.delete('/api', (req, res) => {
    connection.query('DELETE FROM users WHERE id = 2', (err) => {
        if (err) throw new Error(err)
        console.log("1 record deleted")
        res.end()
    })
})




app.listen(3000)