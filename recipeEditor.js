import {
  getUserFS,
  addPrivateRecipe,
  getRecipeToOpen,
  getSaveFilePathToOpen,
} from "./localStorageManager.js";

console.log("recipeEditor.js loaded successfully!");

document.addEventListener("DOMContentLoaded", initListener);

const recipePath = getSaveFilePathToOpen();

console.log(recipePath);

const curRecipe = getRecipeToOpen() ?? {
  id: null,
  coverImage: "test_recipe.jpg",
  title: "Enter Recipe Title Here",
  foodName: "Enter Main Food Name",
  description: "Enter a brief description of the dish here...",
  prepTime: 0,
  cookTime: 0,
  rating: 0,
  ingredients: [{ name: "Ingredient Name", quantity: 0, unit: "Unit" }],
  instructions: ["Step 1: Enter your first cooking instruction here"],
  tags: ["e.g. Vegetarian"],
  servings: 1,
};

console.log(curRecipe);

let latestServings;

loadRecipeToHTML(curRecipe);

/**
 * Loads a recipe and populates the form fields
 * @param {object} curRecipe - The recipe to load
 */
function loadRecipeToHTML(curRecipe) {
  if (!curRecipe) return;

  // Load title
  document.getElementById("recipe-title-value").value = curRecipe.title || "";

  // Load cover image
  loadCoverToHTML(curRecipe);

  // Load rating
  loadRatingToHTML(curRecipe);

  // Load tags
  loadTagsToHTML(curRecipe);

  // Load cookTime
  document.getElementById("prep-time-value").value = curRecipe.prepTime || "";

  // Load prepareTime
  document.getElementById("cook-time-value").value = curRecipe.cookTime || "";

  // Load Servings
  loadServingsToHTML(curRecipe);

  // Load description
  document.getElementById("recipe-description-value").value =
    curRecipe.description || "";

  // Load ingredients
  loadIngredientsToHTML(curRecipe);

  // Load instructions
  loadInstructionsToHTML(curRecipe);
}

/**
 * Saves recipes by calling saveRecipe with current recipe ID
 */
function saveRecipes(e) {
  e.preventDefault();
  saveRecipe();
}

/**
 * Saves the current recipe form data to localStorage
 *
 */
function saveRecipe() {
  console.log(`Start saving recipe to localStorage...`);

  const recipe = {
    id: curRecipe.id ?? Date.now(),
    coverImage: document.getElementById("recipe-cover-img").src,
    title: document.getElementById("recipe-title-value").value,
    foodName: document.getElementById("recipe-title-value").value,
    description: document.getElementById("recipe-description-value").value,
    prepTime: parseInt(document.getElementById("prep-time-value").value) || 0,
    cookTime: parseInt(document.getElementById("cook-time-value").value) || 0,
    servings: parseInt(document.getElementById("servings-value").value) || 0,
    ingredients: [],
    instructions: [],
    rating:
      parseInt(document.querySelector('input[name="rating"]:checked')?.value) ||
      0,
    tags: [],
  };

  // Get tags - Convert HTMLCollection to Array first
  const tagsContainer = document.getElementById("tag-list");
  const tagDivs = Array.from(tagsContainer.children);
  tagDivs.forEach((div) => {
    const input = div.querySelector("input");
    if (input && input.value.trim() !== "") {
      recipe.tags.push(input.value);
    }
  });

  // Get ingredients - Convert HTMLCollection to Array first
  const ingredientsContainer = document.getElementById("ingredient-list");
  const ingredientDivs = Array.from(ingredientsContainer.children);
  ingredientDivs.forEach((div) => {
    const inputs = div.querySelectorAll("input");
    if (inputs.length >= 3) {
      const ingredient = {
        name: inputs[0].value,
        quantity: parseInt(inputs[1].value) || 0,
        unit: inputs[2].value,
      };
      recipe.ingredients.push(ingredient);
    }
  });

  // Get instructions - Convert HTMLCollection to Array first
  const instructionsContainer = document.getElementById("instruction-list");
  const instructionDivs = Array.from(instructionsContainer.children);
  instructionDivs.forEach((div) => {
    const textarea = div.querySelector("textarea");
    if (textarea && textarea.value.trim() !== "") {
      recipe.instructions.push(textarea.value);
    }
  });

  console.log(recipe);

  // Update or add recipe in localStorage
  addPrivateRecipe(recipe, recipePath, "user1", true);
}

/**
 * Adds a new tag input field to the tags list
 */
function addTagToHTML() {
  const listContainer = document.getElementById("tag-list");
  const tagDiv = createTagDiv();
  listContainer.appendChild(tagDiv);
}

