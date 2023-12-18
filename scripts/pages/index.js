window.addEventListener('load', () => {
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(recipes => {

      function getFilters(recipes) {
        function addToList(filtersList, filter) {
          if(!filtersList.includes(filter)) {
            filtersList.push(filter);
          }
        }
        const ingredientsList = [];
        const appliancesList = [];
        const ustensilsList = [];
        recipes.forEach((recipe) => {
          // Push list of ingredients
          recipe.ingredients.forEach((ingredient) => {
            addToList(ingredientsList, ingredient.ingredient);
          });
          // Push list of appliances
          addToList(appliancesList, recipe.appliance);
          // Push list of ustensils
          recipe.ustensils.forEach((ustensil) => {
            addToList(ustensilsList, ustensil);
          });
        });

        return { ingredientsList, appliancesList, ustensilsList };
      }

      function getRecipesByFilters(recipes, ingredientsFilters = [], appliancesFilters = [], ustensilsFilters = []) {
        let newRecipesList = [];
        let recipesThatMatchWithIngredientsFilters = [];
        let recipesThatMatchWithAppliancesFilters = [];
        let recipesThatMatchWithUstensilsFilters = [];

        // Filtre les recettes en fonction des filtres sélectionnés
        function filter (recipe, filtersListByRecipe, selectedFiltersList, arrayToModify) {
          if (selectedFiltersList.every((selectedFilter) => filtersListByRecipe.includes(selectedFilter))) {
            arrayToModify.push(recipe);
          }
        }

        // Filtrer les recettes en fonction de la liste des ingrédients disponibles
        if (ingredientsFilters.length > 0) {
          // Pour chaque recette si la recette contient tous les filtres alors on la push dans la liste newRecipesList
          recipes.forEach((recipe) => {
            // Les ingrédients sont des objets, j'ai besoin d'un tableau de chaînes de caractères des noms d'ingrédients par recette
            const ingredientsListByRecipe = [];
            recipe.ingredients.forEach((ingredient) => {
              ingredientsListByRecipe.push(ingredient.ingredient);
            });
            filter (recipe, ingredientsListByRecipe, ingredientsFilters, recipesThatMatchWithIngredientsFilters);
          });
        } else {
          // Si aucun filtre d'ingrédient n'est appliqué, alors on push toutes les recettes
          recipesThatMatchWithIngredientsFilters = recipes;
        }

        // Filtrer les recettes en fonction de la liste des appareils disponibles
        if (appliancesFilters.length > 0) {
          // Pour chaque recette si la recette contient tous les filtres alors on la push dans la liste recipesThatMatchWithAppliancesFilters
          recipesThatMatchWithIngredientsFilters.forEach((recipe) => {
            filter (recipe, recipe.appliance, appliancesFilters, recipesThatMatchWithAppliancesFilters);
          });
        } else {
          // Si aucun filtre d'appareil n'est appliqué, alors on push toutes les recettes
          recipesThatMatchWithAppliancesFilters = recipesThatMatchWithIngredientsFilters;
        }

        // Filtrer les recettes en fonction de la liste des ustensiles disponibles
        if (ustensilsFilters.length > 0) {
          // Pour chaque recette si la recette contient tous les filtres alors on la push dans la liste recipesThatMatchWithUstensilsFilters
          recipesThatMatchWithAppliancesFilters.forEach((recipe) => {
            filter (recipe, recipe.ustensils, ustensilsFilters, recipesThatMatchWithUstensilsFilters);
          });
        } else {
          // Si aucun filtre d'ustensil n'est appliqué, alors on push toutes les recettes
          recipesThatMatchWithUstensilsFilters = recipesThatMatchWithAppliancesFilters;
        }

        newRecipesList = recipesThatMatchWithUstensilsFilters;

        return newRecipesList;
      }

      //let recipesCard = getRecipesByFilters(recipes, ['Lait de coco', 'Jus de citron'], ['Blender'], ['cuillère à Soupe', 'verres', 'presse citron']);
      // Je fais apparaître les recettes non filtrés sur la page
      const activesFilters = getActivesFilters();
      let recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
      let recipesCardElements = createRecipesCards(recipesCard);
      const recipesContainer = document.querySelector('#recipes_container');
      recipesCardElements.forEach((recipeCardElement) => {
        recipesContainer.appendChild(recipeCardElement);
      })

      function searchRecipes(inputValue, recipes) {
        let searchResult = [];
        recipes.forEach((recipe) => {
          if(recipe.name.toLowerCase().includes(inputValue.toLowerCase()) || recipe.description.toLowerCase().includes(inputValue.toLowerCase())){
            searchResult.push(recipe);
          }
        })
      
        return searchResult;
      }

      // Gestion de la barre principale de recherche
      const mainSearchBar = document.querySelector("#search");
      mainSearchBar.addEventListener('change', (e) => {
        // Récupérer la liste actuelle des filtres actifs, récupérer la liste actuelle des recettes puis réaliser la recherche en fonction des recettes
        const activesFilters = getActivesFilters();
        const recipesByFilters = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
        const newRecipesList = searchRecipes(e.target.value, recipesByFilters);
        let recipesCardElements = createRecipesCards(newRecipesList);
        const recipesContainer = document.querySelector('#recipes_container');
        recipesContainer.textContent = "";
        recipesCardElements.forEach((recipeCardElement) => {
          recipesContainer.appendChild(recipeCardElement);
        })
      })


      function getActivesFilters () {
        const ingredientsFiltersDOM = document.querySelectorAll('[filter-type=ingredient]');
        const appliancesFiltersDOM = document.querySelectorAll('[filter-type=appliance]');
        const ustensilsFiltersDOM = document.querySelectorAll('[filter-type=ustensil]');

        const ingredientsFilters = [];
        const appliancesFilters = [];
        const ustensilsFilters = [];

        ingredientsFiltersDOM.forEach((ingredient) => ingredientsFilters.push(ingredient.textContent));
        appliancesFiltersDOM.forEach((appliance) => appliancesFilters.push(appliance.textContent));
        ustensilsFiltersDOM.forEach((ustensil) => ustensilsFilters.push(ustensil.textContent));

        return { ingredientsFilters, appliancesFilters, ustensilsFilters };
      }

      // Refaire le fonctionnement du dropdown mais dans une fonction qui marcherait pour les 3.
      function handleDropdown(type) {
        // Afficher les filtres disponibles quand j'ouvre le dropdown ingrédient
        const ingredientDropdownFilters = document.querySelector(`#select_${type}s_filter`);
        ingredientDropdownFilters.addEventListener('click', () => {
          // Je récupère la liste des recettes pour afficher une liste des filtres correcte
          const activesFilters = getActivesFilters();
          let recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
          const { ingredientsList, appliancesList, ustensilsList } = getFilters(recipesCard);

          const listOfFilters = document.querySelector(`#${type}s_content_filter`);
          if(listOfFilters.classList.contains('active')) {
            listOfFilters.textContent = "";
            listOfFilters.classList.remove('active');
          } else {
            listOfFilters.classList.add('active');
          }

          const allListOfFilters = document.querySelectorAll('.content-filter');
          let filtersElements;
          if(type === "ingredient") {
            filtersElements = createFilterElement(ingredientsList, activesFilters.ingredientsFilters);
            filtersElements.forEach((filterElement) => {
              if(filterElement.filterElement.classList.contains('is-selected')) {
                filterElement.crossElement.addEventListener('click', () => {
                  const searchItemsContainer = document.querySelector('#search_items_container');
                  const attributeOfElementToDelete = filterElement.filterElement.textContent.split(" ").join("-");
                  const elementToDelete = document.querySelector(`[name=${attributeOfElementToDelete}]`);
                  searchItemsContainer.removeChild(elementToDelete);
                  elementToDelete.remove();
                })
              }
            })
            allListOfFilters[1].classList.remove('active');
            allListOfFilters[2].classList.remove('active');
          } else if(type === "appliance") {
            filtersElements = createFilterElement(appliancesList, activesFilters.appliancesFilters);
            filtersElements.forEach((filterElement) => {
              if(filterElement.filterElement.classList.contains('is-selected')) {
                filterElement.crossElement.addEventListener('click', () => {
                  const searchItemsContainer = document.querySelector('#search_items_container');
                  const attributeOfElementToDelete = filterElement.filterElement.textContent.split(" ").join("-");
                  const elementToDelete = document.querySelector(`[name=${attributeOfElementToDelete}]`);
                  searchItemsContainer.removeChild(elementToDelete);
                  elementToDelete.remove();
                })
              }
            })
            allListOfFilters[0].classList.remove('active');
            allListOfFilters[2].classList.remove('active');
          } else if(type === "ustensil") {
            filtersElements = createFilterElement(ustensilsList, activesFilters.ustensilsFilters);
            filtersElements.forEach((filterElement) => {
              if(filterElement.filterElement.classList.contains('is-selected')) {
                filterElement.crossElement.addEventListener('click', () => {
                  const searchItemsContainer = document.querySelector('#search_items_container');
                  const attributeOfElementToDelete = filterElement.filterElement.textContent.split(" ").join("-");
                  const elementToDelete = document.querySelector(`[name=${attributeOfElementToDelete}]`);
                  searchItemsContainer.removeChild(elementToDelete);
                  elementToDelete.remove();
                })
              }
            })
            allListOfFilters[0].classList.remove('active');
            allListOfFilters[1].classList.remove('active');
          }

          // Display/hide miniSearchBar
          const filterInputContainer = document.querySelector(`.filter-input-container[filter-input-container-type=${type}]`);
          filterInputContainer.classList.toggle('active');
          const filterInput = document.querySelector(`#mini_search_bar_${type}`);
          filterInput.value = "";

          listOfFilters.textContent = "";
          filtersElements.forEach((filterElement) => {
            listOfFilters.appendChild(filterElement.filterElement);

            // Add filter event
            filterElement.filterElement.addEventListener('click', (e) => {
              const attributeOfElementToDelete = filterElement.filterElement.textContent.split("-").join(" ");
              const activesFilters = getActivesFilters();
              let testIfFilterIsNotAlreadySelected;
              if(type === "ingredient") {
                testIfFilterIsNotAlreadySelected = activesFilters.ingredientsFilters.every((ingredientFilter) => ingredientFilter !== attributeOfElementToDelete);
              } else if(type === "appliance") {
                testIfFilterIsNotAlreadySelected = activesFilters.appliancesFilters.every((applianceFilter) => applianceFilter !== attributeOfElementToDelete);
              } else if(type === "ustensil") {
                testIfFilterIsNotAlreadySelected = activesFilters.ustensilsFilters.every((ustensilFilter) => ustensilFilter !== attributeOfElementToDelete);
              }
              // If click on a filter
              if(e.target.nodeName === 'DIV') {
                if(testIfFilterIsNotAlreadySelected === true) {
                  const searchItemsContainer = document.querySelector('#search_items_container');
                  const { divElement, imgElement } = createSearchItem(filterElement.filterElement.textContent, type);
                  searchItemsContainer.appendChild(divElement);
    
                  imgElement.addEventListener("click", () => {
                    divElement.remove();
                    const activesFilters = getActivesFilters();
                    let recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
                    let recipesCardElements = createRecipesCards(recipesCard);
                    const recipesContainer = document.querySelector('#recipes_container');
                    recipesContainer.textContent = "";
                    recipesCardElements.forEach((recipeCardElement) => {
                      recipesContainer.appendChild(recipeCardElement);
                    })
                  })
    
                  listOfFilters.textContent = "";
                  listOfFilters.classList.toggle('active');
    
                  const activesFilters = getActivesFilters();
                  let recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
                  let recipesCardElements = createRecipesCards(recipesCard);
                  const recipesContainer = document.querySelector('#recipes_container');
                  recipesContainer.textContent = "";
                  recipesCardElements.forEach((recipeCardElement) => {
                    recipesContainer.appendChild(recipeCardElement);
                  })
                } else {
                  listOfFilters.textContent = "";
                  listOfFilters.classList.toggle('active');
                }
              // Close dropdown if click outside a DIV
              } else {
                listOfFilters.textContent = "";
                listOfFilters.classList.toggle('active');
              }

              // Hide miniSearchBar
              const filterInputContainer = document.querySelector(`.filter-input-container[filter-input-container-type=${type}]`);
              filterInputContainer.classList.remove('active');
              const filterInput = document.querySelector(`#mini_search_bar_${type}`);
              filterInput.value = "";
            })
          })
        })
      }
      handleDropdown('ingredient');
      handleDropdown('appliance');
      handleDropdown('ustensil');

      function handleMiniSearchBar(type) {
        const miniSearchBarInput = document.querySelector(`#mini_search_bar_${type}`);
        miniSearchBarInput.addEventListener('input', () => {
          const filtersElements = document.querySelectorAll(`#${type}s_content_filter > div`);
          filtersElements.forEach((filterElement) => {
            if(!filterElement.textContent.includes(miniSearchBarInput.value)) {
              filterElement.classList.remove('active');
            } else {
              filterElement.classList.add('active');
            }
          })
        })
        const miniSearchBarCross = document.querySelector(`#mini_search_cross_${type}`);
        miniSearchBarCross.addEventListener('click', () => {
          miniSearchBarInput.value = "";
          const filtersElements = document.querySelectorAll(`#${type}s_content_filter > div`);
          filtersElements.forEach((filterElement) => {
              filterElement.classList.add('active');
          })
        })
      }
      handleMiniSearchBar('ingredient');
      handleMiniSearchBar('appliance');
      handleMiniSearchBar('ustensil');


      // Close dropdown quand on clique en dehors
      document.addEventListener("mouseup", function(event) {
        const dropdowns = document.querySelectorAll(".select-filter-container");
        if (!dropdowns[0].contains(event.target) && !dropdowns[1].contains(event.target) && !dropdowns[2].contains(event.target)) {
          const allListOfFilters = document.querySelectorAll(`.content-filter`);
          allListOfFilters.forEach((listOfFilters) => {
            if(listOfFilters.classList.contains('active')) {
              listOfFilters.textContent = "";
              listOfFilters.classList.remove('active');
            }
          })
          // Hide miniSearchBar
          const filterInputContainer = document.querySelectorAll('.filter-input-container');
          filterInputContainer.forEach((filterInputContainer) => {
            if(filterInputContainer.classList.contains('active')) {
              filterInputContainer.classList.remove('active');
            }
          })
          const filtersInput = document.querySelectorAll('.mini-search-bar');
          filtersInput.forEach((filterInput) => {
            filterInput.value = "";
          })
        }
      });
    })
});
