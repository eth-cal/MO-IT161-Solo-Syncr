
import * as cmdl from "./common.js"



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

let clock = (new cmdl.LiveTimeDisplay(
    new Intl.DateTimeFormat(
        undefined,
        {
            "dateStyle": "medium"
        }
    )
)).addElement(document.getElementById("cl.date"))
    .setIntervalLength(60000)
    .start()

clock.handler()
/** @type {HTMLElement} */
let calendarBox = document.getElementById("cl.task-entry-box").cloneNode(true);
/** @type {HTMLElement} */
let calendarGrid = document.getElementById("cl.grid-view.tasks");
/** @type {HTMLElement} */
let emptyRow = document.getElementById("cl.grid-view.row").cloneNode(false);

let today = new Date(clock.getNow())
CalenderView.updateToMonthAndYear(today.getFullYear(), today.getMonth())