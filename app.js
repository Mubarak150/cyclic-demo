// requiring dependencies: 
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const client = require("@mailchimp/mailchimp_marketing");
const fs = require('fs');

const app = express(); 
app.use(express.static("public")); // a public folder to load all the static files and entities like imgs
app.use(bodyParser.urlencoded({extended: true}));

// GET for the form:
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
})

// POST for the form : 
app.post("/", function(req, res){
    var firstName = req.body.firstname;
    var lastName = req.body.lastname; 
    var email = req.body.email; 

    client.setConfig({
        apiKey: "0b9455b943e6fa96f1d85b9f026ae200-us21",
        server: "us21",
        });
    
        const run = async () => {
        const response = await client.lists.batchListMembers("52d27cd10a", {
            members: [{
                "email_address": email,
                "merge_fields": {
                    "FNAME": firstName,
                    "LNAME": lastName
                },
                "status": 'subscribed'
            }],
        });
        if(response.errors[0] ) {
            console.log("THE FOLLOWIND ERROR OCCURED: ");
            console.log(response.errors[0].error);
            res.sendFile(__dirname + "/failure.html")
            
        } else {
            res.sendFile(__dirname + "/success.html")
        }
        
        };
    
        run();
    
    
})

app.post('/failure', function(req, res) {
    res.redirect('/')
})

// key: 0b9455b943e6fa96f1d85b9f026ae200-us21,  name: first-key
// list_id: 52d27cd10a
app.listen(process.env.PORT || 3000, function(){
    console.log("server is listening at port 3000")
}) 