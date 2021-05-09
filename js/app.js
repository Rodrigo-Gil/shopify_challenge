
const APP = {
    //global variables that will used on the application
    baseURL: 'http://www.omdbapi.com/?apikey=',
    imgURL: 'http://img.omdbapi.com/?apikey=',
    apiKey: '386d4e69',
    dataSearch: [],
    selectedMovies: [],

    init: () => {
        console.log('App Initialized');
        APP.addListeners();
    },
    addListeners: () => {
        let elem = document.querySelector('.sidenav');
        M.Sidenav.init(elem, { dismissable: true });
        //adding the modal trigger listener to the nav button
        let modal = document.querySelector('#searchModal');
        M.Modal.init(modal, { dismissable: true });
        //listening for the submit on the search bar
        document.searchForm.addEventListener('submit', () => {
            //activating the page
            document.querySelector('#nominatedPage').classList.remove('active');
            document.querySelector('#searchPage').classList.add('active')
            //closing the modal
            let searchModal = M.Modal.getInstance(modal);
            searchModal.close();
            let sideNav = M.Sidenav.getInstance(elem);
            sideNav.close();
            let query = document.getElementById('search')
            .value.trim();
            //adding the query to the URL
            window.location = `#${query}`;
            //calling the function to get data from the API;
            APP.getData(query);
        })
        //listening for click on the my movies list button
        document.querySelector('.nominated-list').addEventListener('click', () => {
            //add the class active on the active page and disable from the other page
            document.querySelector('#searchPage').classList.remove('active');
            let myMovies = document.querySelector('#nominatedPage')
            myMovies.classList.add('active');
            //cleaning the old content on the page
            myMovies.innerHTML="";
            //calling the function to handle the elements on the page
            APP.nominatedPage();
        })
    },
    getData: (query) => {
        let searchPage = document.querySelector('#searchPage');
        searchPage.innerHTML= "";
        let url = `${APP.baseURL}${APP.apiKey}&s=${query}&type=movie`;
        //fetching data from the API
        fetch (url)
        .then((resp) => 
            resp.json()
        )
        .then((data) => {
            console.log('this is the data from the API', data.Search);
            //saving the results on a global variable
            APP.dataSearch = data.Search;
            //calling the function to build the elements on the page
            APP.searchPage(query);
        })
    },
    searchPage: (query) => {
        let container = document.querySelector('#searchPage');
        let pageText = document.createElement('h4');
        pageText.classList.add('center');
        pageText.innerHTML = `Search Results for ${query}`;
        container.append(pageText);

        //if we have results
        if (APP.dataSearch.length > 0) {
            let cardContainer = document.createElement('div');
            cardContainer.classList.add('row')
            //mapping over the results and displaying card on the page
            cardContainer.innerHTML= APP.dataSearch
            .map((card) => {
                return `<div class="center card hoverable large col s12 m4 l3" data-id="${card.imdbID}">
                <div class="card-image">
                    <img src="${card.Poster}" alt="movie image"/>
                </div>
                <div class="card-content valign-wrapper>
                    <h4 class="card-title center-align"><span>${card.Title}</span></h4>
                    <p>Released: ${card.Year}</p>
                </div>
                <div class="card-action">       
                    <a href="#" class="add-movie light-blue-text text-darken-3">Add to my List
                    <i class="material-icons left">add</i></a>
                </div>
                </div>`
            })
            .join('\n')
            container.append(cardContainer);
            //adding a listener on the created add button
            document.querySelectorAll('.card-action').forEach((el) => {
                el.addEventListener('click', (ev) => {
                    let card = ev.target.closest('.card');
                    let selected = card.classList.toggle('selected');
                    let cardId = card.getAttribute('data-id');
                    let addMovie = ev.target.closest('.card-action')
                    .querySelector('.add-movie')
                    let movie = APP.dataSearch.find((movie) =>
                                movie.imdbID === cardId
                            )
                    //activating the movie badge and counter
                    let movieBadge = document.querySelector('#labelListCount');
                    movieBadge.classList.add('new','badge','green');
                    //if the button is selected
                    if (selected == true) {
                        console.log('the movie has been selected');
                        if (APP.selectedMovies.length < 5) {
                            //adding the movie to the array
                            APP.selectedMovies.push(movie);
                            console.log(APP.selectedMovies)
                            //setting the attribute counter on the badge
                            movieBadge.setAttribute('data-badge-caption',
                            APP.selectedMovies.length);
                            //changing the text and icon of the selected movie;
                            addMovie.childNodes[0].nodeValue = 'Remove';
                            addMovie.classList.replace('light-blue-text', 'red-text');
                            addMovie.childNodes[1].innerText = "delete";
                        } else {
                            //the list is full, display a message to the user
                            window.alert('Sorry! Your list is full. Please delete movies to add others');
                            //remove the selected class from the card
                            card.classList.remove('selected');
                        }
                    } else {
                        //remove the movie from the list
                        console.log('remove the movie from the list');
                        if (APP.selectedMovies.length > 0) {
                            //removing the movie from the array
                            let index = APP.selectedMovies.indexOf(movie);
                            APP.selectedMovies.splice(index, 1);
                            console.log('this is the new array: ', APP.selectedMovies);
                            //updating the movieCounter
                            movieBadge.setAttribute('data-badge-caption',
                            APP.selectedMovies.length);
                            //changing the text and icon of the selected movie;
                            addMovie.childNodes[0].nodeValue = 'Add Movie';
                            addMovie.classList.replace('red-text', 'light-blue-text');
                            addMovie.childNodes[1].innerText = "add";
                        }
                    }
                })
            })
        } else {
            //no cards to display
            APP.noCards(container)
            }
    },
    nominatedPage: () => {
        let container = document.querySelector('#nominatedPage');
        let pageText = document.createElement('h4');
        pageText.classList.add('center');
        pageText.innerHTML = "My Nominated Movies";
        container.append(pageText);
        //if we have movies to display
        if (APP.selectedMovies.length > 0) {
            let cardContainer = document.createElement('div');
            cardContainer.classList.add('row')
            //mapping over the results and displaying card on the page
            cardContainer.innerHTML= APP.selectedMovies
            .map((card) => {
                return `<div class="center card hoverable large col s12 m4 l3" data-id="${card.imdbID} selected">
                <div class="card-image">
                    <img src="${card.Poster}" alt="movie image"/>
                </div>
                <div class="card-content valign-wrapper>
                    <h4 class="card-title center-align"><span>${card.Title}</span></h4>
                    <p>Released: ${card.Year}</p>
                </div>
                <div class="card-action">       
                    <a href="#modalDelete" class="add-movie red-text text-darken-3 modal-trigger">Remove
                    <i class="material-icons left">delete</i></a>
                </div>
                </div>`
            })
            .join('\n')
            container.append(cardContainer);
            //adding a listener to remove the card from the list
            document.querySelectorAll('.card-action').forEach((el) => {
                el.addEventListener('click', (ev) => {
                    let card = ev.target.closest('.card');
                    let cardId = card.getAttribute('data-id');
                    let movie = APP.selectedMovies.find((movie) =>
                                movie.imdbID === cardId
                            )
                    //removing the movie from the array
                    let index = APP.selectedMovies.indexOf(movie);
                    APP.selectedMovies.splice(index, 1);
                    console.log('this is the new array: ', APP.selectedMovies);
                    //removing the card from the page
                    window.alert('Your movie was successfully removed from the list')
                    //updating the page with the new cards
                    container.innerHTML = "";
                    APP.nominatedPage();
                })
            })
        } else {
            //no cards to display
            APP.noCards(container)
            }
    },
    noCards: (container) => {
        container.innerHTML = `<div class="center-align card hoverable">
            <div class="card-content center">
            <h3 class="card-title activator"><span>No Content Available.</span></h3>
            </div>
            </div>
            <a href="#" class="waves-effect waves-light btn green accent-2" onclick="history.go(-1)">Back</a>`
    }
}
document.addEventListener('DOMContentLoaded', APP.init)