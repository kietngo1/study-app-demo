import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultPerPage: RES_PER_PAGE,
    },
    bookmarked: []
}

export const loadRecipe = async function(hashId) {
    try {
        const data = await getJSON(`${API_URL}/${hashId}`);
        const {recipe} = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }

        if(state.bookmarked.some(bm => bm.id === hashId))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log(state.recipe);
    } catch (error) {
        console.error(error);
        throw error;
    }
    
};

export const loadSearchRecipe = async function(query) {
    try {
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}`);
        console.log(data);
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            }
        })
        state.search.page = 1;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// hàm trả về kết quả tìm kiếm dựa trên số trang 
export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => ing.quantity *= (newServings/state.recipe.servings));

    state.recipe.servings = newServings;
}

const storeBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarked));
}

export const addBookmark = function(recipe) {
    state.bookmarked.push(recipe);
    console.log(state.bookmarked);

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    storeBookmarks();
}


export const deleteBookmark = function(id) {
    const index = state.bookmarked.findIndex(bm => bm.id === id);
    state.bookmarked.splice(index, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    storeBookmarks();
}

const init = function() {
    const storage = JSON.parse(localStorage.getItem('bookmarks'));
    if(storage) state.bookmarked = storage;
}
init();
// console.log(state.bookmarked)