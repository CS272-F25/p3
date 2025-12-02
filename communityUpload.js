/**
 * card:
 * {
 * image: string,
 * title: string,
 * author: string,
 * like: boolean,
 * }
 */

const hardCodedAuthors = [
  "NeonViper",
  "GlitchWizard",
  "ShadowByte",
  "QuantumDrifter",
  "PixelSamurai",
  "CyberPunk_X",
  "NullPointer",
  "VelvetThunder",
  "IronWombat",
  "SolarFlare",
  "MidnightCoder",
  "EchoChamber",
  "FrostTitan",
  "DigitalGhost",
  "TurboCorgi",
  "VortexJumper",
  "SilentStorm",
  "BinaryBanshee",
  "RoguePixel",
  "ZenMaster_99",
];

const communityRecipes = [];

const DISPLAY_NUM = 20;

const API_KEY = "YOUR_SPOONACULAR_API_KEY_HERE";

// Get recipes from Spoonacular
fetch(`https://api.spoonacular.com/recipes/random?number=${DISPLAY_NUM}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Iterate through the fetched recipes
    data.recipes.forEach((recipe, index) => {
      // Create the card object based on the required schema
      const card = {
        image: recipe.image || "https://via.placeholder.com/300", // Fallback image
        title: recipe.title,
        // Assign an author from the hardcoded list based on the index
        author: hardCodedAuthors[index % hardCodedAuthors.length],
        like: false,
      };

      communityRecipes.push(card);
    });

    // Once data is processed, generate the HTML
    loadCardsToHTML();
  })
  .catch((error) => {
    console.error("Error fetching recipes:", error);
  });

// Generate the HTML element for a single card
function createCardDiv(cardData) {
  // Create container
  const cardDiv = document.createElement("div");
  cardDiv.className = "card"; // Useful for CSS styling

  // 1. Image
  const img = document.createElement("img");
  img.src = cardData.image;
  img.alt = cardData.title;
  img.className = "card-img";
  cardDiv.appendChild(img);

  // 2. Title
  const title = document.createElement("h3");
  title.innerText = cardData.title;
  title.className = "card-title";
  cardDiv.appendChild(title);

  // 3. Author
  const author = document.createElement("p");
  author.innerText = `@${cardData.author}`;
  author.className = "card-author";
  cardDiv.appendChild(author);

  // 4. Like Button (Visual representation)
  const likeBtn = document.createElement("button");
  likeBtn.innerText = cardData.like ? "♥ Liked" : "♡ Like";
  likeBtn.className = "card-like-btn";

  // Optional: Add click interactivity
  likeBtn.onclick = () => {
    cardData.like = !cardData.like;
    likeBtn.innerText = cardData.like ? "♥ Liked" : "♡ Like";
  };
  cardDiv.appendChild(likeBtn);

  return cardDiv;
}

// Loop through the array and append to the DOM
function loadCardsToHTML() {
  const container = document.getElementById("card-list");

  // Clear container just in case
  container.innerHTML = "";

  communityRecipes.forEach((cardData) => {
    const cardElement = createCardDiv(cardData);
    container.appendChild(cardElement);
  });
}
