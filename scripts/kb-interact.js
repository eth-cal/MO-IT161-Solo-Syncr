import * as cmdl from "./common.js"



class KanbanTaskDialogWrapper extends cmdl.BasicDialogWrapper {
    /**
     * @param {String} title 
     * @returns {KanbanTaskDialogWrapper}
     */
    setTaskTitle(title) {
        let field = this.dialog.querySelector("#dialog-task_title > input[type=\"textbox\"]")

        if (field != null) {
            field.value = title
        }

        return this
    }



    /**
     * @param {String} desc 
     * @returns {KanbanTaskDialogWrapper}
     */
    setTaskDesc(desc) {
        let field = this.dialog.querySelector("#dialog-task_desc > textarea")

        if (field != null) {
            field.textContent = desc
        }

        return this
    }


    
    /**
     * @param {Date} deadline 
     * @returns {KanbanTaskDialogWrapper}
     */
    setTaskDeadline(deadline) {
        let field = this.dialog.querySelector("#dialog-task_deadline > input[type=\"textbox\"]")

        if (field != null) {
            field.value = deadline.toLocaleString()
        }
        return this
    }


    
    /**
     * @returns {KanbanTaskDialogWrapper}
     */
    clearTaskDeadline() {
        let field = this.dialog.querySelector("#dialog-task_deadline > input[type=\"textbox\"]")
        field.value = ""
        return this
    }
}



class KanbanColumnDialogWrapper extends cmdl.BasicDialogWrapper {
    /**
     * @param {String} title 
     * @returns {KanbanTaskDialogWrapper}
     */
    setColumnTitle(title) {
        let field = this.dialog.querySelector("#dialog-col_title > input[type=\"textbox\"]")

        if (field != null) {
            field.value = title
        }

        return this
    }
}



const clock = new cmdl.LiveTimeDisplay();

/** @type {HTMLDialogElement} */
const taskInfoDialog = document.getElementById("dialog-taskman")
/** @type {HTMLDialogElement} */
const columnInfoDialog = document.getElementById("dialog-colman")



const taskInfoDialogController = new KanbanTaskDialogWrapper(
    taskInfoDialog,
    taskInfoDialog.querySelectorAll("#dialog_close, .dialog-actions > button")
)

const taskColumnDialogController = new KanbanColumnDialogWrapper(
    columnInfoDialog,
    columnInfoDialog.querySelectorAll("#dialog_close, .dialog-actions > button")
)



/**
 * @class
 */
class KanbanTaskInfo {
    /**
     * 
     * @param {String} title 
     * @param {String} desc 
     * @param {String | null} deadline 
     * @returns 
     */
    constructor(title, desc, deadline) {
        this.title = title || this.title
        this.desc = desc || this.desc

        if (deadline == null) {return}

        this.deadline = new Date(Date.parse(deadline))
    }

    title = ""
    desc = ""
    /** @type {Date?} */
    deadline = null
}



/**
 * Simply extracts information from an element for presenting in, let's say a dialogue.
 * @param {HTMLElement} element
 * @returns 
 */
function kanban_extractFromElement(element) {
    return new KanbanTaskInfo(
        element.querySelector(".kb-task-name")?.textContent,
        element.querySelector(".kb-task-desc")?.textContent,
        // I didn't even bothered to add a separate data-* attribute due to time constraints.
        // This is a quick fix just for this prototype. Firefox has a dumber Date parser.
        element.querySelector(".kb-task-deadline")?.textContent?.match("Done by (.+)")?.[0]
    )
}



/**
 * 
 */



{
    clock.addElement(document.getElementById("kb.control-bar.live-time"))
    clock.setIntervalLength(1000)
    clock.start()

    document.querySelectorAll(".kb-task").forEach((taskEntry) => {
        let taskInfo = kanban_extractFromElement(taskEntry)

        taskEntry.querySelector("button[data-act=\"edit\"]")
            ?.addEventListener("click", () => {
                
                taskInfoDialogController
                    .setTitleDecor(cmdl.DialogTitleDecor.EDIT, `task "${taskInfo.title}"`)
                    .setTaskTitle(taskInfo.title)
                    .setTaskDesc(taskInfo.desc)
                
                if (taskInfo.deadline != null) { 
                    taskInfoDialogController
                        .setTaskDeadline(taskInfo.deadline)
                } else {
                    taskInfoDialogController
                        .clearTaskDeadline()
                }

                taskInfoDialogController.show()
            });
    })



    document.querySelectorAll("#kb\\.column").forEach((column) => {
        let columnTitle = column.querySelector("span").textContent
        column.querySelector("#kb\\.column\\.new-task")
            ?.addEventListener("click", () => {
                taskInfoDialogController
                    .setTitleDecor(cmdl.DialogTitleDecor.NONE, `New task for ${columnTitle}`)
                    .setTaskTitle("")
                    .setTaskDesc("")
                    .clearTaskDeadline()
                    .show()
            });
        column.querySelector("#kb\\.column\\.actions button[data-act=\"edit\"]")
            ?.addEventListener("click", () => {
                taskColumnDialogController
                    .setTitleDecor(cmdl.DialogTitleDecor.EDIT, `column "${columnTitle}"`)
                    .setColumnTitle(columnTitle)
                    .show()
            })
    })



    document.querySelectorAll("#kb\\.control-bar\\.opts\\.add, [id^=\"kb\\.taskboard\\.content.new-\"] > button").forEach((newColumnButton) => {
        newColumnButton.addEventListener("click", () => {
            taskColumnDialogController
                .setTitle("New column")
                .setColumnTitle("")
                .show()
        });
    })
}