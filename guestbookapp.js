var fs = require('fs');
var express = require('express');
var app = express();
const PORT = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// Require the module required for using form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public/demosite/'));
app.use(bodyParser.json());

// Render index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

// Render new message page
app.get('/newmessage', function (req, res) {
    res.render('pages/newmessage');
});

// Serve an AJAX form to the user
app.get('/ajaxmessage', function (req, res) {
    res.render('pages/ajaxmessage');
});

// Render the guestbook page
app.get('/guestbook', function (req, res) {
    var data = {
        messages: require('./exampledata2.json')
    };
    res.render('pages/guestbook', data);
});

// Add data to the json file
app.post('/newmessage', function (req, res) {
    // Load the existing data from a file
    var data = require('./exampledata2.json');

    // Create a new JSON object and add it to the existing data variable
    data.push({
        "Name": req.body.Name,
        "Country": req.body.Country,
        "Message": req.body.Message,
        "Date": new Date()
    });

    // Convert the JSON object to a string format
    var jsonStr = JSON.stringify(data);

    // Write data to a file
    fs.writeFile('exampledata2.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });

    res.sendFile(__dirname + '/public/demosite/newmessage.html');
});

app.listen(PORT, function () {
    console.log('Example app listening on port 8080!');
});

// POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/ajaxmessage", function (req, res) {
    // Load the existing data from a file
    var data = require('./exampledata2.json');
    // Create a new JSON object and add it to the existing data variable
    data.push(
        req.body
    );
    // Convert the JSON object to a string format
    var jsonStr = JSON.stringify(data);

    // Write data to a file
    fs.writeFile('exampledata2.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });

    console.log(req.body);
    var name = req.body.Name;
    var country = req.body.Country;
    var message = req.body.Message;

    var results =
        `
    <table class="guestBook">
    <thead>
    <tr>
    <th>Name</th>
    <th>Country</th>
    <th>Message</th>
    </tr>
    </thead>
    <tbody>
    `;
    for (var i = 0; i < data.length; i++) {
        results +=
            '<tr>' +
            '<td>' + data[i].Name + '</td>' +
            '<td>' + data[i].Country + '</td>' +
            '<td>' + data[i].Message + '</td>' +
            '</tr>';
    }

    res.send(results +=
        `
        </tbody>
        </table>
        `);
});