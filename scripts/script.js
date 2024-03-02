document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchbox');
    const submitBtn = document.getElementById('submit');
    const recipeList = document.getElementById('recipeList');
    const form = document.getElementById('search_form');

    let nextPageUrl;
    let previousPages = [];
    let prevPageUrl;


    const APP_ID = '9af66a6d';
    const APP_KEY = '0944d15e8638421455a20559e52ab018';

    form.addEventListener('submit', async(e) => {

        e.preventDefault();
        const searchQuery = searchInput.value;
        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`;

        fetchSearchData(url);

    });

    const nextPageButton = document.getElementById('next_page');
    nextPageButton.addEventListener('click', fetchNextPage);

    const prevPageButton = document.getElementById('prev_page');
    prevPageButton.addEventListener('click', fetchPrevPage);


    function showLoading() {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.display = 'block';
    }

    function hideLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.display = 'none';
    }

    async function fetchPrevPage(url) {

        showLoading();

        try {
            if (previousPages.length > 1) {

                previousPages.pop();
                prevPageUrl = previousPages[previousPages.length - 1];

                const prevPageResponse = await fetch(prevPageUrl);
                const prevPageData = await prevPageResponse.json();

                displayRecipes(prevPageData.hits);

            }
        } catch (error) {

            console.error("Error fetching previous page.", error.message);

        } finally {

            hideLoading();

        }

    }

    async function fetchSearchData(url) {

        previousPages = [];

        showLoading();

        try {
            // Make a request to the API and wait for it to complete so that we can access its data
            const response = await fetch(url);

            const data = await response.json();
            displayRecipes(data.hits);

            if (data && data._links && data._links.next) {

                prevPageButton.style.borderColor = '#0f1523';

                nextPageUrl = data._links.next.href;
                nextPageButton.style.borderColor = '#9048dc';

                previousPages.push(url);
            }


        } catch (error) {

            console.error('Error fetching data:', error.message);
            //Incase an error has been returned from the API

        } finally {
            hideLoading();
        }
    }

    async function fetchNextPage() {
        if (nextPageUrl) {

            showLoading();

            try {

                const nextPageResponse = await fetch(nextPageUrl);
                const nextPageData = await nextPageResponse.json();
                displayRecipes(nextPageData.hits);

                if (nextPageData && nextPageData._links && nextPageData._links.next) {

                    nextPageUrl = nextPageData._links.next.href;
                    nextPageButton.style.borderColor = '#9048dc';

                    previousPages.push(nextPageUrl);

                    prevPageButton.style.borderColor = '#9048dc';
                } else {

                    nextPageUrl = '';
                    nextPageButton.style.borderColor = '#0f1523';

                }

            } catch (error) {

                console.error('Error fetching next page data:', error.message);
            } finally {

                hideLoading();

            }
        }
    }

    function displayRecipes(recipes) {

        if (previousPages.length === 1) {

            prevPageButton.style.borderColor = '#0f1523';

        };

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

            const footer = document.getElementById('footer');
            footer.style.display = 'flex';

        });
    }

});