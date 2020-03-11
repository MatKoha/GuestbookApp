var fs = require('fs');
var express = require('express');
var app = express();

// Require the module required for using form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public/demosite/'));
app.use(bodyParser.json());

// Serve a form to the user
app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname + '/public/demosite/newmessage.html');
});

// Serve an AJAX form to the user
app.get('/ajaxmessage', function (req, res) {
    res.sendFile(__dirname + '/public/demosite/ajaxmessage.html');
});

// Parse out the details of the guestbook
app.get('/guestbook', function (req, res) {
    var data = require('./exampledata2.json');

    // Parse the results into a variable
    var results = `
    <!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<title>New message</title>
	<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>

<body>
	<div id="wrapper">
		<div id="branding">
            <h1 class="logo"><a href="/">Guestbook App</a></h1>
			<ul class="topNav">
				<li><a href="/">HOME</a></li>
                <li><a href="/newmessage">ADD MESSAGE</a></li>
                <li><a href="/ajaxmessage">AJAX MESSAGE</a></li>
				<li><a href="/guestbook" class="topNavAct topNavLast">VIEW GUESTBOOK</a></li>
			</ul><br class="clear" />
		</div>
   <table class="guestBook">
    <thead>
    <tr>
    <th>Name</th>
    <th>Country</th>
    <th>Message</th>
    </tr>
    </thead>
    <tbody>`;

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
        </div>
        <div id="footerContainer">
        <p>
	    <label>Designed by <a href="https://github.com/BuluMatziel">Matias Kohanevic</a></label>
		<span>The GuestBook App 2020. All Rights Reserved</span>
	    </p>
        </div>
        </body>
        </html>
        `);
});

// Add data
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