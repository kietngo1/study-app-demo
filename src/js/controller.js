import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable'; // pollyfilling anything else
import 'regenerator-runtime/runtime'; // pollyfilling async/await



const showRecipe = async function() {
  try {
    // get hash id from url
    const hashId = window.location.hash.slice(1);

    if(!hashId) return; 
    // render spinner load
    recipeView.renderSpinner();

    // Cập nhập highlight recipe trong results và bookmarks
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarked);

    //// loading recipe
    await model.loadRecipe(hashId);

    //// Render recipe
    recipeView.render(model.state.recipe);  
  
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const showSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // lấy query trên thanh tìm kiếm
    const query = searchView.getQuery();
    if(!query) return;

    // Load kết quả tìm kiếm
    await model.loadSearchRecipe(query);

    // Render kết quả tìm kiếm ban đầu (trang đầu tiên)
    resultsView.render(model.getSearchResultsPage());

    // Render nút pagination ban đầu (ở trang đầu tiên)
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
}

const controlPagination = function(goToPage) {
  // Render các kết quả mới khi user bấm qua trang
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render các nút pagination mới
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Cập nhập recipe servings trong state
  model.updateServings(newServings);
  // Cập nhập recipe view 
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // Thêm/xóa bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id)
  
  // Cập nhập recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks 
  bookmarkView.render(model.state.bookmarked);
}

const controlRenderBookmarksInit = function() {
  bookmarkView.render(model.state.bookmarked);
}

const controlAddRecipe = function(newRecipe) {
  console.log(newRecipe);
}


const init = function() {
  bookmarkView.addHandlerBookmarksInit(controlRenderBookmarksInit);
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerSearch(showSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
}
init();


