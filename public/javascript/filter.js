$(document).ready(() => {
    // click to view a specific ticket
    const table = document.querySelector("table");
    table.addEventListener("click", (event) => {
        let ticketId = event.target.parentElement.id;
        if (ticketId) {
            window.location.href = `/viewTicket/${ticketId}`;
        }
    });

    $("#categorySelect").change(() => {
        // The current category to be filtered
        let category = $(".form-select option:selected").val();

        if (category !== "None") {
            $(`tr.ticket[data-category!='${category}']`).hide();
            $(`tr.ticket[data-category='${category}']`).show();
        } else {
            $("tr.ticket").show();
        }
    });

    $('input[type=radio][name=options]').change(function () {
        if (this.id === "all") {
            $("tr.ticket").show();
        } else if (this.id === "open") {
            $("tr.open").show();
            $("tr.closed").hide();
        } else if (this.id === "closed") {
            $("tr.open").hide();
            $("tr.closed").show();
        }
    });
});