/**
 * Adds a new ingredient item to HTML at the end of the ingredient list
 */
function addIngredientToHTML() {
  const ingredientsContainer = document.getElementById("ingredient-list");
  const ingredientDiv = createIngredientDiv();
  ingredientsContainer.appendChild(ingredientDiv);
}

/**
 * Adds a new instruction item to HTML at the end of the instruction list
 */
function addInstructionToHTML() {
  const instructionsContainer = document.getElementById("instruction-list");
  const instructionDiv = createInstructionDiv();
  instructionsContainer.appendChild(instructionDiv);
}

/**
 * Deletes a list item (ingredient, instruction, or tag) from the form
 * @param {Event} e - The click event
 */
function deleteListItem(e) {
  const itemDiv = e.target.parentElement;
  itemDiv.remove();
}

/**
 * Retrieves a recipe by its ID from localStorage
 * @param {number} id - The recipe ID to retrieve
 * @returns {Object|undefined} The recipe object if found, otherwise undefined
 */
function getRecipeById(id) {
  const storedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  const recipe = storedRecipes.find((recipe) => recipe.id === id);
  return recipe;
}

/**
 * Handles uploading a new cover image for the recipe
 */
function uploadNewCover() {
  const input = document.getElementById("cover-img-input");
  const file = input.files[0];
  const blobUrl = URL.createObjectURL(file);
  console.log(blobUrl);

  const recipeCover = document.getElementById("recipe-cover-img");
  recipeCover.style.display = "block";
  recipeCover.src = blobUrl;

  const coverImageInput = document.querySelector(".custum-file-upload");
  coverImageInput.style.height = "30%";
}

/**
 * Loads cover image to the HTML form
 * @param {Object} curRecipe - The current recipe object
 */
function loadCoverToHTML(curRecipe) {
  const recipeCover = document.getElementById("recipe-cover-img");
  const coverImageInput = document.querySelector(".custum-file-upload");
  if (curRecipe.coverImage) {
    recipeCover.src = curRecipe.coverImage;
    coverImageInput.style.height = "30%";
  } else {
    recipeCover.style.display = "none";
    coverImageInput.style.height = "100%";
  }
}

/**
 * Toggles the height of the image upload input area
 */
function changeImageInputHeight() {
  const coverImageInput = document.querySelector(".custum-file-upload");
  if (coverImageInput.style.height === "30%") {
    coverImageInput.style.height = "0%";
    coverImageInput.style.padding = "0";
    const uploadText = document.querySelector(".custum-file-upload .text span");
    uploadText.style.fontSize = "0";
  } else if (coverImageInput.style.height === "0%") {
    const uploadText = document.querySelector(".custum-file-upload .text span");
    uploadText.style.fontSize = "1rem";
    coverImageInput.style.padding = "1.5rem";
    coverImageInput.style.height = "30%";
  }
}

/**
 * Loads rating to the HTML form
 * @param {Object} curRecipe - The current recipe object
 */
function loadRatingToHTML(curRecipe) {
  const ratingInput = document.querySelector(
    `input[name="rating"][value="${curRecipe.rating || 0}"]`
  );
  if (ratingInput) {
    ratingInput.checked = true;
  }
}

/**
 * Loads tags to the HTML form
 * @param {Object} curRecipe - The current recipe object
 */
function loadTagsToHTML(curRecipe) {
  const tagsContainer = document.getElementById("tag-list");
  tagsContainer.innerHTML = "";

  if (curRecipe.tags && Array.isArray(curRecipe.tags)) {
    curRecipe.tags.forEach((tag) => {
      const tagDiv = createTagDiv(tag);
      tagsContainer.appendChild(tagDiv);
    });
  }
}

/**
 * Loads servings value to the HTML form and sets up change listener
 * @param {Object} curRecipe - The current recipe object
 */
function loadServingsToHTML(curRecipe) {
  const servingsContainer = document.getElementById("servings-value");
  servingsContainer.value = curRecipe.servings || 1;
  latestServings = curRecipe.servings || 1;
  servingsContainer.addEventListener("change", () => {
    latestServings = servingsContainer.value;
    updateIngredientQuantity(latestServings, curRecipe);
  });
}

/**
 * Loads ingredients to the HTML form
 * @param {Object} curRecipe - The current recipe object
 */
function loadIngredientsToHTML(curRecipe) {
  const ingredientsContainer = document.getElementById("ingredient-list");
  ingredientsContainer.innerHTML = "";

  curRecipe.ingredients.forEach((ingredient) => {
    const ingredientDiv = createIngredientDiv(ingredient);
    ingredientsContainer.appendChild(ingredientDiv);
  });
}

