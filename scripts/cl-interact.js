
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

let CalenderView = {
    updateToMonthAndYear : function(year, month) {
        calendarGrid.innerHTML = ""
        let day = 1;

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

            for (let currentDay = 0; currentDay < 7; currentDay++) {
                switch(true) {
                    case (firstDaysBeforeScope <= 0 && totalDaysInMonth > 0): {
                        let placeTasks = Math.random() > 0.5;
                        let element;

                        if (placeTasks) {element = calendarBox.cloneNode(true);}
                        else {element = emptyCalendarBox.cloneNode(true);}

                        element.querySelector(".day_number").textContent = currentInstant.getDate();
                        currentRow.appendChild(element)
                        totalDaysInMonth--
                        break
                    }
                    case (firstDaysBeforeScope > 0): firstDaysBeforeScope--
                    case (totalDaysInMonth <= 0): {
                        /** @type {HTMLElement} */
                        let element = emptyCalendarBox.cloneNode(true)
                        element.querySelector(".day_number").textContent = currentInstant.getDate();
                        element.classList.add(["disabled"])
                        currentRow.appendChild(element)
                        break
                    }
                }

                currentInstant.setTime(currentInstant.getTime() + cmdl.milli.day)
            }

            calendarGrid.appendChild(currentRow)
        }
    }
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
