import {
    getUserFS,
    setSaveFilePathToOpen,
    setRecipeToOpen,
    addPrivateRecipe,
    setSelectedRecipes,
    getSelectedRecipes
} from "./localStorageManager.js";

let FS = getUserFS();
let currentPath = ["root"];
let currentNode = FS;
let selected = null;
let checkoutSelection = new Set();

const tree = document.getElementById("tree");
const view = document.getElementById("view");
const breadcrumb = document.getElementById("breadcrumb");
const pathInfo = document.getElementById("pathInfo");
const searchInput = document.getElementById("search");
const upBtn = document.getElementById("upBtn");
//Each file/ folder represented as node obj.


//array of active Nodes to be displayed
window._expanded = new Set(['root']);

/**
 *
 * @param {node}node current node(recipe) to get a path
 * @returns {node[]} array of nodes(recipe titles)
 * @description walk from the given node(recipe) all the way up to the root and add name of each node in front of node array that represents a path
 */
function getPathOfNode(node) {
    const path = [];
    //iterate over given path searching in FS
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
 * @param {node[]}pathArr array of nodes from root
 * @returns {node|null} node object found from a file system
 * @description
 * take array of nodes(recipe titles) as path and return node(recipe) object if found.
 */

function findNodeByPath(pathArr) {
    let node = FS;
    for (let i = 1; i < pathArr.length; i++) {
        const name = pathArr[i];
        if (!node.children)
            return null;
        node = node.children.find(c => c.title === name);
        if (!node)
            return null;
    }
    return node;
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
    //collapse
    if (window._expanded.has(id)) {
        window._expanded.delete(id);
    } else {
        //expand
        window._expanded.add(id);
    }
};

/**
 * Display Tree view of file system
 */
function displayTree() {
    tree.innerHTML = "";

    function walk(n, level) {
        const elem = document.createElement("div");
        elem.className = 'node ' + (currentPath.join('/') === getPathOfNode(n).join('/') ? ' active' : '');
        elem.style.paddingLeft = (8 + level * 12) + 'px';


        // collapsed or expanded
        const toggle = document.createElement("div");
        toggle.className = 'toggle';
        if (n.type === 'folder') {
            toggle.textContent = window.isExpanded(n) ? '▼' : '▶';
        }
        elem.appendChild(toggle);

        //choose icon
        const label = document.createElement("div");
        label.className = 'label';
        label.innerHTML = `<span style="width:18px; display: inline-block">${n.type === "folder" ? "📂" : "📄"}</span><span>${n.title}</span>`;
        elem.appendChild(label);

        elem.addEventListener("click", (e) => {
            e.stopPropagation();
            if (n.type === 'folder') {
                window.toggleNode(n);
                const path = getPathOfNode(n);
                currentPath = path;
                currentNode = findNodeByPath(path);
                displayAll();
            } else {
                selectItem(n)
            }
        });
        tree.appendChild(elem);
        if (n.type === 'folder' && window.isExpanded(n) && n.children) {
            n.children.forEach(c => {
                walk(c, level + 1)
            });
        }
    }

    walk(FS, 0);
}

/**
 * Display Center View panel
 */
function displayView() {
    view.innerHTML = "";
    const node = currentNode;
    const items = (node.children).slice();
    const q = (searchInput.value || '').toLowerCase();
    const filtered = items.filter(item => item.title.toLowerCase().includes(q));
    pathInfo.textContent = `${filtered.length} item(s) in ${currentPath.join(' / ')}`;

    filtered.forEach(item => {
        const col = document.createElement("div");
        col.className = 'col';
        const el = document.createElement("div");

        el.className = 'item card p-3 h-100 position-relative';
        el.tabIndex = 0;
        el.dataset.title = item.title;

        let totalTime = undefined;

        // background image for recipes
        if (item.type !== "folder") {
            totalTime = parseInt(item.cookTime) + parseInt(item.prepTime) + " min";

            // Set background if image exists
            if (item.coverImage) {
                el.style.backgroundImage = `url(${item.coverImage})`;
                el.classList.add('has-bg');
            }
        } else {
            el.setAttribute('style', 'background: var(--clr-surface-a10) !important');
        }

        const typeIcon = item.type === "folder" ? "📂" : "📄";
        const iconClass = `icon ${item.type === "folder" ? "folder" : "file"} mb-2`;

        // fav icon (heart)
        let heartHTML = "";
        if (item.type !== "folder") {
            const heartIconClass = item.favorite ? "bi-heart-fill text-danger" : "bi-heart";
            heartHTML = `<div class="fav-icon position-absolute top-0 start-0 m-2 p-1 rounded-circle bg-opacity-50 text-light" style="cursor: pointer; z-index: 10;">
                            <i class="bi ${heartIconClass}" style="font-size: 1.2rem;"></i>
                         </div>`;
        }

        // checkbox
        let checkboxHTML = "";

        if (item.type !== "folder") {
            const isChecked = checkoutSelection.has(item) ? "checked" : "";
            checkboxHTML = `<div class="select-checkbox position-absolute top-0 end-0 m-2 p-1 z-3">
                                <input class="form-check-input border-secondary" type="checkbox" ${isChecked} style="cursor: pointer; width: 1.2rem; height: 1.2rem;">
                            </div>`;
        }

        el.innerHTML = `
                    ${heartHTML}
                    ${checkboxHTML}
                    <div class="${iconClass}" style="${item.coverImage && item.type !== 'folder' ? 'opacity:0' : ''}">${typeIcon}</div>
                    <div class="content-wrapper position-relative" style="z-index: 2;">
                        <div class="fw-bold text-truncate mb-1" style="font-size: 1.5rem; text-shadow: ${item.coverImage ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'}">${item.title}</div>
                        <div class="meta d-flex justify-content-between mt-1" style="font-size: 1rem; text-shadow: ${item.coverImage ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'}">
                            <div style="font-size: 1rem">${item.type || item.foodName}</div>
                            <div>${totalTime || ""}</div>
                        </div>
                    </div>
                `;

        //fave (heart) onClick
        if (item.type !== "folder") {
            const heartBtn = el.querySelector('.fav-icon');
            if (heartBtn) {
                heartBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    item.favorite = !item.favorite;
                    const path=getPathOfNode(item).slice(0,-1);
                    addPrivateRecipe(item,path, "user1",true)
                    displayView();
                    if (selected === item) selectItem(item);
                });
                heartBtn.addEventListener("dblclick", (e) => {
                    e.stopPropagation();
                })
            }
        }

        // Checkbox Click Event
        const checkboxDiv = el.querySelector('.select-checkbox input');
        if (checkboxDiv) {
            checkboxDiv.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop card click
            });
            checkboxDiv.addEventListener("change", (e) => {
                if (e.target.checked) {
                    checkoutSelection.add(item);
                } else {
                    checkoutSelection.delete(item);
                }
                updateGetIngredientsBtn();
            });
            checkboxDiv.addEventListener("dblclick", (e) => {
                e.stopPropagation();
            })
        }



        el.addEventListener("click", () => {
            selectItem(item, el);
        });
        el.addEventListener("dblclick", () => {
            if (item.type === 'folder') {
                currentPath.push(item.title);
                currentNode = findNodeByPath(currentPath);
                displayAll();
            } else {
                openFile(item);
            }
        });
        el.addEventListener("keydown", e => {
            if (e.key === 'Enter') {
                el.dispatchEvent(new Event('dblclick'));
            }
        })
        col.appendChild(el);
        view.appendChild(col);
    })
}

