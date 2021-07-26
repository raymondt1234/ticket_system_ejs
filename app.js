const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
require("dotenv").config();

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ticketDB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false, });

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

const ticketCategoriesSchema = {
    category: String
}

const TicketCategory = mongoose.model("TicketCategory", ticketCategoriesSchema);

// Create default Ticket Categories

const category1 = new TicketCategory({ category: "Broken/Missing Feature" });
const category2 = new TicketCategory({ category: "Broken Page" });
const category3 = new TicketCategory({ category: "General" });

const defaultCategories = [category1, category2, category3];

let defaultCategoriesAdded = false;

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
    Ticket.findOne({ _id: `${req.body.ticketId}` }, (error, ticket) => {
        if (error) {
            console.log(error);
        } else {
            res.render("viewTicket", { ticket: ticket });
        }
    });
});

app.get("/submitTicket", (req, res) => {
    TicketCategory.find({}, (error, categories) => {
        if (error) {
            console.log(error);
        } else {
            res.render("submitTicket", { categories: categories });
        }
    });
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

app.get("/categories", (req, res) => {
    // Check if any categories exist
    TicketCategory.find({}, (error, currentCategories) => {

        if (error) {
            console.log(error);
        } else {

            // If no categories exist add the default categories
            if (currentCategories.length === 0 && !defaultCategoriesAdded) {
                TicketCategory.insertMany(defaultCategories, error => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Default categories added.");
                        defaultCategoriesAdded = true;
                    }
                });
                res.redirect("/categories");
            } else {
                res.render("categories", { categories: currentCategories });
            }
        }
    });
});

app.post("/addCategory", (req, res) => {
    TicketCategory.create({ category: req.body.newCategory }, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Category: ${req.body.newCategory} added.`);
        }
    });
    res.redirect("/categories");
});

app.post("/removeCategory", (req, res) => {
    TicketCategory.findByIdAndDelete(req.body._id, (error, category) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Category: ${category.category} removed.`);
        }
    });
    res.redirect("/categories");
});

app.post("/closeTicket", (req, res) => {
    Ticket.findOneAndUpdate({ _id: `${req.body.ticketId}` }, { closedBy: req.body.closedBy, dateTimeClosed: new Date(), solution: req.body.solution }, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/viewTickets");
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://${host}:${port}`);
});