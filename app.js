const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});


mongoose.connect("mongodb://localhost:27017/ticketDB", { useNewUrlParser: true, useUnifiedTopology: true });

const ticketsSchema = {
    submittedBy: String,
    closedBy: String,
    category: String,
    dateTimeSubmitted: Date,
    subject: String,
    solution: Array
}

const Ticket = mongoose.model("Ticket", ticketsSchema);


app.get("/", (req, res) => {
    res.render(`${__dirname}/views/index`);
});



app.get("/viewTickets", (req, res) => {
    Ticket.find({}, (error, tickets) => {
        if (error) {
            console.log(error);
        } else {
            res.render("viewTickets", { tickets: tickets });
        }
    });
});

app.get("/submitTicket", (req, res) => {
    res.render(`${__dirname}/views/submitTicket`);
});

app.post("/viewTicket", (req, res) => {
    Ticket.findOne({_id: `${req.body.ticketId}`}, (error, ticket) => {
        if (error) {
            console.log(error);
        } else {
            console.log(ticket);
            res.render("viewTicket", { ticket: ticket });
        }
    });
});

app.post("/submitTicket", (req, res) => {
    const ticket = new Ticket({
        submittedBy: req.body.submittedBy,
        closedBy: "",
        category: req.body.category,
        dateTimeSubmitted: new Date(),
        subject: req.body.subject,
        solution: ""
    });

    ticket.save();
    res.redirect("/");

});

app.listen(3000, () => {
    console.log("Server listening at http://localhost:3000");
});