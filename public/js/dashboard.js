const newPostButton = document.querySelector(".new-post-button");
const articleElement = document.querySelector(".sample-img");
const createButton = document.querySelector("#crate");

newPostButton.addEventListener("click", () => {
  articleElement.classList.remove("d-none");
});