/**
 * Update button state based on selection
 */
function updateGetIngredientsBtn() {
    if (checkoutSelection.size > 0) {
        getIngredientsBtn.classList.remove('btn-secondary');
        getIngredientsBtn.classList.add('btn-warning');
        getIngredientsBtn.style.opacity = "1";
    } else {
        getIngredientsBtn.style.opacity = "0.7";
    }
}

/**
 * Display top breadcrumb
 */
function displayBreadcrumb() {
    breadcrumb.innerHTML = "";
    currentPath.forEach((p, i) => {
        const li = document.createElement("li");
        li.className = 'breadcrumb-item';
        const btn = document.createElement("button");
        btn.textContent = p;
        btn.onclick = () => {
            //shrink current path to a selected folder
            navigateTo(currentPath.slice(0, i + 1));
        };
        li.appendChild(btn);
        breadcrumb.appendChild(li);
    });
}

/**
 * Refresh page
 */
function displayAll() {
    displayTree();
    displayView();
    displayBreadcrumb();
    selected = null;
    document.getElementById('detailName').textContent = 'Select an Item';
    document.getElementById('detailMeta').textContent = '';
    document.getElementById('detailContent').textContent = 'Preview or metadata here';
    document.getElementById('previewInner').textContent = 'Nothing selected';
}


