function createRecipesCards(recipes) {
  const arrayOfRecipesCards = [];
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
  
    const recipeImgContainer = document.createElement("div");
    recipeImgContainer.classList.add("recipe-img-container");
    const recipeImg = document.createElement("img");
    recipeImg.src = `images/recipes/${recipe.image}`;
    recipeImgContainer.appendChild(recipeImg);
    const recipeTime = document.createElement("div");
    recipeTime.classList.add("recipe-time");
    recipeTime.textContent = `${recipe.time} min`;
    recipeImgContainer.appendChild(recipeTime);
  
    const recipeCardContent = document.createElement("div");
    recipeCardContent.classList.add("recipe-card-content");
    const recipeTitle = document.createElement("div");
    recipeTitle.classList.add("recipe-title");
    recipeTitle.textContent = recipe.name;
    recipeCardContent.appendChild(recipeTitle);
    const recipeDescriptionContainer = document.createElement("div");
    recipeDescriptionContainer.classList.add("recipe-description-container");
    const recipeDescriptionTitle = document.createElement("div");
    recipeDescriptionTitle.classList.add("recipe-description-title");
    recipeDescriptionTitle.textContent = "Recette";
    recipeDescriptionContainer.appendChild(recipeDescriptionTitle);
    recipeCardContent.appendChild(recipeDescriptionContainer);
    const recipeDescriptionText = document.createElement("p");
    recipeDescriptionText.classList.add("recipe-description-text");
    recipeDescriptionText.textContent = recipe.description;
    recipeDescriptionContainer.appendChild(recipeDescriptionText);
    const recipeIngredients = document.createElement("div");
    recipeIngredients.classList.add("recipe-ingredients");
    const recipeIngredientsTitle = document.createElement("div");
    recipeIngredientsTitle.classList.add("recipe-ingredients-title");
    recipeIngredientsTitle.textContent = "Ingrédients";
    recipeIngredients.appendChild(recipeIngredientsTitle);
    recipeCardContent.appendChild(recipeIngredients);
    const recipeIngredientsGrid = document.createElement("div");
    recipeIngredientsGrid.classList.add("recipe-ingredients-grid");
    recipeIngredients.appendChild(recipeIngredientsGrid);
    for (const ingredient of recipe.ingredients) {
      const recipeIngredientsItem = document.createElement("div");
      recipeIngredientsItem.classList.add("recipe-ingredients-item");
      const recipeIngredientsItemName = document.createElement("div");
      recipeIngredientsItemName.classList.add("recipe-ingredients-item-name");
      recipeIngredientsItemName.textContent = ingredient.ingredient;
      recipeIngredientsItem.appendChild(recipeIngredientsItemName);
      const recipeIngredientsItemQuantity = document.createElement("div");
      recipeIngredientsItemQuantity.classList.add(
        "recipe-ingredients-item-quantity"
      );
      recipeIngredientsItemQuantity.textContent = `${(ingredient.quantity ?? "")} ${ingredient.unit ?? ""}`;
      recipeIngredientsItem.appendChild(recipeIngredientsItemQuantity);
      recipeIngredientsGrid.appendChild(recipeIngredientsItem);
    }
  
    recipeCard.appendChild(recipeImgContainer);
    recipeCard.appendChild(recipeCardContent);

    arrayOfRecipesCards.push(recipeCard);
  })

  
  return arrayOfRecipesCards;
}

function createFilterElement(filtersList, filtersSelected = []) {
  const filtersElementsList = [];
  filtersList.forEach((filter) => {
    const filterElement = document.createElement("div");
    filterElement.textContent = filter;
    filterElement.classList.add('active');
    const crossElement = document.createElement("img");
    crossElement.src = "./icons/cross-rounded-black.svg";
    filterElement.appendChild(crossElement);

    filtersElementsList.push({
      filterElement,
      crossElement
    })
  })

    // Si filterSelected n'est pas vide, je vérifie pour chaque filtre s'il est égal à un des filtres sélectionnés
    if(filtersSelected.length > 0) {
      filtersElementsList.forEach((filterElement) => {
        console.log(filterElement.filterElement.textContent);
        if(filtersSelected.includes(filterElement.filterElement.textContent)) {
          filterElement.filterElement.classList.add("is-selected");
        }
      })
    }


  return filtersElementsList;
}

function createSearchItem(filterName, type) {
  const divElement = document.createElement("div");
  divElement.className = "search-item";
  divElement.setAttribute('filter-type', type);
  divElement.setAttribute('name', filterName.split(" ").join("-"));

  const pElement = document.createElement("p");
  pElement.className = "search-item-name";
  pElement.textContent = filterName;

  const imgElement = document.createElement("img");
  imgElement.className = "search-item-close";
  imgElement.src = "./icons/cross.svg";

  divElement.appendChild(pElement);
  divElement.appendChild(imgElement);

  return { divElement, imgElement };
}
