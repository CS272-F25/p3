import {
    apiRandom2localRecipe,
    addPrivateRecipe,
    getUserFS,
    setRecipeToOpen
} from "./localStorageManager.js";

const SESSION_KEY = "CS472MealPlan3Days";
const gridContainer = document.getElementById("plannerGrid");
const refreshBtn = document.getElementById("refreshPlan");
const saveAllBtn = document.getElementById("saveAll");
const treeContainer = document.getElementById("tree");
const pathDisplay = document.getElementById("currentPathDisplay");

let FS = getUserFS();
let selectedSavePath = ['root'];
window._expanded = new Set(['root']);

document.addEventListener("DOMContentLoaded", () => {
    loadMealPlan();
    displayTree();
});


/**
 *
 * @param {node}node current node to get a path
 * @returns {node[]} array of nodes
 * @description walk from the given node all the way up to the root and add name of each node in front of node array that represents a path
 */
function getPathOfNode(node) {
    const path = [];
    (function find(cur) {
        if (cur === node) {
            path.unshift(cur.title);
            return true;
        }
        if (cur.children) {
            for (const c of cur.children) {
                if (find(c)) {
                    path.unshift(cur.title);
                    return true;
                }
            }
        }
        return false;
    })(FS);
    return path;
}

/**
 *
 * @param node - node to get an ID in window._expanded
 * @returns {string} - full path in string
 * @description
 * @example
 * getNodeIDFromNode(['root', 'a', 'b']);
 * //Expected output: root/a/b
 */
function getNodeIDFromNode(node) {
    return getPathOfNode(node).join('/');
}

window.isExpanded = (node) => (window._expanded && window._expanded.has(getNodeIDFromNode(node)));
window.toggleNode = (node) => {
    const id = getNodeIDFromNode(node);
    if (window._expanded.has(id)) {
        window._expanded.delete(id);
    } else {
        window._expanded.add(id);
    }
    displayTree();
};


/**
 * Display Tree view of file system
 */
function displayTree() {
    treeContainer.innerHTML = "";

    function walk(n, level) {
        if (n.type !== 'folder') return;

        const elem = document.createElement("div");
        const isSelected = getPathOfNode(n).join('/') === selectedSavePath.join('/');

        elem.className = 'node ' + (isSelected ? ' active' : '');
        elem.style.paddingLeft = (8 + level * 12) + 'px';

        const toggle = document.createElement("div");
        toggle.className = 'toggle';
        toggle.textContent = window.isExpanded(n) ? '▼' : '▶';
        elem.appendChild(toggle);

        const label = document.createElement("div");
        label.className = 'label';
        label.innerHTML = `<span style="margin-right:6px">📂</span><span>${n.title}</span>`;
        elem.appendChild(label);

        elem.addEventListener("click", (e) => {
            e.stopPropagation();
            window.toggleNode(n);
            selectedSavePath = getPathOfNode(n);
            pathDisplay.textContent = "Saving to: /" + selectedSavePath.slice(1).join('/');
            displayTree();
        });

        treeContainer.appendChild(elem);

        if (window.isExpanded(n) && n.children) {
            n.children.forEach(c => {
                walk(c, level + 1)
            });
        }
    }

    walk(FS, 0);
}

refreshBtn.addEventListener("click", () => {
    if (confirm("Are you sure? This will replace your current meal plan.")) {
        sessionStorage.removeItem(SESSION_KEY);
        loadMealPlan();
    }
});

saveAllBtn.addEventListener("click", () => {
    const meals = getStoredMeals();
    if (!meals || meals.length === 0) return;

    let savedCount = 0;
    const folderName = selectedSavePath.length > 1 ? selectedSavePath[selectedSavePath.length - 1] : "root";

    meals.forEach(meal => {
        if (saveRecipeToSelectedFolder(meal, true)) {
            savedCount++;
        }
    });

    displayTree();
    alert(`Saved ${savedCount} new recipes to "${folderName}"!`);
});


/**
 * Save recipe into a folder selected from left tree view
 * Use silent=true to hide warning messages
 * @param meal
 * @param silent
 * @returns {boolean}
 */
function saveRecipeToSelectedFolder(meal, silent = false) {
    const recipeToSave = {...meal};
    const success = addPrivateRecipe(recipeToSave, selectedSavePath);

    if (!success && !silent) {
        alert("Recipe already exists in this folder!");
    }
    return success;
}

/**
 * Load previous random roll if exists in session storage
 * @returns {Promise<void>}
 */
async function loadMealPlan() {
    let meals = getStoredMeals();

    if (!meals || meals.length < 9) {
        gridContainer.innerHTML = `<div class="text-center w-100 mt-5">Loading 9 delicious recipes...</div>`;
        try {
            const promises = Array.from({length: 9}, () => apiRandom2localRecipe());
            meals = await Promise.all(promises);
            saveMeals(meals);
        } catch (error) {
            console.error("Failed to fetch meal plan", error);
            gridContainer.innerHTML = `<div class="text-danger text-center w-100">Error loading recipes. Please try again.</div>`;
            return;
        }
    }
    renderGrid(meals);
}

/**
 * helper function for loadMealPlan() to parse data in sessionStorage
 * @returns {any|null}
 */
function getStoredMeals() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Save random meals into sessionStorage
 * @returns {any|null}
 */
function saveMeals(meals) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(meals));
}

/**
 * Display 3 days plan plans
 * @param meals
 */
function renderGrid(meals) {
    gridContainer.innerHTML = "";

    const days = [
        {name: "Day 1", meals: meals.slice(0, 3)},
        {name: "Day 2", meals: meals.slice(3, 6)},
        {name: "Day 3", meals: meals.slice(6, 9)}
    ];

    const mealLabels = ["Breakfast", "Lunch", "Dinner"];

    days.forEach((day) => {
        const col = document.createElement("div");
        col.className = "col h-100";

        let mealsHtml = "";
        day.meals.forEach((meal, index) => {
            mealsHtml += `
                <div class="meal-card h-100" 
                     style="background-image: url('${meal.coverImage}');"
                     onclick="window.viewRecipeDetails('${meal.id}')">
                    <div class="meal-info">
                        <div class="meal-type">${mealLabels[index]}</div>
                        <div class="meal-name" title="${meal.title}">${meal.title}</div>
                    </div>
                    <button class="view-btn" aria-label="View Details">
                        ➜
                    </button>
                </div>
            `;
        });

        col.innerHTML = `
            <div class="day-column">
                <div class="day-title">${day.name}</div>
                ${mealsHtml}
            </div>
        `;
        gridContainer.appendChild(col);
    });

    window.viewRecipeDetails = (id) => {
        const meal = meals.find(m => m.id === id);
        if (meal) {
            setRecipeToOpen(meal);
            window.location.href = "recipeDisplay.html";
        }
    };
}
