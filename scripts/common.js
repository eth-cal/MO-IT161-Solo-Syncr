export const DialogTitleDecor = Object.freeze({
    NONE : -1,
    NEW : 0,
    EDIT : 1,
})



/**
 * @param {HTMLElement} element
 */
function markWrapped(element) {
    if (isWrapped(element)) {return}
    element.setAttribute("data-wrapped", true)
}



/**
 * @param {HTMLElement} element
 */
function isWrapped(element) {
    return element.hasAttribute("data-wrapped")
}


export class LiveTimeDisplay {
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
        let currentTime = this.locale.format(newDate)

        this.lastTimeRecorded = newDate
        this.displayables.forEach((displayable) => {
            displayable.textContent = currentTime
        })
    }



    /**
     * @param {HTMLElement} element 
     * @returns {LiveTimeDisplay}
     */
    addElement(element) {
        if (this.displayables.includes(element)) {return}
        this.displayables.push(element)
        return this
    }



    /**
     * @returns {LiveTimeDisplay}
     */
    start() {
        if (this.enabled != true) {
            let ltd = this
            this.intervalId = setInterval(() => {ltd.handler()}, ltd.intervalLength)
            this.enabled = true
        }
        
        return this
    }



    /**
     * @returns {LiveTimeDisplay}
     */
    stop() {
        if (this.enabled != false) {
            clearInterval(this.intervalId)
            this.intervalId = 0
            this.enabled = false
        }

        return this
    }



    /**
     * @returns {LiveTimeDisplay}
     */
    restart() {
        if (this.enabled != false) {
            this.stop()
            this.start()
        }
        
        return this
    }



    /**
     * @returns {number}
     */
    getNow() {
        return new Date(this.lastTimeRecorded)
    }



    /**
     * @param {number} length 
     * @returns {LiveTimeDisplay}
     */
    setIntervalLength(length) {
        length = Math.max(length, 0)

        if (this.intervalLength != length) {
            this.intervalLength = length
            this.restart()
        }

        return this
    }
}



export class BasicDialogWrapper {
    /**
     * @param {HTMLDialogElement} dialog 
     * @param {NodeListOf<HTMLButtonElement>} exitButtons 
     */
    constructor(dialog, exitButtons) {
        if (isWrapped(dialog)) {throw "Element already wrapped."}
       
        /** @type {HTMLDialogElement} */
        this.dialog = dialog

        /** @type {[HTMLButtonElement]} */
        this.exitActions = []
        
        let primaryExitButton = dialog.querySelector("#dialog_close")
        if (primaryExitButton != null) {this.addExitAction(primaryExitButton)}

        if (exitButtons != null) {
            this.addManyExitActions(exitButtons)
        }

        markWrapped(dialog)
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



export let math = {
    /**
     * @param {number} val 
     * @param {number} low 
     * @param {number} high 
     * @returns {number}
     */
    clamp : function (val, low, high) {
        return Math.max(Math.min(val, high), low)
    }
}



export let milli = {
    day : 86400000,
    hour : 3600000,
    minute : 60000,
}



export let date = {
    months : [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ],



    /**
     * @param {string} unresolvedString 
     */
    resolveMonth : function(unresolvedString) {
        let firstLetter = unresolvedString.charAt(0)
        unresolvedString = unresolvedString.toLowerCase()

        let selectedMonths = [...this.months].filter((value) => {
            let lowercased = value.toLowerCase()
            return lowercased.startsWith(unresolvedString)
        })

        if (selectedMonths.length != 1) {
            return ""
        } else {
            return selectedMonths[0]
        }
    }
}