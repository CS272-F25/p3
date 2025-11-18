const FS = {
    name: "root",
    type: "folder",
    children: [
        {
            name: "Recipes", type: "folder", children: [
                {
                    name: "Breakfast", type: "folder", children: [
                        {
                            name: "pancakes.txt",
                            type: "file",
                            size: "3 KB",
                            modified: "2024-08-12",
                            content: "Ingredients:\n- Flour\n- Milk\n- Eggs\nInstructions: Mix and fry."
                        },
                        {
                            name: "omelette.txt",
                            type: "file",
                            size: "2 KB",
                            modified: "2024-06-20",
                            content: "Beat eggs, add salt, cook in pan."
                        }
                    ]
                },
                {
                    name: "Dinner", type: "folder", children: [
                        {
                            name: "spaghetti.md",
                            type: "file",
                            size: "4 KB",
                            modified: "2025-03-02",
                            content: "# Spaghetti\nBoil pasta. Add sauce."
                        },
                        {
                            name: "soup.jpg",
                            type: "file",
                            size: "18 KB",
                            modified: "2025-01-11",
                            content: null,
                            previewType: "image",
                            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='100%' height='100%' fill='%23ffd7a5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23000'>Soup Image</text></svg>"
                        }
                    ]
                }
            ]
        },
        {
            name: "Ingredients.csv",
            type: "file",
            size: "6 KB",
            modified: "2025-02-10",
            content: "item,quantity\nflour,2 cups\nsugar,1 cup"
        },
        {
            name: "README.md",
            type: "file",
            size: "1 KB",
            modified: "2024-11-05",
            content: "# Recipe Browser\nThis is a demo UI."
        }
    ]
};


let currentPath = ["root"];
let currentNode = FS;
let selected = null;
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
 * @param {node}node current node to get a path
 * @returns {node[]} array of nodes
 * @description walk from the given node all the way up to the root and add name of each node in front of node array that represents a path
 */
function getPathOfNode(node) {
    const path = [];
    //iterate over given path searching in FS
    (function find(cur) {
        if (cur === node) {
            path.unshift(cur.name);
            return true;
        }
        if (cur.children) {
            for (const c of cur.children) {
                if (find(c)) {
                    path.unshift(cur.name);
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
 * take array of nodes as path and return node object if found.
 */

function findNodeByPath(pathArr) {
    let node = FS;
    for (let i = 1; i < pathArr.length; i++) {
        const name = pathArr[i];
        if (!node.children)
            return null;
        node = node.children.find(c => c.name === name);
        if (!node)
            return null;
    }
    return node;
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
    //collapse
    if (window._expanded.has(id)) {
        window._expanded.delete(id);
    } else {
        //expand
        window._expanded.add(id);
    }
};


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
        label.innerHTML = `<span style="width:18px; display: inline-block">${n.type === "folder" ? "📂" : "📄"}</span><span>${n.name}</span>`;
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

function displayView() {
    view.innerHTML = "";
    const node = currentNode;
    const items = (node.children || []).slice();
    const q = (searchInput.value || '').toLowerCase();
    const filtered = items.filter(item => item.name.toLowerCase().includes(q));
    pathInfo.textContent = `${filtered.length} item(s) in ${currentPath.join(' / ')}`;

    filtered.forEach(item => {
        const col = document.createElement("div");
        col.className = 'col';
        const el = document.createElement("div");
        el.className = 'item card p-3 h-100';
        el.tabIndex = 0;
        el.dataset.name = item.name;
        // TODO: modify here to match recipe object type
        el.innerHTML = `
                    <div class="icon ${item.type === "folder" ? "folder" : "file"} mb-2">${item.type === "folder" ? "📂" : "📄"}</div>
                    <div class="fw-bold text-truncate">${item.name}</div>
                    <div class="meta d-flex justify-content-between mt-1" style="font-size: 13px;">
                        <div>${item.type}</div>
                        <div>${item.size || ""} ${item.modified || ""}</div>
                    </div>
                `;
        el.addEventListener("click", () => {
            selectItem(item, el);
        });
        el.addEventListener("dblclick", () => {
            if (item.type === 'folder') {
                currentPath.push(item.name);
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


function displayAll() {
    displayTree();
    displayView();
    displayBreadcrumb();
    selected = null;
    document.getElementById('detailName').textContent = 'Select an Item';
    document.getElementById('detailType').textContent = '-';
    document.getElementById('detailMeta').textContent = '';
    document.getElementById('detailContent').textContent = 'Preview or metadata here';
    document.getElementById('previewInner').textContent = 'Nothing selected';
}

function navigateTo(pathArr) {
    currentPath = pathArr;
    currentNode = findNodeByPath(pathArr);
    displayAll();
}

function openFile(node) {
    selectItem(node);
    alert('Open file: ' + node.name + '\n open Recipe not implemented. refer to quick preview');
}

function selectItem(node, elemRef) {
    selected = node;
    Array.from(view.querySelectorAll('.item')).forEach(c => c.classList.remove('selected'));
    if (elemRef) elemRef.classList.add('selected');

    document.getElementById('detailName').textContent = node.name;
    document.getElementById('detailType').textContent = node.type;
    document.getElementById('detailMeta').textContent = (node.size ? node.size + ' • ' : '') + (node.modified || '');
    const icon = document.getElementById('detailIcon');
    icon.textContent = node.type === 'folder' ? '📁' : '📄';
    icon.className = 'big icon ' + (node.type === 'folder' ? 'folder' : 'file');
    document.getElementById('detailContent').textContent = node.type === 'folder' ? (node.children ? `${node.children.length} items` : 'Empty folder') : (node.content ? (typeof node.content === 'string' ? node.content.slice(0, 240) : '') : 'Binary file');

    // preview area
    const previewInner = document.getElementById('previewInner');
    if (node.type === 'file') {
        if (node.previewType === 'image' && node.src) {
            previewInner.innerHTML = `<img src="${node.src}" alt="${node.name}" class="img-fluid rounded">`;
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

searchInput.addEventListener("input", () => displayView());


currentNode = FS;
displayAll();