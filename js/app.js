
const APP = {
    init: () => {
        console.log('App Initialized');

        APP.addListeners();
    },
    addListeners: () => {
        let elem = document.querySelectorAll('.sidenav')
        M.Sidenav.init(elem)
    },
}
document.addEventListener('DOMContentLoaded', APP.init)