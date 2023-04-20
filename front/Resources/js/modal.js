const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
const closeModalBtn = document.getElementById("closeModalBtn");

// Open the modal
function openModal() {
  modal.style.display = "block";
}

// Close the modal
function closeModal() {
  modal.style.display = "none";
}

// Close the modal when the user clicks the close button
closeBtn.addEventListener("click", closeModal);

// Close the modal when the user clicks the close modal button
closeModalBtn.addEventListener("click", closeModal);

// Close the modal when the user clicks outside the modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

export { openModal, closeModal };