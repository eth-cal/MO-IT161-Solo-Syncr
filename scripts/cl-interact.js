
import * as cmdl from "./common.js"



class CalendarTaskDialogWrapper extends cmdl.BasicDialogWrapper {
    /**
     * @param {string} newDescription 
     * @returns {CalendarTaskDialogWrapper}
     */
    setTaskTitle(newTitle) {
        /** @type {HTMLInputElement} */
        let textbox = this.dialog.querySelector("#dialog-task_title > input[type=\"textbox\"]")
        textbox.value = newTitle
        return this
    }



    /**
     * @param {string} newDescription 
     * @returns {CalendarTaskDialogWrapper}
     */
    setTaskDescription(newDescription) {
        /** @type {HTMLTextAreaElement} */
        let textarea = this.dialog.querySelector("#dialog-task_desc > textarea")
        textarea.textContent = newDescription
        return this
    }



    /**
     * @param {Date} date 
     * @returns {CalendarTaskDialogWrapper}
     */
    setTaskDate(date) {
        let field = this.dialog.querySelector("#dialog-task_date > input[type=\"textbox\"]")

        if (field != null) {
            field.value = date.toLocaleString()
        }

        return this
    }


    /**
     * @param {string} reminder
     * @returns {CalendarTaskDialogWrapper} 
     */
    setTaskReminder(reminder) {
        switch(reminder) {
            case "on-time":
            case "1-day":
            case "3-days":
            case "1-week":
            case "everyday": {
                /** @type {HTMLSelectElement} */
                let selection = this.dialog.querySelector("#dialog-reminder > select")
                selection.value = reminder
            }
            default: console.error(`Unknown option: ${reminder}`)
        }

        return this
    }
}



class CalendarFiltersPopoverWrapper extends cmdl.BasicPopoverWrapper {
    /**
     * @param {HTMLElement} element 
     * @param {HTMLElement | HTMLButtonElement} trigger 
     */
    constructor(element, trigger) {
        super(element, trigger)

        this.element = element
        
        this.monthSelector = element.querySelector("#submenu\\.month-select")
        this.taskTypeVisibility = element.querySelector("#submenu\\.task-types")

        this.format = new Intl.DateTimeFormat(undefined, {month: "long"})
        this.calendarController

        this.calendarTasksActive = true
        this.alarmsActive = true
        this.kanbanTasksActive = true

        /** @type {HTMLInputElement} */
        this.calendarTaskCheckbox = element.querySelector(`#submenu\\.task-types *[data-act="calendar"] > input[type="checkbox"]`) 
        /** @type {HTMLInputElement} */
        this.alarmCheckbox = element.querySelector(`#submenu\\.task-types *[data-act="alarm"] > input[type="checkbox"]`) 
        /** @type {HTMLInputElement} */
        this.kanbanTaskCheckbox = element.querySelector(`#submenu\\.task-types *[data-act="kanban-dated"] > input[type="checkbox"]`) 

        element.querySelector("#go").addEventListener("click", () => {this.onUserInitiatedMonthChange()})
        this.calendarTaskCheckbox.addEventListener("click", () => {
            this.toggleCalendarTasks(this.calendarTaskCheckbox.checked)
        })

        this.alarmCheckbox.addEventListener("click", () => {
            this.toggleAlarms(this.alarmCheckbox.checked)
        })

        this.kanbanTaskCheckbox.addEventListener("click", () => {
            this.toggleKanbanTasks(this.kanbanTaskCheckbox.checked)
        })
    }


    /**
     * @param {CalendarView} controller
     * @returns
     */
    setCalendarController(controller) {
        this.calendarController = controller
        return this
    }



    /**
     * @param {boolean?} state 
     */
    toggleCalendarTasks(state) {
        /** @type {HTMLInputElement} */
        if (this.calendarTasksActive != state) {
            this.calendarTasksActive = state
            this.calendarTaskCheckbox.checked = state
            this.calendarController?.toggleCalendarTasks(state)
        }
    }



    /**
     * @param {boolean?} state 
     */
    toggleAlarms(state) {
        /** @type {HTMLInputElement} */
        if (this.alarmsActive != state) {
            this.alarmsActive = state
            this.alarmCheckbox.checked = state
            this.calendarController?.toggleAlarms(state)
        }
    }



    /**
     * @param {boolean?} state 
     */
    toggleKanbanTasks(state) {
        /** @type {HTMLInputElement} */
        if (this.kanbanTasksActive != state) {
            this.kanbanTasksActive = state
            this.kanbanTaskCheckbox.checked = state
            this.calendarController?.toggleKanbanTasks(state)
        }
    }



    /**
     * @param {number} month 
     * @param {number} year 
     * @returns {CalendarFiltersPopoverWrapper}
     */
    setMonth(month, year) {
        month = Math.max(month, 1)
        if (year < 1970) {
            console.error(`Given year is either too old or negative (must be 1970 or later, got ${year})`)
            return this
        }
        this.monthSelector.querySelectorAll("input[type=\"textbox\"]").forEach((textbox) => {
            switch (textbox.id) {
                case "month": {
                    textbox.value = this.format.format(new Date(year, month))
                    break
                }
                case "year": {textbox.value = year}
            }
        })
        return this
    }



