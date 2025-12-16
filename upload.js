// upload.js 
//
// Reads a .txt file, parses it into a Recipe object, saves it into the user's private FS,
// and (optionally) sets the save path in sessionStorage so the next page knows where it lives.
//
// NOTE: Recipe shape follows the "empty recipe" used by recipeBrowser.js and processApiJson():
//   ingredients: string[], amounts: string[], units: string[], plus favorite/rating/type/etc.

import {
  addPrivateRecipe,
  findFolder,
  setSaveFilePathToOpen,
  setRecipeToOpen,
} from "./localStorageManager.js";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

// Prefer saving into /root/Recipes if it exists, otherwise /root
function getDefaultSavePath() {
  const preferred = ["root", "Recipes"];
  if (findFolder(preferred, "user1")) return preferred;
  return ["root"];
}

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) return showError("Please choose a .txt file first.");
  if (!file.name.toLowerCase().endsWith(".txt")) {
    return showError("Error: Uploaded file must be a .txt file.");
  }

  clearMessage();
  uploadStatus.textContent = "Reading file...";

  try {
    const text = await file.text();
    const recipe = parseTxtToRecipe(text);

    const savePath = getDefaultSavePath();

    // Make title always non-empty + reasonably unique to avoid addPrivateRecipe collisions
    if (!recipe.title || recipe.title.trim() === "") {
      recipe.title = `Uploaded Recipe ${Date.now()}`;
    }

    // If a recipe with the same title already exists in that folder, append a suffix
    const folder = findFolder(savePath, "user1");
    if (folder && Array.isArray(folder.children)) {
      const exists = folder.children.some((c) => c && c.title === recipe.title);
      if (exists) {
        recipe.title = `${recipe.title} (${new Date().toLocaleString()})`;
      }
    }

    const ok = addPrivateRecipe(recipe, savePath, "user1", false);
    if (!ok) {
      // This usually means "already exists" and overwrite=false.
      return showError("Upload failed: a recipe with that title already exists. Please rename and try again.");
    }

    // Not strictly required if you just navigate to the browser,
    // but it fixes the “save path not set” complaint when you open another page next.
    setSaveFilePathToOpen(savePath);
    setRecipeToOpen(recipe);

    uploadStatus.style.color = "green";
    uploadStatus.innerHTML =
      `Recipe uploaded successfully! Saved to: <code>/${savePath.join("/")}</code>. ` +
      `<a href="recipeBrowser.html">Open Browser</a>`;
  } catch (err) {
    console.error(err);
    showError("Error: Failed to read/parse/save the file.");
  }
});

function showError(message) {
  uploadStatus.style.color = "red";
  uploadStatus.textContent = message;
}

function clearMessage() {
  uploadStatus.style.color = "";
  uploadStatus.textContent = "";
}

/**
 * Parse TXT -> Recipe object.
 *
 * Expected format (same as your page explains):
 * Title: ...
 * FoodName: ...
 * Description: ...
 * PrepTime: 5
 * CookTime: 10
 * Servings: 2
 * CoverImage: https://...
 * Tags: tag1, tag2, ...
 *
 * Ingredients:
 * egg,2,pcs
 * tomato,1,whole
 *
 * Instructions:
 * Step 1...
 * Step 2...
 */
function parseTxtToRecipe(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim());

  const r = {
    id: Date.now(),
    title: "New Recipe",
    foodName: "",
    description: "",
    coverImage: null,
    ingredients: [],
    amounts: [],
    units: [],
    instructions: [],
    tags: [],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    favorite: false,
    rating: 0,
    type: "file",
  };

  let mode = ""; // "", "ingredients", "instructions"

  for (const line of lines) {
    if (!line) continue;

    // Section switches
    if (line === "Ingredients:") {
      mode = "ingredients";
      continue;
    }
    if (line === "Instructions:") {
      mode = "instructions";
      continue;
    }

    // Key: Value lines
    if (mode === "") {
      if (line.startsWith("Title:")) r.title = line.replace("Title:", "").trim();
      else if (line.startsWith("FoodName:")) r.foodName = line.replace("FoodName:", "").trim();
      else if (line.startsWith("Description:")) r.description = line.replace("Description:", "").trim();
      else if (line.startsWith("PrepTime:")) r.prepTime = parseInt(line.replace("PrepTime:", "").trim(), 10) || 0;
      else if (line.startsWith("CookTime:")) r.cookTime = parseInt(line.replace("CookTime:", "").trim(), 10) || 0;
      else if (line.startsWith("Servings:")) r.servings = parseInt(line.replace("Servings:", "").trim(), 10) || 1;
      else if (line.startsWith("CoverImage:")) {
        const v = line.replace("CoverImage:", "").trim();
        r.coverImage = v || null;
      } else if (line.startsWith("Tags:")) {
        const v = line.replace("Tags:", "").trim();
        r.tags = v ? v.split(",").map((t) => t.trim()).filter(Boolean) : [];
      }
      continue;
    }

    // Ingredients block: name,amount,unit -> three parallel arrays
    if (mode === "ingredients") {
      const parts = line.split(",").map((p) => p.trim());
      const name = parts[0] || "";
      const amount = parts[1] || "";
      const unit = parts[2] || "";

      if (name) {
        r.ingredients.push(name);
        r.amounts.push(amount);
        r.units.push(unit);
      }
      continue;
    }

    // Instructions block: each non-empty line is one step
    if (mode === "instructions") {
      r.instructions.push(line);
    }
  }

  // Fall back: if FoodName missing, reuse title
  if (!r.foodName) r.foodName = r.title;

  return r;
}
