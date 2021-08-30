$(document).ready(() => {
    $(".form-select").change(() => {
        let category = $(".form-select option:selected").val();

        if (category !== "None") {
            $(`tr.ticket[data-category!='${category}']`).hide();
            $(`tr.ticket[data-category='${category}']`).show();
        } else {
            $("tr.ticket").show();
        }
    });
});