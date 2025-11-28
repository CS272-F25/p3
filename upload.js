// upload.js
// This java script handles:
// 1) Reading the selected .txt file
// 2) Parsing its content into a recipe object
// 3) Saving the recipe into localStorage (localData.recipes)
// 4) Showing success / error messages on the page

// -------------------------------
// 1. Sync localData with localStorage
// -------------------------------
// localData is defined in localStorageManager.js as:
// localData = { update this please, refer to localStorageManager.js for its structure}

//TODO: update localData structure
(function initializeLocalData() {
  const saved = localStorage.getItem("localData");
  if (saved) {
    // If we already have data saved, use it
    try {
      localData = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved localData. Resetting.", e);
      localData = { recipes: [] };
      localStorage.setItem("localData", JSON.stringify(localData));
    }
  } else {
    // No saved data yet: initialize from the global localData object
    localStorage.setItem("localData", JSON.stringify(localData));
  }
})();

// -------------------------------
// 2. Get DOM elements
// -------------------------------
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

// -------------------------------
// 3. Button click handler
// -------------------------------
uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];

  // Check: did user choose a file?
  if (!file) {
    showError("Please choose a .txt file first.");
    return;
  }

  // Check: is the file extension .txt ?
  if (!file.name.toLowerCase().endsWith(".txt")) {
    showError("Error: Uploaded file must be a .txt file.");
    return;
  }

  clearMessage();
  uploadStatus.textContent = "Reading file...";

  // Create a temporary URL for the file and read it with fetch()
  const fileURL = URL.createObjectURL(file);

  fetch(fileURL)
    .then((response) => response.text())
    .then((text) => {
      // text = full content of the .txt file as a string
      console.log("File content:\n", text);

      // Parse txt content into a recipe object
      const newRecipe = parseTxtToRecipe(text);

      // Save recipe into localData + localStorage
      saveRecipe(newRecipe);

      uploadStatus.style.color = "green";
      uploadStatus.textContent = "Recipe uploaded successfully!";
    })
    .catch((error) => {
      console.error("Error reading file:", error);
      showError("Error: Failed to read the file.");
    });
});

// -------------------------------
// 4. Helper functions for messages
// -------------------------------

function showError(message) {
  uploadStatus.style.color = "red";
  uploadStatus.textContent = message;
}

function clearMessage() {
  uploadStatus.style.color = "";
  uploadStatus.textContent = "";
}

// -------------------------------
// 5. Parse TXT -> recipe object
// -------------------------------
//
// Expected text format example:
//
// Title: Tomato Egg
// FoodName: Tomato Egg Stir Fry
// Description: A classic Chinese home-style dish.
// PrepTime: 5
// CookTime: 10
// Servings: 2
// CoverImage: https://example.com/tomato-egg.jpg
//
// Ingredients:
// egg,2,pcs
// tomato,1,whole
// salt,1,tsp
//
// Instructions:
// Beat the eggs.
// Cut the tomatoes.
// Fry everything together.
//

function parseTxtToRecipe(text) {
  // Split file into lines and trim whitespace
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  // Create a new recipe object with the same shape as in recipe.js
  const r = {
    id: Date.now(),        // simple unique id
    coverImage: undefined,
    title: undefined,
    foodName: undefined,
    description: undefined,
    prepTime: undefined,
    cookTime: undefined,
    servings: undefined,
    ingredients: [],
    instructions: [],
  };

  let mode = ""; // "", "ingredients", or "instructions"

  for (const line of lines) {
    // Skip empty lines
    if (line.length === 0) {
      continue;
    }

    // 5.1 Basic fields of recipe (Key: Value style)
    if (line.startsWith("Title:")) {
      r.title = line.replace("Title:", "").trim();
      continue;
    }

    if (line.startsWith("FoodName:")) {
      r.foodName = line.replace("FoodName:", "").trim();
      continue;
    }

    if (line.startsWith("Description:")) {
      r.description = line.replace("Description:", "").trim();
      continue;
    }

    if (line.startsWith("PrepTime:")) {
      const value = line.replace("PrepTime:", "").trim();
      r.prepTime = parseInt(value, 10);
      continue;
    }

    if (line.startsWith("CookTime:")) {
      const value = line.replace("CookTime:", "").trim();
      r.cookTime = parseInt(value, 10);
      continue;
    }

    if (line.startsWith("Servings:")) {
      const value = line.replace("Servings:", "").trim();
      r.servings = parseInt(value, 10);
      continue;
    }

    if (line.startsWith("CoverImage:")) {
      r.coverImage = line.replace("CoverImage:", "").trim();
      continue;
    }

    // 5.2 Section switches
    if (line === "Ingredients:") {
      mode = "ingredients";
      continue;
    }

    if (line === "Instructions:") {
      mode = "instructions";
      continue;
    }

    // 5.3 Ingredients block (after "Ingredients:")
    //     format: name,quantity,unit
    if (mode === "ingredients") {
      const parts = line.split(",");

      const ing = {
        name: undefined,
        quantity: 0,
        unit: undefined,
      };

      ing.name = (parts[0] || "").trim();

      const qtyStr = (parts[1] || "0").trim();
      ing.quantity = parseFloat(qtyStr);

      ing.unit = (parts[2] || "").trim();

      r.ingredients.push(ing);
      continue;
    }

    // 5.4 Instructions block (after "Instructions:")
    //     each non-empty line is one step
    if (mode === "instructions") {
      r.instructions.push(line);
      continue;
    }
  }

  return r;
}

// -------------------------------
// 6. Save recipe into localStorage
// -------------------------------

function saveRecipe(recipeObj) {
  // Read current localData from localStorage (in case another page modified it)
  let current = localStorage.getItem("localData");
  let data;

  if (current) {
    try {
      data = JSON.parse(current);
    } catch (e) {
      console.error("Error parsing localData from storage. Resetting.", e);
      data = { recipes: [] };
    }
  } else {
    data = { recipes: [] };
  }

  // Add the new recipe
  data.recipes.push(recipeObj);

  // Save back to localStorage
  localStorage.setItem("localData", JSON.stringify(data));

  // Also update the global localData object so other scripts can see it
  localData = data;
}