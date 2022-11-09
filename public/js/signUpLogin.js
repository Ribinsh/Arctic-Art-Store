
const forms = document.querySelector(".forms"),
links = document.querySelectorAll(".link");



links.forEach(link => {
link.addEventListener("click", e => {
e.preventDefault();
forms.classList.toggle("show-signup");
})
})