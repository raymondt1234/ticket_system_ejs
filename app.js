const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/ticketDB", { useNewUrlParser: true, useUnifiedTopology: true });

const ticketsSchema = {
    submittedBy: String,
    closedBy: String,
    category: String,
    dateTimeSubmitted: Date,
    subject: String,
    solution: Array
}

// const ticketQueueSchema = {
//     name: String,
//     tickets: [ticketsSchema]
// }

const Ticket = mongoose.model("Ticket", ticketsSchema);
// const TicketQueue = mongoose.model("TicketQueue", ticketQueueSchema);



app.get("/", (req, res) => {
    res.render(`${__dirname}/views/index`);
});

app.get("/submitTicket", (req, res) => {
    res.render(`${__dirname}/views/submitTicket`);
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

    console.log(ticket);

    ticket.save();
    res.redirect("/");

});

app.listen(3000, () => {
    console.log("Server listening at http://localhost:3000");
});