    onUserInitiatedMonthChange() {
        let month = "", year = "1970"
        
        this.monthSelector.querySelectorAll("input[type=\"textbox\"]").forEach((textbox) => {
            switch (textbox.id) {
                case "month": {month = textbox.value}
                case "year": {year = textbox.value}
            }
        })

        if (year.match("^-?\\d+$") == null) {
            this.onMonthChangeFailure?.("That's not a year", `Input for year (\"${year}\") does not represent a whole number.`)
            return
        } else if (Number.parseInt(year) < 1970) {
            this.onMonthChangeFailure?.("Feels like yesterday, I think", `Given year ${year} can not be before 1970.`)
            return
        }

        let resolvedMonth = cmdl.date.resolveMonth(month)

            this.onMonthChangeFailure?.(`What is a \"${month}\"?`, `\"${month}\" is not a valid month.`)
        if (resolvedMonth == null) {
            return
        }

        let date = new Date(`${month} ${year}`)
        
        this.calendarController?.updateToMonthAndYear(date.getFullYear(), date.getMonth())
    }

    onMonthChangeFailure = function(title, message) {}
}



class CalendarView {
    calendarTaskVisibility = true
    alarmVisibility = true
    kanbanTaskVisibility = true
    #expanderVisibility = true
    #currentDate = new Date()

    toggleCalendarTasks(state) {
        if (this.calendarTaskVisibility != state) {
            this.calendarTaskVisibility = state
            this.updateCalendarTaskVis()
            this.updateExpanderVis()
        }
    }

    toggleAlarms(state) {
        if (this.alarmVisibility != state) {
            this.alarmVisibility = state
            this.updateAlarmsVis()
            this.updateExpanderVis()
        }
    }

    toggleKanbanTasks(state) {
        if (this.kanbanTaskVisibility != state) {
            this.kanbanTaskVisibility = state
            this.updateKanbanTaskVis()
            this.updateExpanderVis()
        }
    }

    updateCalendarTaskVis() {
        this.updateVisibilityOf(
            calendarGrid.querySelectorAll("#cl\\.task-entry-box button[data-entry-type=\"task\"]"),
            this.calendarTaskVisibility? "inherit": "hidden"
        )
    }

    updateAlarmsVis() {
        this.updateVisibilityOf(
            calendarGrid.querySelectorAll("#cl\\.task-entry-box button[data-entry-type=\"task-ref\"][data-task-type=\"alarm\"]"),
            this.alarmVisibility? "inherit": "hidden"
        )
    }

    updateKanbanTaskVis() {
        this.updateVisibilityOf(
            calendarGrid.querySelectorAll("#cl\\.task-entry-box button[data-entry-type=\"task-ref\"][data-task-type=\"kanban-dated\"]"),
            this.kanbanTaskVisibility? "inherit": "hidden"
        )
    }

    updateExpanderVis() {
        let newVisibility =
            this.calendarTaskVisibility
            && this.alarmVisibility
            && this.kanbanTaskVisibility
        
        if (this.#expanderVisibility == newVisibility) {return}

        this.#expanderVisibility = newVisibility
        this.updateVisibilityOf(
            calendarGrid.querySelectorAll("#cl\\.task-entry-box button[data-entry-type=\"expander\"]"),
            newVisibility? "inherit": "hidden"
        )
    }

    updateVisibilityOf(listOfElements, visibilityParam) {
        listOfElements.forEach(
            /**
             * @param {HTMLElement} button 
             */
            (button) => {
                button.style.visibility = visibilityParam}
        )
    }

    updateToMonthAndYear(year, month) {
        calendarGrid.innerHTML = ""
        let firstDayOfMonth = new Date(year, month)
        let lastDayOfMonth = (new Date(firstDayOfMonth)); {
            lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1)
            lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1)
        }

        let totalDaysInMonth = lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1

        let firstDayOfFirstWeek = new Date(firstDayOfMonth)
        let lastDayOfLastWeek = new Date(lastDayOfMonth);
        
        firstDayOfFirstWeek.setDate(firstDayOfFirstWeek.getDate() - firstDayOfFirstWeek.getDay())
        lastDayOfLastWeek.setDate(lastDayOfLastWeek.getDate() + 6 - lastDayOfLastWeek.getDay())

        let firstDaysBeforeScope = (firstDayOfMonth.getTime() - firstDayOfFirstWeek.getTime()) / cmdl.milli.day
        let totalDaysInScope = (
            lastDayOfLastWeek.getTime()
            - firstDayOfFirstWeek.getTime())
            / cmdl.milli.day + 1
        let totalWeeksInScope = totalDaysInScope / 7

