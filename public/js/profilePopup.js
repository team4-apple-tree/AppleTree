const openModal = document.getElementById('pwChange');
const modal = document.getElementById('modal');
const closeBtn = modal.querySelector(".close-area")

openModal.addEventListener('click',() => {
        modal.style.display = 'block';
    }
)

closeBtn.addEventListener("click", e => {
    modal.style.display = "none"
});