
$("#year").text(new Date().getFullYear());

$("#burger").on("click", function () {
    $("#mobileMenu").toggleClass("hidden");
});

$("#mobileMenu a").on("click", function () {
    $("#mobileMenu").addClass("hidden");
});


$("a[href^='#']").on("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
        e.preventDefault();
        const offset = target.offset().top - 72;
        $("html, body").stop().animate({ scrollTop: offset }, 500);
    }
});

function handleReveal() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    $(".reveal").each(function () {
        const rect = this.getBoundingClientRect();
        const visible = rect.top < vh - 80 && rect.bottom > 80;
        const mostlyOut = rect.top > vh || rect.bottom < 0;

        if (visible) {
            this.classList.add("show");
            this.classList.remove("out");
        } else if (mostlyOut) {
            this.classList.remove("show");
            this.classList.add("out");
        }
    });
}

$(window).on("load scroll resize", handleReveal);