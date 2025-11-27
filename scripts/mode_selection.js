/** WHY??? */
var localStorageSupport; {
    try {
        localStorage.setItem("_testForSupport", 1);
        localStorage.getItem("_testForSupport");
        localStorage.removeItem("_testForSupport");
        localStorageSupport = true;
    } catch (ex) {
        localStorageSupport = false;
    }
}

// NOTE: Just put currently non-existent links so you don't have to push
// commits here for each page (maybe not for dashboard, still needs a
// design).
let idToLinkTargets = {}; {
    //idToLinkTargets[".fallback"] = "/pages/fallback.html";
    idToLinkTargets["lsb.button-rack.timeline"] = "pages/timeline.html";
    idToLinkTargets["lsb.button-rack.calendar"] = "pages/calendar.html";
    idToLinkTargets["lsb.button-rack.alarms"] = "pages/alarms.html";
    idToLinkTargets["lsb.button-rack.kanban"] = "pages/kanban.html";
}

let visitedPages = {};

let editingView = document.getElementById("mv.view");
let activeId = "";

for (const button of document.getElementById("lsb.button-rack").children) {
    /** @type {string} */
    let buttonId = button.getAttribute("id") || "";

    button.addEventListener("click", () => {
        trySwitchViewTo(buttonId || "")
    });
}
 


/** @param {string} id */
async function trySwitchViewTo(id) {
    if (id == activeId) {
        return;
    } else if (
        idToLinkTargets[id] == undefined
    ) {
        return;
    } else {
        let link = idToLinkTargets[id];
        
        if (visitedPages[link] == true) {
            _switchViewTo(id);
            activeId = id;
            return;
        } else if (visitedPages[link] == false) {
            return;
        } else {
            visitedPages[link] = false;
        }

        // await fetch(idToLinkTargets[id])

        // .then( (result) => {
        //     if (result.ok) {
        //         visitedPages[link] = true;
        //         _switchViewTo(id);
        //         activeId = id;
        //     }
        // } );

        _switchViewTo(id);
        activeId = id;
    }
}




/* No input validation. Just to force a page switch, especially when
loading the page for the first time in a new session */
function _switchViewTo(id) {
    editingView.textContent = null;
    editingView.setAttribute("src", idToLinkTargets[id] || fallbackPage);
}


// Unusable on Safari/WebView for iOS.
// https://bugs.webkit.org/show_bug.cgi?id=219102
window.addEventListener("beforeunload", (ev) => {
    if (localStorageSupport) {
        localStorage.setItem("last_page", activeId);
    }
})


if (localStorageSupport) {
    trySwitchViewTo(localStorage.getItem("last_page"));
};