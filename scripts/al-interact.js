import * as cmdl from "./common.js"

const regexSignedInteger = /^(?<sign>-)?(?<value>\d+)*$/

/** @type {HTMLInputElement} */
let snoozeBox = document.getElementById("al.opts-pane.snooze")
/** @type {HTMLInputElement} */
let snoozeRepeatBox = document.getElementById("al.opts-pane.snooze.repeat")



/** @type {HTMLInputElement} */
let hourField = document.getElementById("al.opts-pane.ring-time.hour")
/** @type {HTMLInputElement} */
let minuteField = document.getElementById("al.opts-pane.ring-time.minute")
/** @type {HTMLButtonElement} */
let meridiemBox = document.getElementById("al.opts-pane.ring-time.meridiem")
/** @type {HTMLButtonElement} */
let timeNowBox = document.getElementById("al.opts-pane.ring-time.now")


/** @type {HTMLDivElement} */
let liveClockDiv = document.getElementById("al.alarms_controls.live_clock")

let liveClockInterval = new cmdl.LiveTimeDisplay(
    new Intl.DateTimeFormat(undefined, {
        hour12: true,
        timeStyle: "medium"
    })
).addElement(liveClockDiv)
    .setIntervalLength(1000)
    .start()



function ClampedTextFieldWrapper(
    /** @type {HTMLInputElement} */
    field,
    /** @type {int} */
    rMin,
    /** @type {int} */
    rMax,
    /** @type {function(int, int) => None} */
    onValidChange,
    /** @type {int} */
    defval = rMin
) {
    if (field.hasAttribute("data-lastValue")) {
        console.log(`Text field ${field.name}[${field.id}] is possibly controlled by a wrapper already.`)
        return
    }

    field.setAttribute("data-lastValue", cmdl.math.clamp(defval, rMin, rMax))
    field.addEventListener("input", function(event) {
        if (this.value == "") {return}
        
        /** @type {int} */
        let lastValue = this.getAttribute("data-lastValue")
        let results = regexSignedInteger.exec(this.value)

        if (results == null) {
            this.value = lastValue.toString()
        } else {
            let {sign, value} = results.groups

            if (sign != null && value == null) {
                return
            } else {
                sign = parseInt((sign == null? "1": sign.padEnd(2, "1")))
                value = (value == null? rMin: parseInt(value))

                let newValue = value * sign
                let clampedValue = cmdl.math.clamp(newValue, rMin, rMax)

                field.setAttribute("data-lastValue", clampedValue)
                this.value = clampedValue.toString()
                onValidChange?.(clampedValue, newValue)
            }
        }
    })

    field.value = rMin.toString()
}



function _mode_alarms_changeMeridiem(
    /** @type {String} */
    meridiem
) {
    if (meridiem != null && meridiem.length > 0) {
        let startingChar = meridiem.match("^([a-zA-Z])[Mm]?$").pop()
        if (startingChar != null) {
            switch (startingChar.toUpperCase()) {
                case 'P': meridiemBox.textContent = `PM`; break
                case 'A': meridiemBox.textContent = `AM`; break
            }
        }
    } else {
        meridiemBox.textContent = `${meridiemBox.textContent.startsWith("A")? "P": "A"}M`
    }
}



function _mode_alarms_paddedSet(field, value, leading) {
    field.value = String(value).padStart(leading, "0")
}



{
    ClampedTextFieldWrapper(
        hourField, 1, 12,
        function(num, raw) {if (raw > 12) {_mode_alarms_changeMeridiem()}}
    )

    ClampedTextFieldWrapper(
        minuteField, 0, 59,
        function(num) {_mode_alarms_paddedSet(minuteField, num, 2)}
    )



    minuteField.value = "".padStart(2, '0')
    _mode_alarms_changeMeridiem()

    snoozeBox.addEventListener("change", function(event) {
        snoozeRepeatBox.disabled = !snoozeBox.checked;
    })

    timeNowBox.addEventListener("click", function(event) {
        let timeNow = new Date()
        let hoursNow = timeNow.getHours()
        let halfHour = (hoursNow - 1) % 12

        hourField.value = halfHour + 1
        _mode_alarms_paddedSet(minuteField, timeNow.getMinutes(), 2)
        _mode_alarms_changeMeridiem(
            (hoursNow >= 12)? "PM": "AM"
        )
    })

    meridiemBox.addEventListener("click", _mode_alarms_changeMeridiem)
}