/**
 * Loads instructions to the HTML form
 * @param {Object} curRecipe - The current recipe object
 */
function loadInstructionsToHTML(curRecipe) {
  const instructionsContainer = document.getElementById("instruction-list");
  instructionsContainer.innerHTML = "";

  curRecipe.instructions.forEach((instruction) => {
    const instructionDiv = createInstructionDiv(instruction);
    instructionsContainer.appendChild(instructionDiv);
  });
}

/**
 * Creates a tag input div element
 * @param {string} tag - The tag value to pre-populate
 * @returns {HTMLElement} The created tag div element
 */
function createTagDiv(tag) {
  const tagDiv = document.createElement("div");
  tagDiv.className = "recipe-tag";

  const tagInput = document.createElement("input");
  tagInput.type = "text";
  tagInput.className = "tag-input";
  tagInput.placeholder = "new tag";
  tagInput.value = tag || "";
  tagDiv.appendChild(tagInput);

  const deleteBtn = document.createElement("div");
  deleteBtn.className = "delete-tag-btn";
  deleteBtn.onclick = deleteListItem;
  tagDiv.appendChild(deleteBtn);
  return tagDiv;
}

/**
 * Creates an ingredient input div element
 * @param {Object} ingredient - The ingredient object with name, quantity, and unit
 * @returns {HTMLElement} The created ingredient div element
 */
function createIngredientDiv(ingredient) {
  const ingredientDiv = document.createElement("div");
  ingredientDiv.className = "editor-card";

  const paddingDiv = document.createElement("div");
  paddingDiv.className = "card-padding";
  ingredientDiv.appendChild(paddingDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "card-content flex-space-between";
  ingredientDiv.appendChild(contentDiv);

  const inputDiv = document.createElement("div");
  inputDiv.className = "ingredient-inputs";
  contentDiv.appendChild(inputDiv);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Ingredient name";
  nameInput.className = "ingredient-name-input inline-input";
  nameInput.value = (ingredient && ingredient.name) || "";
  inputDiv.appendChild(nameInput);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "0";
  quantityInput.className = "ingredient-amount-input inline-input";
  quantityInput.value =
    (ingredient && ingredient.quantity * latestServings) || "";
  inputDiv.appendChild(quantityInput);

  const unitInput = document.createElement("input");
  unitInput.type = "text";
  unitInput.placeholder = "Unit";
  unitInput.className = "ingredient-unit-input inline-input";
  unitInput.value = (ingredient && ingredient.unit) || "";
  inputDiv.appendChild(unitInput);

  const deleteBtn = document.createElement("div");
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = deleteListItem;
  contentDiv.appendChild(deleteBtn);

  return ingredientDiv;
}

/**
 * Creates an instruction input div element
 * @param {string} instruction - The instruction text to pre-populate
 * @returns {HTMLElement} The created instruction div element
 */
function createInstructionDiv(instruction) {
  const instructionDiv = document.createElement("div");
  instructionDiv.className = "editor-card";

  const paddingDiv = document.createElement("div");
  paddingDiv.className = "card-padding";
  instructionDiv.appendChild(paddingDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "card-content flex-space-between";
  instructionDiv.appendChild(contentDiv);

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Instruction step";
  textarea.className = "instruction-input";
  textarea.textContent = instruction || "";
  contentDiv.appendChild(textarea);

  const deleteBtn = document.createElement("div");
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = deleteListItem;
  contentDiv.appendChild(deleteBtn);

  return instructionDiv;
}

/**
 * Updates ingredient quantities based on servings change
 * @param {number} newServings - The new number of servings
 * @param {Object} curRecipe - The current recipe object
 */
function updateIngredientQuantity(newServings, curRecipe) {
  const ingredientAmounts = document.querySelectorAll(
    ".ingredient-amount-input"
  );
  curRecipe.ingredients.forEach((ingredient, i) => {
    ingredientAmounts[i].value = newServings * ingredient.quantity;
  });
}

function initListener() {
  document
    .getElementById("adding-tag-btn")
    .addEventListener("click", addTagToHTML);

  document
    .getElementById("right-panel")
    .addEventListener("click", changeImageInputHeight);

  document
    .getElementById("cover-img-input")
    .addEventListener("change", uploadNewCover);

  document
    .getElementById("adding-instruction-btn")
    .addEventListener("click", addInstructionToHTML);

  document
    .getElementById("adding-ingredient-btn")
    .addEventListener("click", addIngredientToHTML);

  document.getElementById("save-btn").addEventListener("click", saveRecipes);
}
