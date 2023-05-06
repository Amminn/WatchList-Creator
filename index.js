const input = document.getElementById("input");
const submitBtn = document.getElementById("submit");
const moviePlace = document.querySelector(".movies .container");

let addBtns = "";
let searchList = [];
let preLocalStorage = [];
preLocalStorage = JSON.parse(window.localStorage.getItem("movies")) || [];

// render the right icon when save or delete the movie
function updateMovie(movieId) {
  const watchlistSpan = document.getElementById(`watchlist-${movieId}`);
  if (watchlistSpan) {
    watchlistSpan.onclick = preLocalStorage.includes(movieId)
      ? () => {
          deleteMovie(movieId);
          updateMovie(movieId);
        }
      : () => {
          addMovie(movieId);
          updateMovie(movieId);
        };
    watchlistSpan.innerHTML = preLocalStorage.includes(movieId)
      ? `<img src='./images/done.png'><span>Saved</span>`
      : `<img src='./images/add.png'><span>WatchList</span>`;
  }
}

// saving the movie using it's id to the localStorage only if not saved already
function addMovie(movieId) {
	console.log('add did run')
	const movieExists  = preLocalStorage.includes(movieId)
	if (!movieExists) {
		preLocalStorage.unshift(movieId)
		localStorage.setItem("movies", JSON.stringify(preLocalStorage));
		updateMovie(movieId)
	}
}

// Delete the movie from localStorage if it exists
function deleteMovie(movieId) {
	console.log('delete did run')
  const movieIndex = preLocalStorage.indexOf(movieId);
  if (preLocalStorage.includes(movieId)) {
    preLocalStorage.splice(movieIndex, 1);
    localStorage.setItem("movies", JSON.stringify(preLocalStorage));
    updateMovie(movieId);
  }
}

submitBtn.addEventListener("click", (e) => {
  /* Prevent the form from reloading the page when submit */
  e.preventDefault();

  /* Getting the value of the input, then clear it*/
  let title = input.value;
  input.value = "";

  /* Using async await to make sure the fetch is done working before invoking other functions */
  async function searchForMovies() {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=eedb40e&s=${title}`
    );
    const data = await response.json();
		// console.log(data)

    /* If there is a mistake */
    if (data.Response === "False") {
      // input.value = "This movie is not found"
      moviePlace.innerHTML = `
				<div class="film">
					<h2>Unable to find what you're looking for. Please try another search.</h2>
				</div>
			`;
      /* If we get the data back */
    } else {
      moviePlace.innerHTML = "";
      searchList = data.Search;

      /* Looping on the movies title to get all the info */
      for (const item of searchList) {
        const resp = await fetch(
          `https://www.omdbapi.com/?i=${item.imdbID}&apikey=eedb40e`
        );
        const secondData = await resp.json();
				// console.log(secondData)

        /* Checking whether the Plot has more than 133 letter, if it is show only 133 letter then add '...' in the end */
        const content =
          secondData.Plot.length >= 133
            ? secondData.Plot.substring(0, 133) + "..."
            : secondData.Plot;

				let imdbID = secondData.imdbID

        /* Rendering the movies */
				moviePlace.innerHTML += `
				<article class="movie" id="${secondData.imdbID}">
				<!--  <p class="imdbID" style="display: none;">${secondData.imdbID}</p> -->
					<div class="image">
						<img src="${secondData.Poster}" alt="${secondData.Title}'s Poster">
					</div>
					<div class="text">
						<h2>
							${secondData.Title}
							<span class="rate">
								<img src="./images/star.png" alt="">
								${secondData.imdbRating}
							</span>
<span
	id="watchlist-${secondData.imdbID}"
	onclick="${preLocalStorage.includes(secondData.imdbID) ? `deleteMovie('${secondData.imdbID}')` : `addMovie('${secondData.imdbID}')`}"
>
	${preLocalStorage.includes(secondData.imdbID)
		? `<img src='./images/done.png'>Saved`
		: `<img src='./images/add.png'>WatchList`
	}
</span>
						</h2>
						<p class="duration-type">
							<span class="duration">${secondData.Runtime}</span>
							<span class="type">${secondData.Genre}</span>
						</p>
						<p class="content">${content}</p>
					</div>
				</article>
				`;
      }
    }

// ========
// <span
// 	id="${secondData.imdbID}"
	// 	class="${preLocalStorage.includes(secondData.imdbID) ? "" : "add"}"
	// >
	// 	${
	// 		preLocalStorage.includes(secondData.imdbID)
	// 		? "<span><img src='./images/done.png' alt=''>Added</span>"
	// 		: "<img src='./images/add.png' alt=''>WatchList"
	// 	}
	// </span>

// ========

		// Get all the <span> tags with class "add"

		// select all elements that are not already saved in localStorage
		// ===========
    // addBtns = document.querySelectorAll(".add");
    // addBtns?.forEach((element) => {
    //   element.addEventListener("click", function adding() {
		// 		// console.log('clicked')
    //     element.removeEventListener("click", adding);
    //     let imbdID = element.id;
    //     element.innerHTML =
    //       "<span><img src='./images/done.png' alt=''>Added</span>";
		// 			preLocalStorage.includes(imbdID)
		// 			? "" : preLocalStorage.unshift(imbdID);

    //     localStorage.removeItem("movies");
    //     window.localStorage.setItem("movies", JSON.stringify(preLocalStorage));
    //   });
    // });
		// ===========
  } /* both fetches ends here */

  searchForMovies();
});
