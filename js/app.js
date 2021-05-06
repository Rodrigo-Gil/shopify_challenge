
const APP = {
    //global variables that will used on the application
    baseURL: 'http://www.omdbapi.com/?apikey=',
    imgURL: 'http://img.omdbapi.com/?apikey=',
    apiKey: '386d4e69',
    dataSearch: [],

    init: () => {
        console.log('App Initialized');
        APP.addListeners();
    },
    addListeners: () => {
        let elem = document.querySelector('.sidenav');
        M.Sidenav.init(elem, { dismissable: true });
        //adding the modal trigger listener to the nav button
        let modal = document.querySelector('.modal');
        M.Modal.init(modal, { dismissable: true });
        //listening for the submit on the search bar
        document.searchForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
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
    },
    getData: (query) => {
        let searchPage = document.querySelector('#searchPage');
        searchPage.innerHTML= "";
        let url = `${APP.baseURL}${APP.apiKey}&s=${query}`;
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
            APP.buildPage(query);
        })
    },
    buildPage: (query) => {
        let container = document.querySelector('#searchPage');
        let searchData = APP.dataSearch;

        if (searchData.length > 0) {
            //creating the text on top of the page
            let text = document.createElement('h4');
            text.classList.add('center')
            text.innerHTML = `Search Results for ${query}`;
            container.appendChild(text);
            //creating the card container
            let cardContainer = document.createElement('div');
            cardContainer.classList.add('row')
            //mapping over the results and displaying card on the page
            cardContainer.innerHTML= searchData
            .map((card) => {
                return `<div class="center card hoverable large col s12 m4 l3" data-id="${card.imdbID}">
                <div class="card-image">
                    <img src="${card.Poster}" class="responsive-img" alt="movie image"/>
                </div>
                <div class="card-content valign-wrapper>
                    <h4 class="card-title center-align"><span>${card.Title}</span></h4>
                    <p>${card.Year}</p>
                </div>
                <div class="card-action">       
                    <a href="#" class="add-movie light-blue-text text-darken-3">Add to my List
                    <i class="material-icons left">add</i></a>
                </div>
                </div>`
            })
            .join('\n')
            container.append(cardContainer);
        } else {
            //no cards to display
            container.innerHTML = `<div class="card hoverable">
            <div class="card-content">
            <h3 class="card-title activator"><span>No Content Available.</span></h3>
            </div>
            </div>
            <a href="#" class="waves-effect waves-light btn green accent-2" onclick="history.go(-1)">Back to results</a>`
            }
        },
    };
document.addEventListener('DOMContentLoaded', APP.init)