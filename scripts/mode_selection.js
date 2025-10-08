/** @type {Map<string, string>} */
const pages = new Map();
pages.set("lsb.button-rack.dashboard", "experiment.html");
pages.set("lsb.button-rack.timeline", "/pages/timeline.html");

let mainViewPane = document.getElementById("mv.view");
let currentView = "pages/timeline.html";

function mv_page_navTo(htmlFile, force) {
    // TODO: find some better alternative to matching file paths.
    if (!force && currentView == htmlFile) {
        return;
    } else {
        mainViewPane.setAttribute("src", htmlFile);
        currentView = htmlFile;
    }
}

for (const lsbButton of document.getElementById("lsb.button-rack").children) {
    /** @type {string} */
    let htmlId = lsbButton.getAttribute("id") || "";
    let htmlTargetSource = "";
    
    if (pages.has(htmlId)) {
        htmlTargetSource = pages.get(htmlId);
    }

    console.log("Id:", htmlId, "| Source:", htmlTargetSource);

    lsbButton.onclick = function() {
        console.log("GOTO:", htmlTargetSource);
        mv_page_navTo(htmlTargetSource);
    }
}

mv_page_navTo(currentView, true);