        let currentInstant = new Date(firstDayOfFirstWeek)

        for (let currentWeek = 0; currentWeek < totalWeeksInScope; currentWeek++) {
            /** @type {HTMLElement} */
            let currentRow = emptyRow.cloneNode(false)
            /** @type {HTMLElement} */

            for (let currentDay = 0; currentDay < 7; currentDay++) {
                let element = calendarBox.cloneNode(true);
                let elementTaskList = element.querySelector("#task-list")
                element.setAttribute("data-date", currentInstant.getTime())
                element.querySelector(".day_number").textContent = currentInstant.getDate();

                switch(true) {
                    case (firstDaysBeforeScope <= 0 && totalDaysInMonth > 0): {
                        let placeTasks = Math.random() > 0.5;
                        if (!placeTasks) {elementTaskList.style.visibility = "hidden"}
                        totalDaysInMonth--
                        break
                    }
                    case (firstDaysBeforeScope > 0): firstDaysBeforeScope--
                    case (totalDaysInMonth <= 0): {
                        elementTaskList.style.visibility = "hidden"
                        element.classList.add(["disabled"])
                        break
                    }
                }
                currentRow.appendChild(element)
                currentInstant.setTime(currentInstant.getTime() + cmdl.milli.day)
            }

            calendarGrid.appendChild(currentRow)
        }

        this.#currentDate = firstDayOfMonth
        this.onCalendarUpdate?.()
    }


    updateToNow() {
        let timeNow = new Date()
        this.updateToMonthAndYear(timeNow.getFullYear(), timeNow.getMonth())
    }


    getActiveViewingDate() {
        return this.#currentDate
    }


    onCalendarUpdate = function() {}
}


/** @type {HTMLElement} */
let calendarBox = document.getElementById("cl.task-entry-box").cloneNode(true);
/** @type {HTMLElement} */
let calendarGrid = document.getElementById("cl.grid-view.tasks");
/** @type {HTMLElement} */
let emptyRow = document.getElementById("cl.grid-view.row").cloneNode(false);

let calendarView = new CalendarView()


let messageDialog = document.querySelector("#dialog-messenger")
let messageDialogController = new cmdl.BasicMessageWrapper(
    messageDialog,
    messageDialog.querySelectorAll("#dialog_close, .dialog-actions > button")
)


let taskInfoDialog = document.querySelector("#dialog-taskman")
let taskInfoDialogController = new CalendarTaskDialogWrapper(
    taskInfoDialog,
    taskInfoDialog.querySelectorAll("#dialog_close, .dialog-actions > button")
)

let topbarOptFilters = document.querySelector("#mv\\.edit\\.topbar > #mv\\.action[data-act=\"filter\"]")
let topbarOptFiltersPopover = new CalendarFiltersPopoverWrapper(
    topbarOptFilters.querySelector("#submenu"),
    topbarOptFilters.querySelector("#toggler")
)

{
    let clock = (new cmdl.LiveTimeDisplay(
        new Intl.DateTimeFormat(
            undefined,
            {
                "dateStyle": "full",
            }
        )
    )).addElement(document.getElementById("cl.date"))
        .setIntervalLength(60000)
        .start()

    clock.handler()



    topbarOptFiltersPopover.setCalendarController(calendarView)
    
    topbarOptFiltersPopover.onMonthChangeFailure = (title, message) => {
        messageDialogController.setTitle(title).setMessage(message).show()
    }



    document.querySelectorAll("#cl\\.grid-view\\.ctrl\\.add-task").forEach((openButton) => {
        openButton.addEventListener("click", () => {
            taskInfoDialogController
                .setTitleDecor(cmdl.DialogTitleDecor.NEW, `task`)
                .setTaskTitle("Calendar")
                .setTaskDescription("")
                .setTaskDate(new Date())
                .setTaskReminder("1-day")
            
            taskInfoDialogController.show()
        });
    })

    document.querySelector("#cl\\.grid-view\\.ctrl\\.opts > #now")?.addEventListener("click", () => {
        calendarView.updateToNow()
    })

    calendarView.onCalendarUpdate = () => {
        let currentViewingDate = calendarView.getActiveViewingDate()
        topbarOptFiltersPopover.setMonth(
            currentViewingDate.getMonth(),
            currentViewingDate.getFullYear()
        )
        document.querySelectorAll("#cl\\.task-entry-box").forEach((taskBox) => {
            taskBox.querySelector("button[data-entry-type=\"task\"]")?.addEventListener("click", () => {
                taskInfoDialogController
                    .setTitleDecor(cmdl.DialogTitleDecor.EDIT, `task "Calendar"`)
                    .setTaskTitle("Calendar")
                    .setTaskDescription("")
                    .setTaskDate(new Date(Number.parseInt(taskBox.getAttribute("data-date"))))
                    .setTaskReminder("1-week") 
                
                taskInfoDialogController.show()
            });
        })
    }

    calendarView.updateToNow()
    
}