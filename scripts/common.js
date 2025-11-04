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



export class BasicDialogWrapper {
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