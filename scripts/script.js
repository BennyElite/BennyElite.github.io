document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchbox');
    const submitBtn = document.getElementById('submit');
    const recipeList = document.getElementById('recipeList');
    const form = document.getElementById('search_form');

    const APP_ID = '9af66a6d';
    const APP_KEY = '0944d15e8638421455a20559e52ab018';

    form.addEventListener('submit', async(e) => {

        e.preventDefault();
        const searchQuery = searchInput.value;

        showLoading();

        try {

            const response = await fetch(`https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`);
            const data = await response.json();
            displayRecipes(data.hits);

        } catch (error) {

            console.error('Error fetching data:', error);

        } finally {

            hideLoading();

        }
    });


    function showLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.display = 'block';
    }

    function hideLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.display = 'none';
    }


    function displayRecipes(recipes) {

        recipeList.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe');

            const recipeDetails = document.createElement('div');
            recipeDetails.classList.add('recipeDetails');

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.recipe.label;
            recipeTitle.classList.add('recipeTitle');

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.recipe.image;
            recipeImage.alt = recipe.recipe.label;
            recipeImage.classList.add('thumbnail');

            const ingredientsHeader = document.createElement('h3');
            ingredientsHeader.textContent = 'Ingredients';
            ingredientsHeader.classList.add('ingredientsHeader');

            const recipeIngredients = document.createElement('ul');
            recipe.recipe.ingredients.forEach(ingredient => {
                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = ingredient.text;
                recipeIngredients.appendChild(ingredientItem);
            });
            recipeIngredients.classList.add('ingredientList');

            const recipeCuisine = document.createElement('span');
            recipeCuisine.textContent = `${recipe.recipe.cuisineType}`;
            recipeCuisine.classList.add('cuisine');

            const recipeDish = document.createElement('span');
            recipeDish.textContent = `${recipe.recipe.dishType}`;
            recipeDish.classList.add('dish');

            recipeDetails.appendChild(recipeTitle);
            recipeDetails.appendChild(ingredientsHeader);
            recipeDetails.appendChild(recipeIngredients);
            recipeDetails.appendChild(recipeCuisine);
            recipeDetails.appendChild(recipeDish);

            recipeItem.appendChild(recipeImage);
            recipeItem.appendChild(recipeDetails);

            recipeList.appendChild(recipeItem);
        });
    }
});