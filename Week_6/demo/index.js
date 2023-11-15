const express = require("express"); 
const app = express(); 

require('dotenv').config(); 
app.use(express.json()); 

const validateTweetLength = (req, res, next) => {
    const tweet = req.body.tweet; 
    if(tweet.length <= 100) {
        next(); 
    } else {
        res.status(400).json({error: "Tweet too long"}); 
    }
}

const tweets = [
    {
        id: 1, 
        user: "Andromious", 
        tweet: "Hello"
    }
]

app.get('/', (req, res) => {
    res.send("Hello World"); 
}); 

app.get('/api/tweets', (req, res) => {
    res.send(tweets); 
}); 

app.get('/api/tweets/:user', (req,res) => {
    var target = tweets.find(t => t.user === req.params.user); 
    if(!target) {
        res.status(404).send("no tweet found");
    } else {
        res.send(target); 
    }
}); 

app.post('api/tweets', validateTweetLength, (req, res) => {
    var tweet = {
        id: tweets.length + 1, 
        user: req.body.user, 
        tweet: req.body.tweet
    }; 
    tweets.push(tweet); 
    res.send(tweet); 
})

const port = process.env.PORT || 3001; 
app.listen(port, () => console.log(`listening on port ${port} `)); 