const express = require("express");
const path = require("path");
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "index.html"))
})

app.get('/info',(req,res)=>{
    res.sendFile(path.join(__dirname,"public", "info.html"))
})

app.get('/game', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "easy-game.html"))
})

app.get('/difficulty', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "difficulty.html"))
})

app.get('/game-easy', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "easy-game.html"))
})

app.get('/game-medium', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "medium-game.html"))
})

app.get('/game-hard', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "hard-game.html"))
})

app.get('/win',(req,res)=>{
    res.sendFile(path.join(__dirname,"public", "win.html"))
})
app.listen(PORT,()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
})