const env = require("dotenv").config();
const express = require("express");
const request = require("request");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const {
    response
} = require("express");



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/portfolio", function (req, res) {
    res.render("portfolio");
});
app.get("/single-blog", function (req, res) {
    res.render("single-blog");
});
app.get("/services", function (req, res) {
    res.render("services");
});

app.get("/elements", function (req, res) {
    res.render("elements");
});









app.get("/fail", function (req, res) {
    res.render("fail");
});

app.get("/mailchimp", function (req, res) {
    res.render("mailchimp");
});
app.get("/success", function (req, res) {
    res.render("success");
});

// Contact Route
app.post("/contact", function (req, res) {

    const output = `
  <p>Vous avez un nouveau message</p>
    <h3>Informations Du Contact</h3>
    <ul>
        <li>Prénom : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Subject : ${req.body.subject}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
  `;
    "use strict";

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL, // generated ethereal user
                pass: process.env.GMAIL_PASS // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: req.body.email, // sender address
            to: process.env.GMAIL_EMAIL, // list of receivers
            subject: "Message Venant Du Site", // Subject line
            text: "Hello World", // plain text body
            html: output, // html body
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render('index');
    }

    main().catch(console.error);    

});

// Mailchimp Area
app.post("/mailchimp", function (req, res) {

    const {
        mail, fullName
    } = req.body;

    if (!mail || ! fullName) {
        res.redirect('about');
        return;
    }

    const data = {
        members: [{
            email_address: mail,
            status: 'subscribed',
             merge_fields: {
               FNAME: fullName
             //   LNAME: lastName
             }

        }]
    }

    const postData = JSON.stringify(data);
 
    const options = {
        url: 'https://us10.api.mailchimp.com/3.0/lists/27134ea02d',
        method: 'POST',
        headers: {
            Authorization: 'auth 5a6a7bafba2ff3508b55711f3e0d79f6-us10',
        },
        body: postData
    };

    request(options, function (err, response, body) {
        if (err) {
            res.redirect('about');
        } else {
            if (response.statusCode === 200) {
                res.redirect('portfolio');
            } else {

                res.redirect("about");

            }
        }
    });
});















const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server is running on port " + "" + PORT);
});