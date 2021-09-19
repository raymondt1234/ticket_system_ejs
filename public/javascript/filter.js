$(document).ready(() => {
    $("#categorySelect").change(() => {
        let category = $(".form-select option:selected").val();

        if (category !== "None") {
            $(`tr.ticket[data-category!='${category}']`).hide();
            $(`tr.ticket[data-category='${category}']`).show();
        } else {
            $("tr.ticket").show();
        }
    });

    $('input[type=radio][name=options]').change(function() {
        if (this.id === "all") {
            $("tr.ticket").show();
            console.log(`${this.id} Show all tickets`);
        } else if (this.id === "open") {
            $("tr.open").show();
            $("tr.closed").hide();
            console.log(`${this.id} Show open tickets`);
        } else if (this.id === "closed") {
            $("tr.open").hide();
            $("tr.closed").show();
            console.log(`${this.id} Show closed tickets`);
        }
    });
});