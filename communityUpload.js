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

const API_KEY = "Your-Api-Key";

const emptyHeart = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      <path
        fill="#f75069"
        d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"
      />
    </svg>`;

const heart = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      <path 
        fill="#f75069" 
        d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"
      />
    </svg>`;

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
        image: recipe.image,
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
  cardDiv.className = "card";

  // 1. Image
  const imgDiv = document.createElement("div");
  imgDiv.className = "card-img-container";
  const img = document.createElement("img");
  img.src = cardData.image;
  img.alt = cardData.title;
  img.onerror = (e) => {
    e.target.onerror = null;
    e.target.src = "test_recipe.jpg";
  };
  img.className = "card-img";
  imgDiv.appendChild(img);
  cardDiv.appendChild(imgDiv);

  // 2. Title
  const titleDiv = document.createElement("div");
  titleDiv.className = "card-title-container inter";
  const title = document.createElement("h3");
  title.innerText = cardData.title;
  title.className = "card-title";
  titleDiv.appendChild(title);
  cardDiv.appendChild(titleDiv);

  const flexDiv = document.createElement("div");
  flexDiv.className = "flex-space-between-container";
  const user = document.createElement("div");
  user.className = "user-info";

  // 3. Avatar
  const avatar = document.createElement("img");
  const id = getRandomInt(10, 90);
  avatar.src = `https://avatar.iran.liara.run/public/${id}`;
  avatar.className = "card-avatar";
  user.appendChild(avatar);

  // 4. Author
  const author = document.createElement("p");
  author.innerText = `${cardData.author}`;
  author.className = "card-author inter";
  user.appendChild(author);
  flexDiv.appendChild(user);

  // 5. Like Button
  const likeBtn = document.createElement("button");
  likeBtn.innerHTML = cardData.like ? heart : emptyHeart;
  likeBtn.className = "card-like-btn";

  // Optional: Add click interactivity
  likeBtn.onclick = () => {
    cardData.like = !cardData.like;
    likeBtn.innerHTML = cardData.like ? heart : emptyHeart;
  };
  flexDiv.appendChild(likeBtn);
  cardDiv.appendChild(flexDiv);

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