/**
 * move to given path
 * @param pathArr
 */
function navigateTo(pathArr) {
    currentPath = pathArr;
    currentNode = findNodeByPath(pathArr);
    displayAll();
}


/**
 * open selected recipe in other pages
 * @param node
 */
function openFile(node) {
    selectItem(node);
    let path = getPathOfNode(node);
    path.pop()
    setSaveFilePathToOpen(path);
    setRecipeToOpen(node);
    window.location.href = "recipeDisplay.html";
}


/**
 * select recipe and highlight it
 * @param node a recipe user clicked
 * @param elemRef html element clicked
 */
function selectItem(node, elemRef) {
    selected = node;
    Array.from(view.querySelectorAll('.item')).forEach(c => c.classList.remove('selected'));
    if (elemRef) elemRef.classList.add('selected');


    let metaHtml = "";
    if (node.rating !== undefined) {
        metaHtml += `<div class="text-warning mb-1">`;
        for (let i = 1; i <= 5; i++) {
            if (i <= node.rating) {
                metaHtml += `<i class="bi bi-star-fill"></i> `;
            } else {
                metaHtml += `<i class="bi bi-star"></i> `;
            }
        }
        metaHtml += `</div>`;
    }

    if (node.prepTime && node.cookTime) {
        metaHtml += `<div class="d-flex align-items-center gap-2 mt-1"><i class="bi bi-clock"></i> <span>${parseInt(node.prepTime) + parseInt(node.cookTime)} mins</span></div>`;
    }

    document.getElementById('detailMeta').innerHTML = metaHtml;
    document.getElementById('detailName').textContent = node.type || "Recipe";

    // top left icon
    const iconContainer = document.getElementById('detailIcon');
    iconContainer.style.backgroundImage = "none";
    iconContainer.textContent = node.type === 'folder' ? '📁' : '📄';
    iconContainer.className = 'big icon ' + (node.type === 'folder' ? 'folder' : 'file');

    document.getElementById('detailContent').textContent = node.type === 'folder' ? (node.children ? `${node.children.length} items` : 'Empty folder') : `${node.title}`;

    // quick look preview
    const previewInner = document.getElementById('previewInner');
    if (node.type !== 'folder') {
        if (node.coverImage) {
            previewInner.innerHTML = `
                <img src="${node.coverImage}" alt="${node.title}" class="img-fluid rounded mb-3 w-100" style="max-height: 200px; object-fit: cover;">
                
                <div class="mb-3  d-flex align-items-center gap-1" style="color: var(--clr-primary-a50)">
                    <i class="bi bi-hash"></i> 
                    <span>${(node.tags || []).join(', ')}</span>
                </div>
                
                <h6>Ingredients:</h6>
                <ul class="ps-3 small text-secondary">
                    ${(node.ingredients || []).slice(0, 5).map(i => {
                return `<li>${typeof i === 'string' ? i : (i.quantity || '') + ' ' + (i.unit || '') + ' ' + i.name}</li>`;
            }).join('')}
                    ${(node.ingredients && node.ingredients.length > 5) ? '<li>...</li>' : ''}
                </ul>
             `;
        } else if (node.content) {
            const pre = document.createElement('pre');
            pre.classList.add('p-2', 'rounded');
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.fontSize = '1rem';
            pre.textContent = node.content;
            previewInner.innerHTML = '';
            previewInner.appendChild(pre);
        } else {
            previewInner.textContent = 'No preview available.';
        }
    } else {
        previewInner.innerHTML = `<div>${node.children ? node.children.length : 0} item(s)</div>`;
    }
}

upBtn.addEventListener("click", () => {
    if (currentPath.length > 1) {
        currentPath.pop();
        currentNode = findNodeByPath(currentPath);
        displayAll();
    }
})

getIngredientsBtn.addEventListener("click", () => {
    if (checkoutSelection.size === 0) {
        alert("Please select at least one recipe");
        return;
    }
    const recipesArray = Array.from(checkoutSelection);
    setSelectedRecipes(recipesArray);
    let checkboxCollection  = document.getElementsByClassName('form-check-input');
    for (const c of checkboxCollection) {
        c.checked = false;
    }
    window.location.href = "ingredientsCheckout.html";
});

searchInput.addEventListener("input", () => displayView());


currentNode = FS;
displayAll();