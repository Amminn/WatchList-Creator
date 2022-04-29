const input = document.getElementById('input')
const submitBtn = document.getElementById('submit')
const moviePlace = document.querySelector('.movies .container')
const film = document.querySelector('.film')
let addBtns = ''
let searchList = []
let preLocalStorage = []
// preLocalStorage = JSON.parse(window.localStorage.getItem('movies'));
JSON.parse(window.localStorage.getItem('movies')) === null ? preLocalStorage.push('tt3896198') : preLocalStorage = JSON.parse(window.localStorage.getItem('movies'))

submitBtn.addEventListener('click', (e) => {
    /* Prevent the form from reloading the page when submit */
    e.preventDefault()

    /* Getting the value of the input, then clear it*/
    let title = input.value
    input.value = ''

    /* Using async await to make sure the fetch is done working before invoking other functions */
    async function searchForMovies() {
        const response = await fetch(`https://www.omdbapi.com/?apikey=eedb40e&s=${title}`);
        const data = await response.json();
        // console.log(data); // fetched movies data

        /* If there is a mistake */
        if (data.Response == "False") {

            input.value = "This movie is not found"
            moviePlace.innerHTML = `
                <div class="film">
                    <h2>Unable to find what you’re looking for. Please try another search.</h2>
                </div>
            `

            /* If we get the data back */ 
        } else if (data.Response == "True") {
            moviePlace.innerHTML = ''
            searchList = data.Search

            /* Looping on the movies title to get all the info */
            for (const item of searchList) {
                // console.log(item.Title + " " + item.imdbID)
                const resp = await fetch(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=eedb40e`)
                const secondData = await resp.json();  
                /* Checking if the Plot has more than 133 letter, if it is show only 133 and add '...' in the end */
                let content = secondData.Plot
                if (content.length >= 133) {
                    content = content.substring(0, 133)
                    // console.log(content, content.length)
                    content = content.concat("...")
                }
                /* Rendering the movies */
                moviePlace.innerHTML += (`
                    <article class="movie" id="${secondData.imdbID}">
                    <!--  <p class="imdbID" style="display: none;">${secondData.imdbID}</p> -->
                        <div class="image">
                            <img src="${secondData.Poster}" alt="${secondData.Title}'s Poster">
                        </div>
                        <div class="text">
                            <h2>${secondData.Title} <span class="rate"><img src="./images/star.png" alt=""> ${secondData.imdbRating}</span></h2>
                            <p class="duration-type">
                                <span class="duration">${secondData.Runtime}</span>
                                <span class="type">${secondData.Genre}</span>
                                <span class="${preLocalStorage.includes(secondData.imdbID) ? '' : 'add'}" id="${secondData.imdbID}">${preLocalStorage.includes(secondData.imdbID) ? " " : "<img src='./images/add.png' alt=''>Watchlist"}</span>
                            </p>
                            <p class="content">${content}</p>
                        </div>
                    </article>
                `)
            }
        }

        addBtns = document.querySelectorAll('.add')
        addBtns.forEach(element => {
            element.addEventListener('click', function adding() {
                element.removeEventListener('click', adding)
                let imbdID = element.id
                // console.log(imbdID)
                element.textContent = ""
                preLocalStorage.includes(imbdID) ? console.log('this element is already there') : preLocalStorage.unshift(imbdID)
                
                localStorage.removeItem('movies');
                window.localStorage.setItem('movies', JSON.stringify(preLocalStorage));
            })
        })
} /* both fetchs ends here */
searchForMovies();
})