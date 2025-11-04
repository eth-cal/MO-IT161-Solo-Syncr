const DialogTitleDecor = Object.freeze({
    NONE : -1,
    NEW : 0,
    EDIT : 1,
})



/** TODO: make common */
class LiveTimeDisplay {
    constructor(format) {
        /** @type {Intl.DateTimeFormat} */
        this.locale = format || new Intl.DateTimeFormat(undefined, {timeStyle: "medium", dateStyle: "long"})

        /** @type {number} */
        this.intervalId = 0

        /** @type {number} */
        this.intervalLength = 1000

        /** @type {[HTMLElement]} */
        this.displayables = []
        
        /** @type {boolean} */
        this.enabled = false

        /** @type {Date} */
        this.lastTimeRecorded = new Date()

        let ltd = this

        function closeHandler() {
            ltd.stop()
            window.removeEventListener(closeHandler)
        }

        window.addEventListener("close", closeHandler)
    }

    
    
    handler() {
        let newDate = Date.now()
        let currentTime = this.locale.format(Date.now())

        this.lastTimeRecorded = newDate
        this.displayables.forEach((displayable) => {
            displayable.textContent = currentTime
        })
    }



    addElement(element) {
        if (this.displayables.includes(element)) {return}

        this.displayables.push(element)
    }



    start() {
        if (this.enabled == true) {return}
        
        let ltd = this
        this.intervalId = setInterval(() => {ltd.handler()}, ltd.intervalLength)
        this.enabled = true
    }



    stop() {
        if (this.enabled == false) {return}

        clearInterval(this.intervalId)
        this.intervalId = 0
        this.enabled = false
    }



    restart() {
        if (this.enabled == false) {return}
        this.stop()
        this.start()
    }



    /**
     * 
     */
    getNow() {
        return new Date(this.lastTimeRecorded)
    }



    /**
     * @param {number} length 
     */
    setIntervalLength(length) {
        length = Math.max(length, 0)

        if (this.intervalLength != length) {
            this.intervalLength = length
            this.restart()
        }
    }
}



/** TODO: make common */
class BasicDialogWrapper {
    /**
     * @param {HTMLDialogElement} dialog 
     * @param {NodeListOf<HTMLButtonElement>} exitButtons 
     */
    constructor(dialog, exitButtons) {
        if (dialog.getAttribute("data-wrapped") == "true") {throw "Element already wrapped."}
       
        /** @type {HTMLDialogElement} */
        this.dialog = dialog

        /** @type {[HTMLButtonElement]} */
        this.exitActions = []
        
        let primaryExitButton = dialog.querySelector("#dialog_close")
        if (primaryExitButton != null) {this.addExitAction(primaryExitButton)}

        if (exitButtons != null) {
            this.addManyExitActions(exitButtons)
        }

        dialog.setAttribute("data-wrapped", true)
    }



    /**
     * @param {HTMLButtonElement} clickable
     * @returns {KanbanTaskDialogWrapper}
     */
    addExitAction(clickable) {
        if (this.exitActions.includes(clickable)) {return}

        clickable.addEventListener("click", () => {this.hide()})
        this.exitActions.push(clickable)
        console.log(clickable)
        return this
    }



    /**
     * @param {NodeListOf<HTMLButtonElement>} clickable 
     * @returns {KanbanTaskDialogWrapper}
     */
    addManyExitActions(clickables) {
        clickables.forEach((clickable) => {this.addExitAction(clickable)})
        return this
    }


    
    /**
     * @param {String} newTitle 
     * @returns {KanbanTaskDialogWrapper}
     */
    setTitle(newTitle) {
        let title = this.dialog.querySelector("#dialog_title")
        if (title) {
            title.textContent = newTitle
        }
        return this
    }



    /**
     * @param {String} newTitle 
     * @returns {KanbanTaskDialogWrapper}
     */
    setTitleDecor(decor, extraText) {
        let decorText = extraText;

        switch (decor) {
            case DialogTitleDecor.NEW: decorText = `Creating ${decorText}`; break;
            case DialogTitleDecor.EDIT: decorText = `Editing ${decorText}`; break;
        }

        this.setTitle(decorText)
        return this
    }



    show(modal) {
        if (modal == true) {this.dialog.showModal()}
        else {this.dialog.show()}
    }
    hide() {return this.dialog.close()}
}



class KanbanTaskDialogWrapper extends BasicDialogWrapper {
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



class KanbanColumnDialogWrapper extends BasicDialogWrapper {
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



const clock = new LiveTimeDisplay(); {
    clock
}

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
        element.querySelector(".kb-task-deadline")?.textContent
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
                    .setTitleDecor(DialogTitleDecor.EDIT, `task "${taskInfo.title}"`)
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
                    .setTitleDecor(DialogTitleDecor.NONE, `New task for ${columnTitle}`)
                    .setTaskTitle("")
                    .setTaskDesc("")
                    .clearTaskDeadline()
                    .show()
            });
        column.querySelector("#kb\\.column\\.actions > button[data-act=\"edit\"]")
            ?.addEventListener("click", () => {
                taskColumnDialogController
                    .setTitleDecor(DialogTitleDecor.EDIT, `column "${columnTitle}"`)
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