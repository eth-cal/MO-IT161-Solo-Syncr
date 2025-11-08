import * as cmdl from "./common.js"

// Since this is just a simulation of the timeline view,
// I'm not even going to use Dates.
class NumberRange {
    #correctRange() {
        let oldStart = this.#start, oldEnd = this.#end
        this.#start = Math.min(oldStart, oldEnd)
        this.#end = Math.max(oldStart, oldEnd)
    }

    constructor(start, end) {
        this.#start = start
        this.#end = end || start
        this.#correctRange()
    }



    #start
    #end



    setStart(newStart) {
        this.#start = newStart
        this.#correctRange()
        return this
    }



    setEnd(newEnd) {
        this.#end = newEnd
        this.#correctRange()
        return this
    }



    getStart() {return this.#start}
    getEnd() {return this.#end}



    dist() {
        return this.#end - this.#start
    }
}



class TimelineView {
    static TASK_TYPE = {CALENDAR : "calendar-type", ALARM : "alarm-type", KANBAN : "kanban-type"}

    /**
     * @param {HTMLElement} timelineElement 
     */
    constructor(timelineElement) {
        this.#timelineElement = timelineElement
        this.#timelineStrip = timelineElement.querySelector("#timeline-run")
    }


    /** @private @type {HTMLElement} */
    #timelineElement

    #timelineStrip

    /** @private @type {[HTMLDivElement]} */
    #tasks = []


    
    /**
     * 
     * @param {string} title 
     * @param {string} type 
     * @param {NumberRange} timespan 
     */
    put(title, type, timespan) {
        if (type != TimelineView.TASK_TYPE.CALENDAR) {
            timespan.setEnd(timespan.getStart() + 1)
        }
        let newElement = this.#generateTitledElement(title, type, timespan.getStart(), timespan.dist())
        this.#tasks.push({
            element : newElement,
            span : timespan
        })
    }



    update() {
        let tasks = [...this.#tasks].sort((a, b) => {
            let startOfA = a.span.getStart(), startOfB = b.span.getStart()
            switch (true) {
                case startOfA == startOfB: return 0
                case startOfA < startOfB: return -1
                default: return 1
            }
        })

        let rows = []
        let maxContentWidth = 0

        tasks.forEach(
            (task) => {
                /** @type {HTMLDivElement | null} */

                let startOfTask = task.span.getStart()
                let endOfTask = task.span.getEnd()

                let nextAvailableRow = null

                for (let index = 0; index < rows.length; index++) {
                    let row = rows[index]
                    let nextSpotOfRow = row.nextSpot

                    if (nextSpotOfRow <= startOfTask) {
                        nextAvailableRow = row
                        break
                    }
                }

                if (nextAvailableRow == null) {
                    nextAvailableRow = {
                        element: document.createElement("div")
                    }
                    rows.push(nextAvailableRow)
                }

                nextAvailableRow.nextSpot = endOfTask

                task.element.parentElement?.removeChild(task.element)
                nextAvailableRow.element.appendChild(task.element)
                maxContentWidth = Math.max(maxContentWidth, endOfTask + 1)
            }
        )


        this.#timelineStrip.innerHTML = ""
        this.#timelineStrip.style.width = `${maxContentWidth * 15}px`
        rows.forEach((row) => {
            this.#timelineStrip.appendChild(row.element)
        })
    }



    #generateTitledElement(title, type, xoffset, width) {
        let newDiv = document.createElement("div")
        newDiv.textContent = title
        newDiv.style.left = `${(xoffset | 0) * 15}px`
        newDiv.style.width = `${(width | 0) * 15}px`
        this.#decorateElementByTaskType(newDiv, type)
        return newDiv
    }



    #decorateElementByTaskType(element, type) {
        // Idk how to test if an object has a value, just like with enums in some
        // languages.
        switch(type) {
            case TimelineView.TASK_TYPE.CALENDAR:
            case TimelineView.TASK_TYPE.ALARM:
            case TimelineView.TASK_TYPE.KANBAN: {
                element.classList.add([type])
                break
            }
            default: {
                console.error(`Can't create a task element out of type "${type}".`)
            }
        }
    }
}



{
    function randomElement(array) {
        if (array.length == 0) {return null}
        else if (array.length == 1) {return array[0]}
        return array[Math.round(Math.random() * (array.length - 1))]
    }

    let sampleCalTaskTitles = [
        "Mark's b-day", "SCHOOL EVENT", "DIY kit delivery",
        "Outing with friends", "TUITION PAYMENT DUE", "Untitled",
        "House downpayment", "Car downpayment", "Monika's b-day",
        "Larry's b-day", "Go get groceries", "wAter bills",
        "Water bills", "Family gathering", "Vacation trip"
    ]
    let sampleAlarmTitles = [
        "Wake up", "Water the plants",
        "Sleep", "Lunch", "Dinner", "Untitled",
        "READY FOR XYZ", "Rest time"
    ]
    let sampleKanbanTitles = [
        "Missing XY in project Z", "The feature W causes soft-lock",
        "All UI needs curved borders", "Implement XYZ", "Do X",
        "Do Y", "Do Z", "Remove X", "Remove Y", "Remove Z",
        "Typos in warning dialogs", "Add delete button for W"
    ]

    let timelineStripView = new TimelineView(
        document.getElementById("tl-mode.timescr.sliding-pane")
    )

    let offset = 0

    // The randomiser tends to put so many tasks on a specific period (with
    // a chance to actually cause the view to produce hundreds of rows, but
    // the probability of that happening should be negligible).
    for (let taskNumber = 0; taskNumber < 250; taskNumber++) {
        let type = Math.round(Math.pow(Math.random(), 5) * 2)
        let taskType
        let title
        let length

        switch (type) {
            case 0 : {
                title = randomElement(sampleCalTaskTitles)
                taskType = TimelineView.TASK_TYPE.CALENDAR
                length = Math.round(Math.random() * 25 + 3)

                break
            }
            case 1 : {
                title = randomElement(sampleAlarmTitles)
                taskType = TimelineView.TASK_TYPE.ALARM
                break
            }
            case 2 : {
                title = randomElement(sampleKanbanTitles)
                taskType = TimelineView.TASK_TYPE.KANBAN
                break
            }
        }

        timelineStripView.put(
            title, taskType, new NumberRange(offset, offset + length)
        )

        offset += Math.round(Math.pow(Math.random(), 5) * 70)
    }

    timelineStripView.update()
}


let clock = new cmdl.LiveTimeDisplay(
    new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "full",
            timeStyle: "short"
        }
    )
)
    .setIntervalLength(5000)
    .addElement(document.getElementById(`tl-mode.timescr.datetime`))

clock.start()
    .handler() 