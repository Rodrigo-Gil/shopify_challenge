
const APP = {
    init: () => {
        console.log('App Initialized');
        APP.addListeners();
    },
    addListeners: () => {
        console.log('initializing add listeners')
        let elem = document.querySelectorAll('.sidenav')
        M.Sidenav.init(elem, { dismissable: true });
        //adding the modal trigger listener to the nav button
        let modal = document.querySelectorAll('.modal')
        M.Modal.init(modal, { dismissable: true });

    },
}
document.addEventListener('DOMContentLoaded', APP.init)