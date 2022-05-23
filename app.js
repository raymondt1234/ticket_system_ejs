const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const host = process.env.HOST;
const port = process.env.PORT;
const username = process.env.DBUSERNAME;
const password = process.env.PASSWORD;
const mongodbServer = process.env.MONGODB_URI || `mongodb+srv://${username}:${password}@cluster0.7bko6.mongodb.net/ticketDB?retryWrites=true&w=majority`;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect(mongodbServer, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false, });


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

// Insert default Ticket Categories into the Database if none have been added before
TicketCategory.find({}, (error, categories) => {
    if (error) {
        console.log(error);
    } else {
        if (categories.length === 0) {
            TicketCategory.insertMany(defaultCategories, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Default categories added.");
                }
            });
        }
    }
});

app.get("/", (req, res) => {
    res.redirect("/viewTickets");
});

app.get("/viewTickets", (req, res) => {
    Ticket
        .find({}, (error, tickets) => {
            if (error) {
                console.log(error);
            } else {
                TicketCategory.find({}, (error, categories) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.render("viewTickets", { tickets, categories });
                    }
                });
            }
        })
        .sort({ "dateTimeSubmitted": -1 });
});

app.get("/viewTicket/:id", (req, res) => {
    const { id } = req.params;
    Ticket.findOne({ _id: id }, (error, ticket) => {
        if (error) {
            console.log(error);
        } else {
            res.render("viewTicket", { ticket });
        }
    });
});

app.get("/submitTicket", (req, res) => {
    TicketCategory.find({}, (error, categories) => {
        if (error) {
            console.log(error);
        } else {
            res.render("submitTicket", { categories });
        }
    });
});

app.post("/submitTicket", (req, res) => {
    const { subject, category, priority, submittedBy } = req.body;
    const ticket = new Ticket({
        subject: subject,
        category: category,
        priority: priority,
        submittedBy: submittedBy,
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
    TicketCategory.find({}, (error, categories) => {

        if (error) {
            console.log(error);
        } else {
            res.render("categories", { categories });
        }
    });
});

app.post("/addCategory", (req, res) => {
    const { newCategory } = req.body;
    TicketCategory.create({ category: newCategory }, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Category: ${newCategory} added.`);
        }
    });
    res.redirect("/categories");
});

app.post("/removeCategory", (req, res) => {
    const { ticketId } = req.body;
    TicketCategory.findByIdAndDelete(ticketId, (error, category) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Category: ${category.category} removed.`);
        }
    });
    res.redirect("/categories");
});

app.post("/closeTicket", (req, res) => {
    const { ticketId, closedBy, solution } = req.body;
    Ticket.findOneAndUpdate({ _id: `${ticketId}` }, { closedBy: closedBy, dateTimeClosed: new Date(), solution: solution }, (error, result) => {
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