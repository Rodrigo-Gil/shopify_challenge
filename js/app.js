
const APP = {
    //global variables that will used on the application
    baseURL: 'http://www.omdbapi.com/?apikey=',
    imgURL: 'http://img.omdbapi.com/?apikey=',
    apiKey: '386d4e69',

    init: () => {
        console.log('App Initialized');
        APP.addListeners();
    },
    addListeners: () => {
        console.log('initializing add listeners');
        let elem = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elem, { dismissable: true });
        //adding the modal trigger listener to the nav button
        let modal = document.querySelectorAll('.modal');
        M.Modal.init(modal, { dismissable: true });
        //listening for the submit on the search bar
        document.searchForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
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
            console.log('this is the data', data);
        })
    },
}
document.addEventListener('DOMContentLoaded', APP.init)