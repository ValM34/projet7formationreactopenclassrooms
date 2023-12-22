window.addEventListener('load', () => {
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(recipes => {

      // Show all recipes on page load
      const activesFilters = getActivesFilters();
      let recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
      let recipesCardElements = createRecipesCards(recipesCard);
      const recipesContainer = document.querySelector('#recipes_container');
      recipesCardElements.forEach((recipeCardElement) => {
        recipesContainer.appendChild(recipeCardElement);
      })

      function getFilters(recipes) {
        const mainSearchBar = document.querySelector("#search");
        const recipeListByInputValue = searchRecipes(mainSearchBar.value, recipes);
        function addToList(filtersList, filter) {
          if(!filtersList.includes(filter)) {
            filtersList.push(filter);
          }
        }
        const ingredientsList = [];
        const appliancesList = [];
        const ustensilsList = [];
        recipeListByInputValue.forEach((recipe) => {
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

        const mainSearchBar = document.querySelector("#search");
        const recipeListByInputValue = searchRecipes(mainSearchBar.value, recipes);

        // Push recipes by filters
        function filter (recipe, filtersListByRecipe, selectedFiltersList, arrayToModify) {
          if (selectedFiltersList.every((selectedFilter) => filtersListByRecipe.includes(selectedFilter))) {
            arrayToModify.push(recipe);
          }
        }

        // Filter recipes based on selected ingredients
        if (ingredientsFilters.length > 0) {
          recipeListByInputValue.forEach((recipe) => {
            const ingredientsListByRecipe = [];
            recipe.ingredients.forEach((ingredient) => {
              ingredientsListByRecipe.push(ingredient.ingredient);
            });
            filter (recipe, ingredientsListByRecipe, ingredientsFilters, recipesThatMatchWithIngredientsFilters);
          });
        } else {
          recipesThatMatchWithIngredientsFilters = recipeListByInputValue;
        }

        // Filter recipes based on selected appliances
        if (appliancesFilters.length > 0) {
          recipesThatMatchWithIngredientsFilters.forEach((recipe) => {
            filter (recipe, recipe.appliance, appliancesFilters, recipesThatMatchWithAppliancesFilters);
          });
        } else {
          recipesThatMatchWithAppliancesFilters = recipesThatMatchWithIngredientsFilters;
        }

        // Filter recipes based on selected ustensils
        if (ustensilsFilters.length > 0) {
          recipesThatMatchWithAppliancesFilters.forEach((recipe) => {
            filter (recipe, recipe.ustensils, ustensilsFilters, recipesThatMatchWithUstensilsFilters);
          });
        } else {
          recipesThatMatchWithUstensilsFilters = recipesThatMatchWithAppliancesFilters;
        }

        newRecipesList = recipesThatMatchWithUstensilsFilters;
        
        return newRecipesList;
      }

      function searchRecipes(inputValue, recipes) {
        if(inputValue.length < 3) {
          
          return recipes;
        }
        let searchResult = [];
        recipes.forEach((recipe) => {
          if(
            recipe.name.toLowerCase().includes(inputValue.toLowerCase()) || 
            recipe.description.toLowerCase().includes(inputValue.toLowerCase()) || 
            !recipe.ingredients.every((ingredient) => ingredient.ingredient.toLowerCase().includes(inputValue.toLowerCase()) === false)
          ) {
            searchResult.push(recipe);
          }
        })
      
        return searchResult;
      }

      // Handle main search bar
      let lastInputValueLength;
      const mainSearchBar = document.querySelector("#search");
      mainSearchBar.addEventListener('input', (e) => {
        if(e.target.value.length >= 3) {
          const activesFilters = getActivesFilters();
          const recipesByFilters = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
          const newRecipesList = searchRecipes(e.target.value, recipesByFilters);
          const recipesContainer = document.querySelector('#recipes_container');
          if(newRecipesList.length === 0) {
            recipesContainer.textContent = `Aucune recette ne contient "${e.target.value}" vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
          } else {
            recipesContainer.textContent = "";
          }
          let recipesCardElements = createRecipesCards(newRecipesList);
          recipesCardElements.forEach((recipeCardElement) => {
            recipesContainer.appendChild(recipeCardElement);
          })
        } else {
          if(lastInputValueLength > e.target.value.length) {
            const activesFilters = getActivesFilters();
            const recipesByFilters = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
            const recipesCardElements = createRecipesCards(recipesByFilters);
            const recipesContainer = document.querySelector('#recipes_container');
            recipesContainer.textContent = "";
            recipesCardElements.forEach((recipeCardElement) => {
              recipesContainer.appendChild(recipeCardElement);
            })
          }
        }
        lastInputValueLength = e.target.value.length;
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

      function handleDropdown(type) {
        const ingredientDropdownFilters = document.querySelector(`#select_${type}s_filter`);
        ingredientDropdownFilters.addEventListener('click', () => {
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
                    const recipesCard = getRecipesByFilters(recipes, activesFilters.ingredientsFilters, activesFilters.appliancesFilters, activesFilters.ustensilsFilters);
                    console.log(recipesCard)
                    const recipesCardElements = createRecipesCards(recipesCard);
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
            if(!filterElement.textContent.toLowerCase().includes(miniSearchBarInput.value.toLowerCase())) {
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
