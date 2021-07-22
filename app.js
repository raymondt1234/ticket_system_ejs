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

// useFindAndModify set to false so findOneAndUpdate will work without deprecation warnings
mongoose.set('useFindAndModify', false);

const ticketsSchema = {
    subject: String,
    category: String,
    priority: String,
    submittedBy: String,
    dateTimeSubmitted: Date,
    closedBy: String,
    dateTimeClosed: Date,
    solution: String
}

const Ticket = mongoose.model("Ticket", ticketsSchema);


app.get("/", (req, res) => {
    res.redirect("/viewTickets");
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

app.post("/viewTickets", (req, res) => {
    Ticket.findOne({_id: `${req.body.ticketId}`}, (error, ticket) => {
        if (error) {
            console.log(error);
        } else {
            res.render("viewTicket", { ticket: ticket });
        }
    });
});

app.get("/submitTicket", (req, res) => {
    res.render(`${__dirname}/views/submitTicket`);
});

app.post("/submitTicket", (req, res) => {
    const ticket = new Ticket({
        subject: req.body.subject,
        category: req.body.category,
        priority: req.body.priority,
        submittedBy: req.body.submittedBy,
        dateTimeSubmitted: new Date(),
        closedBy: "",
        dateTimeClosed: "",
        solution: ""      
    });

    ticket.save();
    res.redirect("/");

});

app.post("/closeTicket", (req, res) => {
    Ticket.findOneAndUpdate({_id: `${req.body.ticketId}`}, {closedBy: req.body.closedBy, dateTimeClosed: new Date(), solution: req.body.solution}, (error, result) => {
        if(error) {
            console.log(error);
        } else {
            res.redirect("/viewTickets");
        }
    });
});

app.listen(3000, () => {
    console.log("Server listening at http://localhost:3000");
});