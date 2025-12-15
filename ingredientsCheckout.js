import {convertFractionsToDecimals, getSelectedRecipes} from "./localStorageManager.js";

const recipeListContainer = document.getElementById("recipeListContainer");
const shoppingListContainer = document.getElementById("shoppingListContainer");
const emptyMsg = document.getElementById("emptyMsg");
const backBtn = document.getElementById("backBtn");

let loadedRecipes = [];

document.addEventListener("DOMContentLoaded", () => {
    loadedRecipes = getSelectedRecipes();

    if (loadedRecipes === null) {
        alert("Selection is empty. Returning to browser.");
        window.location.href = "recipeBrowser.html";
        return;
    }

    renderRecipeSidebar();
    renderIngredients();
});

backBtn.addEventListener("click", () => {
    history.back();
});

/**
 * display list of recipes to select
 */
function renderRecipeSidebar() {
    recipeListContainer.innerHTML = "";

    loadedRecipes.forEach((recipe, index) => {
        const div = document.createElement("div");
        div.className = "recipe-check-item d-flex align-items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input mt-0";
        checkbox.id = `rec-${index}`;
        checkbox.checked = true; // Default to checked
        checkbox.dataset.index = index;

        const label = document.createElement("label");
        label.className = "form-check-label text-truncate w-100";
        label.htmlFor = `rec-${index}`;
        label.textContent = recipe.title;
        label.style.cursor = "pointer";
        label.style.transition = "opacity 0.2s, text-decoration 0.2s";

        checkbox.addEventListener("change", () => {
            updateRecipeVisuals(checkbox, label);
            renderIngredients();
        });

        div.appendChild(checkbox);
        div.appendChild(label);
        recipeListContainer.appendChild(div);
    });
}

/**
 * change styling for texts in list
 * @param checkbox
 * @param label
 */
function updateRecipeVisuals(checkbox, label) {
    if (!checkbox.checked) {
        label.style.textDecoration = "line-through";
        label.style.opacity = "0.5";
    } else {
        label.style.textDecoration = "none";
        label.style.opacity = "1";
    }
}

/**
 * compile all ingredients and render ingredients list
 */
function renderIngredients() {
    const checkboxes = recipeListContainer.querySelectorAll("input[type='checkbox']");
    const activeIndices = [];
    checkboxes.forEach(cb => {
        if (cb.checked) activeIndices.push(parseInt(cb.dataset.index));
    });

    if (activeIndices.length === 0) {
        shoppingListContainer.innerHTML = "";
        emptyMsg.classList.remove("d-none");
        return;
    }
    emptyMsg.classList.add("d-none");

    const aggregated = {}; // Key: "name|unit" -> {amount: 0, unit: "", name: ""}

    activeIndices.forEach(idx => {
        const recipe = loadedRecipes[idx];

        // Handle different data structures (Parallel arrays vs Object Array)
        if (recipe.ingredients && Array.isArray(recipe.ingredients) && typeof recipe.ingredients[0] === 'string') {
            recipe.ingredients.forEach((ingName, i) => {
                const rawAmount = (recipe.amounts && recipe.amounts[i]) ? String(recipe.amounts[i]) : "0";
                const unit = (recipe.units && recipe.units[i]) ? recipe.units[i] : "";

                addIngredientToMap(aggregated, ingName, rawAmount, unit);
            });
        } else if (recipe.ingredients && Array.isArray(recipe.ingredients) && typeof recipe.ingredients[0] === 'object') {
            recipe.ingredients.forEach(ingObj => {
                const rawAmount = ingObj.quantity ? String(ingObj.quantity) : "0";
                const unit = ingObj.unit ? ingObj.unit : "";

                addIngredientToMap(aggregated, ingObj.name, rawAmount, unit);
            });
        }
    });

    renderShoppingList(aggregated);
}

/**
 * helper function to compile all ingredients in a common list.
 * Adds amount if ingredient exists with same unit
 * @param map
 * @param name
 * @param rawAmount
 * @param unit
 */
function addIngredientToMap(map, name, rawAmount, unit) {
    if (!name) return;

    const cleanName = name.trim().toLowerCase();
    let cleanUnit = unit ? unit.trim().toLowerCase() : "";

    const decimalStr = convertFractionsToDecimals(rawAmount);
    let amountVal = parseFloat(decimalStr) || 0;

    if (amountVal === 0 && cleanUnit) {
        // Regex to match 30g, 10ml, etc.
        const match = cleanUnit.match(/^(\d+(?:\.\d+)?)\s*([a-z%]+)$/);
        if (match) {
            amountVal = parseFloat(match[1]); // Extract 30
            cleanUnit = match[2];             // Extract g
        }
    }

    const key = `${cleanName}|${cleanUnit}`;

    if (!map[key]) {
        map[key] = {
            name: cleanName,
            unit: cleanUnit,
            amount: 0
        };
    }

    map[key].amount += amountVal;
}

/**
 * render compiled ingredient list
 * @param aggregatedMap
 */
function renderShoppingList(aggregatedMap) {
    shoppingListContainer.innerHTML = "";

    const sortedKeys = Object.keys(aggregatedMap).sort();

    sortedKeys.forEach(key => {
        const item = aggregatedMap[key];

        let displayAmount = "";
        if (item.amount > 0) {
            displayAmount = Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(2).replace(/\.00$/, '');
        }

        const li = document.createElement("div");
        li.className = "list-group-item ingredient-sum-item d-flex justify-content-between align-items-center px-3 py-3";

        const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);

        li.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <input type="checkbox" class="form-check-input fs-5 m-0 border-secondary bg-transparent" style="cursor:pointer">
                <span class="fs-5">${displayName}</span>
            </div>
            <span class="badge bg-primary fs-6 fw-normal text-white">
                ${displayAmount} ${item.unit}
            </span>
        `;

        const check = li.querySelector("input");
        check.addEventListener("change", (e) => {
            if (e.target.checked) {
                li.style.opacity = "0.5";
                li.querySelector("span").style.textDecoration = "line-through";
            } else {
                li.style.opacity = "1";
                li.querySelector("span").style.textDecoration = "none";
            }
        });

        shoppingListContainer.appendChild(li);
    });
}
