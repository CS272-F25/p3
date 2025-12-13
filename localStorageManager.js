// Updated to include apiRandom2localRecipe and export it
let sampleRecipeCS472 = {
    public: [],
    private: {
        user1: {
            FS: {
                title: "root", type: "folder", children: [
                    {
                        title: "Recipes", type: "folder", children: [
                            {
                                title: "Breakfast", type: "folder", children: [
                                    {
                                        id: 1,
                                        coverImage: "./test_recipe.jpg",
                                        title: "Recipe 1",
                                        foodName: "Pasta",
                                        description: "Delicious creamy pasta with garlic and parmesan",
                                        prepTime: 10,
                                        cookTime: 20,
                                        rating: 4,
                                        ingredients: [
                                            {name: "pasta", quantity: 200, unit: "g"},
                                            {name: "garlic", quantity: 3, unit: "cloves"},
                                            {name: "heavy cream", quantity: 200, unit: "ml"},
                                            {name: "parmesan", quantity: 50, unit: "g"},
                                        ],
                                        instructions: [
                                            "Cook pasta according to package directions",
                                            "Sauté garlic in butter",
                                            "Add cream and parmesan",
                                            "Mix with cooked pasta",
                                        ],
                                        tags: ["Italian", "Vegetarian", "Quick"],
                                        servings: 1,
                                    },
                                    {
                                        id: 2,
                                        coverImage: "./rest_recipe.jpg",
                                        title: "Recipe 2",
                                        foodName: "Spicy Chicken Curry",
                                        description: "A rich and spicy Indian-style chicken curry with coconut milk.",
                                        prepTime: 15,
                                        cookTime: 40,
                                        rating: 5,
                                        ingredients: [
                                            {name: "chicken breast", quantity: 500, unit: "g"},
                                            {name: "onion", quantity: 1, unit: "medium"},
                                            {name: "curry powder", quantity: 2, unit: "tbsp"},
                                            {name: "coconut milk", quantity: 400, unit: "ml"},
                                            {name: "tomato paste", quantity: 1, unit: "tbsp"}
                                        ],
                                        instructions: [
                                            "Dice chicken and chop onion.",
                                            "Sauté onion until soft.",
                                            "Add chicken and brown.",
                                            "Stir in curry powder and tomato paste.",
                                            "Pour in coconut milk and simmer for 30 minutes, or until chicken is cooked through."
                                        ],
                                        tags: ["Indian", "Spicy", "Dinner"],
                                        servings: 4
                                    },
                                ]
                            },
                            {
                                title: "Dinner", type: "folder", children: [
                                    {
                                        id: 3,
                                        coverImage: "./rest_recipe.jpg",
                                        title: "Recipe 3",
                                        foodName: "Beef Tacos",
                                        description: "Classic ground beef tacos with your favorite toppings.",
                                        prepTime: 10,
                                        cookTime: 15,
                                        rating: 4,
                                        ingredients: [
                                            {name: "ground beef", quantity: 500, unit: "g"},
                                            {name: "taco seasoning", quantity: 1, unit: "packet"},
                                            {name: "water", quantity: 125, unit: "ml"},
                                            {name: "taco shells", quantity: 12, unit: "count"}
                                        ],
                                        instructions: [
                                            "Brown ground beef and drain excess fat.",
                                            "Stir in taco seasoning and water.",
                                            "Bring to a boil, then reduce heat and simmer for 10 minutes.",
                                            "Spoon mixture into taco shells and serve with desired toppings."
                                        ],
                                        tags: ["Mexican", "Quick", "Dinner"],
                                        servings: 6
                                    },
                                    {
                                        id: 4,
                                        coverImage: "./rest_recipe.jpg",
                                        title: "Recipe 4",
                                        foodName: "Mediterranean Quinoa Salad",
                                        description: "A light and fresh salad with quinoa, cucumber, tomatoes, and feta cheese.",
                                        prepTime: 15,
                                        cookTime: 15,
                                        rating: 5,
                                        ingredients: [
                                            {name: "quinoa", quantity: 150, unit: "g"},
                                            {name: "cucumber", quantity: 1, unit: "count"},
                                            {name: "cherry tomatoes", quantity: 200, unit: "g"},
                                            {name: "feta cheese", quantity: 100, unit: "g"},
                                            {name: "lemon juice", quantity: 2, unit: "tbsp"}
                                        ],
                                        instructions: [
                                            "Cook quinoa according to package directions and let cool.",
                                            "Dice cucumber and halve cherry tomatoes.",
                                            "Combine quinoa, cucumber, tomatoes, and crumbled feta in a large bowl.",
                                            "Drizzle with lemon juice and mix well."
                                        ],
                                        tags: ["Vegetarian", "Healthy", "Lunch"],
                                        servings: 3
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        id: 5,
                        coverImage: "./rest_recipe.jpg",
                        title: "Recipe 5",
                        foodName: "Fluffy Pancakes",
                        description: "Classic light and fluffy buttermilk pancakes.",
                        prepTime: 5,
                        cookTime: 15,
                        rating: 4,
                        ingredients: [
                            {name: "flour", quantity: 250, unit: "g"},
                            {name: "baking powder", quantity: 2, unit: "tsp"},
                            {name: "sugar", quantity: 3, unit: "tbsp"},
                            {name: "egg", quantity: 1, unit: "large"},
                            {name: "buttermilk", quantity: 300, unit: "ml"}
                        ],
                        instructions: [
                            "Whisk together flour, baking powder, and sugar.",
                            "In a separate bowl, whisk the egg and buttermilk.",
                            "Combine wet and dry ingredients, mixing until just combined (don't overmix).",
                            "Pour 1/4 cup of batter onto a hot, buttered griddle for each pancake.",
                            "Cook until bubbles appear on the surface, then flip and cook until golden brown."
                        ],
                        tags: ["Breakfast", "Sweet", "Quick"],
                        servings: 4
                    },
                    {
                        id: 6,
                        coverImage: "./rest_recipe.jpg",
                        title: "Recipe 6",
                        foodName: "Lemon Herb Baked Salmon",
                        description: "Simple and flavorful baked salmon with lemon and fresh herbs.",
                        prepTime: 5,
                        cookTime: 20,
                        rating: 5,
                        ingredients: [
                            {name: "salmon fillets", quantity: 4, unit: "count"},
                            {name: "lemon", quantity: 1, unit: "count"},
                            {name: "olive oil", quantity: 2, unit: "tbsp"},
                            {name: "fresh dill", quantity: 1, unit: "tbsp"},
                            {name: "salt", quantity: 1, unit: "tsp"}
                        ],
                        instructions: [
                            "Preheat oven to 400°F (200°C).",
                            "Place salmon on a baking sheet.",
                            "Drizzle with olive oil, sprinkle with salt and chopped dill.",
                            "Slice lemon and place slices on top of each fillet.",
                            "Bake for 15-20 minutes, or until cooked through."
                        ],
                        tags: ["Seafood", "Healthy", "Dinner"],
                        servings: 4
                    },
                    {
                        id: 7,
                        coverImage: "./rest_recipe.jpg",
                        title: "Recipe 7",
                        foodName: "Tomato Basil Soup",
                        description: "A classic, comforting, creamy tomato soup with fresh basil.",
                        prepTime: 10,
                        cookTime: 30,
                        rating: 4,
                        ingredients: [
                            {name: "canned crushed tomatoes", quantity: 800, unit: "g"},
                            {name: "vegetable broth", quantity: 500, unit: "ml"},
                            {name: "onion", quantity: 0.5, unit: "medium"},
                            {name: "fresh basil", quantity: 0.5, unit: "cup"},
                            {name: "heavy cream", quantity: 50, unit: "ml"}
                        ],
                        instructions: [
                            "Sauté chopped onion until soft.",
                            "Add crushed tomatoes and vegetable broth; bring to a simmer.",
                            "Stir in chopped fresh basil.",
                            "Use an immersion blender to blend until smooth (optional).",
                            "Stir in heavy cream and heat through before serving."
                        ],
                        tags: ["Vegetarian", "Comfort Food", "Soup"],
                        servings: 4
                    },
                ]
            }
        }
    },
}
const LOCALSTORAGEKEY = "RecipeCS472"
let localData = null;
localData = fetchLocalData();
pushLocalData();

/**
 * write localData into localStorage
 */
function pushLocalData() {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(localData));
}

/**
 * read localData from localStorage
 */
function fetchLocalData() {
    let data;
    let d = localStorage.getItem(LOCALSTORAGEKEY);
    if (d) {
        // console.log("Data exists!")
        data = JSON.parse(d);
    } else {
        // console.log("No data found.");
        data = sampleRecipeCS472;
    }
    return data;
}

/**
 * Returns all recipes under public
 * @returns {[]|CryptoKey|*} Array of recipe object
 */
function getPublicRecipes() {
    return localData.public;
}

/**
 * add single recipe into localStorage under public
 * @param recipe recipe object
 */
function addPublicRecipe(recipe) {
    localData.public.push(recipe);
    pushLocalData(recipe);
}

/**
 * Returns entire file system of given user from root.
 * @param UID
 * @returns {FS} File system object
 */
function getUserFS(UID = "user1") {
    return localData.private[UID].FS;
}

/**
 * Find folder object from FS object given path and user
 * @param {node[]}pathArr array of nodes from root (ex: ['root', 'a', 'b'] for root/a/b folder
 * @param UID user name
 * @returns {node|Boolean} return folder object if successful. false otherwise.
 */
function findFolder(pathArr, UID = "user1") {
    let node = localData.private[UID].FS;
    for (let i = 1; i < pathArr.length; i++) {
        const name = pathArr[i];
        if (!node.children)
            return false;
        node = node.children.find(c => c.title === name);
        if (!node)
            return false;
    }
    return node;
}

/**
 *
 * @param folderName new folder name
 * @param {node[]}pathArr array of nodes from root (ex: ['root', 'a', 'b'] for root/a/b folder
 * @param UID user name
 * @returns {boolean} true if successful
 * @description
 * take array of nodes as path and add a new folder
 */
function addPrivateFolder(folderName, pathArr, UID = "user1") {
    let node = findFolder(pathArr, UID);
    if (node) {
        if (node.children.find(c => c.title === folderName)) {
            alert(folderName + " already exists!");
            return false;
        }
        let newFolder = {title: folderName, type: "folder", children: []};
        node.children.push(newFolder);
        pushLocalData();
        return true;
    }
    return false;
}


/**
 *
 * @param recipe new recipe object to add
 * @param {node[]}pathArr array of nodes from root (ex: ['root', 'a', 'b'] for root/a/b folder
 * @param UID user name
 * @returns {boolean} true if successful
 * @description
 * take array of nodes as path and add a new recipe
 */
function addPrivateRecipe(recipe, pathArr, UID = "user1") {
    let node = findFolder(pathArr, UID);
    if (node) {
        if(node.children.find(c=>c.title===recipe.title)){
            alert(recipe.title + " already exists!");
            return false;
        }
        node.children.push(recipe);
        pushLocalData();
        return true;
    }
    return false;
}


/**
 * Replaces fraction characters (e.g., ½, ¼, ⅓) in a string
 * with their decimal equivalents. (e.g., .5, .25, .333)
 *
 * It handles both:
 * - Whole number + space + fraction (e.g., "2 ½")
 * - Whole number + fraction (e.g., "2½")
 *
 * @param {string} inputString The string containing whole numbers and fractions.
 * @returns {string} The string with fractions converted to decimals.
 */
function convertFractionsToDecimals(inputString) {
    const fractionMap = {
        // Unicode Fractions
        '½': '.5',
        '⅓': '.333',
        '⅔': '.667',
        '¼': '.25',
        '¾': '.75',
        '⅕': '.2',
        '⅖': '.4',
        '⅗': '.6',
        '⅘': '.8',
        '⅙': '.167',
        '⅚': '.833',
        '⅛': '.125',
        '⅜': '.375',
        '⅝': '.625',
        '⅞': '.875',

        '1/2': '.5',
        '1/3': '.333',
        '2/3': '.667',
        '1/4': '.25',
        '3/4': '.75',
        '1/5': '.2',
        '2/5': '.4',
        '3/5': '.6',
        '4/5': '.8',
        '1/6': '.167',
        '5/6': '.833',
        '1/8': '.125',
        '3/8': '.375',
        '5/8': '.625',
        '7/8': '.875'
    };

    const keys = Object.keys(fractionMap)
        .sort((a, b) => b.length - a.length)
        .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const fractionPattern = keys.join('|');


    const fractionRegex = new RegExp(`(\\d*)\\s*(${fractionPattern})`, 'g');

    return inputString.replace(fractionRegex, (match, wholeNumber, fractionChar) => {
        const decimalValue = fractionMap[fractionChar];
        if (decimalValue) {
            return (wholeNumber || "") + decimalValue;
        }
        return match;
    });
}


/**
 * take ID for themealdb.com API and return promise with Recipe object
 * Warning: Amounts are in string. Some may include non-numeral strings (i.e. 400g)
 * @param id
 * @returns {Promise<{Recipe}>}
 */
async function apiID2localRecipe(id) {
    const baseurl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
    return fetch(baseurl + id)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(json => processApiJson(json));
}

/**
 * Calls themealdb.com API for a random meal and returns promise with Recipe object
 * @returns {Promise<{Recipe}>}
 */
async function apiRandom2localRecipe() {
    const randomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
    return fetch(randomUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(json => processApiJson(json));
}

/**
 * Helper function to process API JSON response into local Recipe object
 * for API call returning ONLY ONE MEAL
 * if you want to convert fractions into decimals, set conversion=true
 * @param json
 * @param conversion
 * @returns {{Recipe}}
 */
function processApiJson(json, conversion=false) {
    let newRecipe = {}
    if (!json.meals || json.meals.length === 0) {
        throw new Error("Recipe not found.");
    }
    let meal = json['meals'][0]
    newRecipe.id = meal['idMeal'];
    newRecipe.coverImage = meal['strMealThumb'];
    newRecipe.instructions = meal['strInstructions'] ? meal['strInstructions'].split(/(?<=[.?!])\s+(?=[A-Z])/) : [];
    newRecipe.title = meal['strMeal'];
    newRecipe.description = (meal['strArea'] || '') + " " + (meal['strCategory'] || '') + " " + (meal['strMeal'] || '');
    newRecipe.foodName = meal['strMeal'];

    newRecipe.tags = meal['strTags'] ? meal['strTags'].split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    if (meal['strArea']) {
        newRecipe.tags.push(meal['strArea']);
    }
    if (meal['strCategory']) {
        newRecipe.tags.push(meal['strCategory']);
    }

    newRecipe.ingredients = []
    newRecipe.amounts= []
    newRecipe.units = []

    // Loop for ingredients and measures (up to 20 pairs in TheMealDB API)
    for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`;
        const measureKey = `strMeasure${i}`;

        const ingredient = meal[ingredientKey] ? meal[ingredientKey].trim() : null;
        const measure = meal[measureKey] ? meal[measureKey].trim() : null;

        if (!ingredient) {
            break;
        }

        newRecipe.ingredients.push(ingredient);

        if (measure) {

            if (conversion){
                let measurestr = convertFractionsToDecimals(measure);
                // console.log(measure);
                // console.log(measurestr);
                let measureParts = measurestr.split(/\s+/).filter(part => part); // Split by whitespace
            }else{
                let measureParts = measure.split(/\s+/).filter(part => part); // Split by whitespace
            }


            if (measureParts.length === 0) {
                newRecipe.amounts.push("");
                newRecipe.units.push("");
            } else if (measureParts.length === 1) {
                // Check if the single part looks like a number (amount) or a string (unit/full measure)
                if (!isNaN(parseFloat(measureParts[0])) && isFinite(measureParts[0])) {
                    newRecipe.amounts.push(measureParts[0]);
                    newRecipe.units.push(""); // Assume it's just an amount
                } else {
                    newRecipe.amounts.push("");
                    newRecipe.units.push(measureParts[0]); // Assume it's a full unit description (e.g., "a handful")
                }
            } else {
                // Simple logic for amount/unit split: assumes first part is amount, rest is unit
                newRecipe.amounts.push(measureParts[0]);
                newRecipe.units.push(measureParts.slice(1).join(' '));
            }
        } else {
            newRecipe.amounts.push("");
            newRecipe.units.push("");
        }
    }

    //API does not support these
    //random cook, prep time by 5min window
    newRecipe.cookTime = Math.floor(Math.random() * (24 - 3) + 3) * 5;
    newRecipe.prepTime = Math.floor(Math.random() * (6 - 1) + 1) * 5;
    newRecipe.servings = 1;
    newRecipe.favorite=false;
    newRecipe.rating = 0;

    return newRecipe;
}


export {
    localData,
    getPublicRecipes,
    addPublicRecipe,
    getUserFS,
    findFolder,
    addPrivateFolder,
    addPrivateRecipe,
    apiID2localRecipe,
    apiRandom2localRecipe,
}