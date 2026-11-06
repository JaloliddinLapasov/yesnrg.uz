
// Joriy yilni avtomatik chiqarish
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// Mobil menyu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
});


// Menyudagi havolani bosganda menyuni yopish
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("active");
    });
});


// Aloqa formasi
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = formData.get("name");
    const phone = formData.get("phone");

    if (!name || !phone) {
        formMessage.textContent = "Iltimos, barcha majburiy maydonlarni to‘ldiring.";
        return;
    }

    formMessage.textContent =
        "Rahmat! Demo forma qabul qilindi. Tez orada siz bilan bog‘lanamiz.";

    contactForm.reset();
});
