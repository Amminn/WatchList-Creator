const moviePlace = document.querySelector(".movies .container");

/* getting the movie list data from localStorage */
let movieList = JSON.parse(localStorage.getItem("movies"));

/* Rendering the movies */
async function render() {
  /* looping on all the movies of the list using their only imdbID */
  for (const item of movieList) {
    const resp = await fetch(
      `https://www.omdbapi.com/?i=${item}&apikey=eedb40e`
    );
    const movieDate = await resp.json();

    /* Checking if the Plot has more than 133 letter, if it is show only 133 and add '...' in the end */
    const content =
      movieDate.Plot.length >= 133
        ? movieDate.Plot.substring(0, 133) + "..."
        : movieDate.Plot;

    /* Rendering the movies with html css*/
    moviePlace.innerHTML += `
          <article class="movie" id="${movieDate.imdbID}">
          <!--  <p class="imdbID" style="display: none;">${movieDate.imdbID}</p> -->
              <div class="image">
                <img src="${movieDate.Poster}" alt="${movieDate.Title}'s Poster">
              </div>
              <div class="text">
                  <h2>
                    ${movieDate.Title}
                    <span class="rate">
                    <img src="./images/star.png" alt="star icon">
                    ${movieDate.imdbRating}
                    </span>
                  </h2>
                  <p class="duration-type">
                    <span class="duration">${movieDate.Runtime}</span>
                    <span class="type">${movieDate.Genre}</span>
                    <span class="add" id="${movieDate.imdbID}">
                      <img src='./images/remove.png' alt=''>
                      remove
                    </span>
                  </p>
                  <p class="content">${content}</p>
              </div>
          </article>
        `;
  }

  removeBtns = document.querySelectorAll(".add");
  removeBtns.forEach((element) => {
    element.addEventListener("click", function adding() {
      element.removeEventListener("click", adding);
      let imbdID = element.id;
      // console.log(imbdID)
      document.getElementById(`${imbdID}`).remove();
      element.innerHTML = `<span class="add"><img src='./images/remove.png' alt=''>removed</span>`;
      // preLocalStorage.includes(imbdID) ? console.log('this element is already there') : preLocalStorage.unshift(imbdID)

      /* Removing the movie from the list */
      let movieDelete = movieList.indexOf(imbdID);
      movieList.splice(movieDelete, 1);

      // Deleting localStorage data and then submitting the new data
      localStorage.removeItem("movies");
      window.localStorage.setItem("movies", JSON.stringify(movieList));

      // In case there is no movie offer the user to go back to the search page
      movieList === null || movieList.length == 0
        ? (moviePlace.innerHTML = `
          <div class="film">
            <h2>Your watchlist is looking a little empty...</h2>
            <p class="add">
              <img src="./images/add.png" alt="" />
              <a href="./index.html">Let’s add some movies!</a>
            </p>
          </div>`)
        : "";
    });
  });
}

/* Checking if the localStorage has data if true call the render function of not offer the user to go back to the search page */
movieList === null || movieList.length == 0
  ? (moviePlace.innerHTML = `
  <div class="film">
    <h2>Your watchlist is looking a little empty...</h2>
    <p class="add">
      <img src="./images/add.png" alt="" />
      <a href="./index.html">Let's add some movies!</a>
    </p>
  </div>`)
  : render();
