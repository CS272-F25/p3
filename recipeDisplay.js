import {
    getUserFS,
    addPrivateRecipe,
    getRecipeToOpen,
    setSaveFilePathToOpen,
    setRecipeToOpen
} from "./localStorageManager.js";

const treeContainer = document.getElementById("tree");
const pathDisplay = document.getElementById("currentPathDisplay");
const recipeContent = document.getElementById("recipeContent");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const backBtn = document.getElementById("backBtn");

let FS = getUserFS();
let selectedSavePath = ['root'];
let currentRecipe = null;


window._expanded = new Set(['root']);

document.addEventListener("DOMContentLoaded", () => {
    currentRecipe = getRecipeToOpen();
    if (!currentRecipe) {
        alert("No recipe selected. Returning to planner.");
        window.location.href = "mealPlanner.html";
        return;
    }
    renderRecipe(currentRecipe);

    displayTree();
});

backBtn.addEventListener("click", () => {
    window.location.href = "mealPlanner.html";
});

saveBtn.addEventListener("click", () => {
    if (!currentRecipe) return;
    const folderName = selectedSavePath.length > 1 ? selectedSavePath[selectedSavePath.length - 1] : "root";

    // Copy recipe to ensure we don't mutate the original if it's used elsewhere
    const recipeToSave = {...currentRecipe};

    const success = addPrivateRecipe(recipeToSave, selectedSavePath);
    if (success) {
        alert(`"${currentRecipe.title}" saved to "${folderName}"!`);
        displayTree(); // Refresh tree to show if we want (though files aren't shown in this tree, logic persists)
    }
});

editBtn.addEventListener("click", () => {
    if (!currentRecipe) return;

    // Pass the selected path and recipe object
    setSaveFilePathToOpen(selectedSavePath);
    setRecipeToOpen(currentRecipe);
    window.location.href = "recipeEditor.html";
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
 * @param node - node(recipe) to get an ID in window._expanded
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


/**
 * Display given recipe object
 * @param recipe
 */
function renderRecipe(recipe) {
    let ingredientsList = "";
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList = '<ul class="list-group list-group-flush mb-4" style="max-width: 600px;">';
        recipe.ingredients.forEach((ing, i) => {
            const amt = recipe.amounts && recipe.amounts[i] ? recipe.amounts[i] : "";
            const unit = recipe.units && recipe.units[i] ? recipe.units[i] : "";
            ingredientsList += `<li class="list-group-item bg-transparent text-light border-secondary py-2">${amt} ${unit} ${ing}</li>`;
        });
        ingredientsList += '</ul>';
    }

    const instructions = recipe.instructions.map(step => `<div class="instruction-step">${step}</div>`).join('');

    const html = `
        <h1 class="display-5 fw-bold mb-3" style="color: var(--clr-light-a0)">${recipe.title}</h1>
        <div class="d-flex gap-4 mb-4 align-items-center" style="color:var(--clr-surface-a50)">
            <span><i class="bi bi-clock me-2"></i>Prep: ${recipe.prepTime}m</span>
            <span><i class="bi bi-fire me-2"></i>Cook: ${recipe.cookTime}m</span>
            <span><i class="bi bi-hash me-2"></i>${recipe.tags.join(', ')}</span>
        </div>
        
        <img src="${recipe.coverImage}" class="recipe-header-img" alt="${recipe.title}">
        
        <h3 class="text-primary mt-4">Ingredients</h3>
        ${ingredientsList}
        
        <h3 class="text-primary mt-4">Instructions</h3>
        <div class="mb-5 text-light" style="line-height: 1.6;">${instructions}</div>
    `;

    recipeContent.innerHTML = html;
}
