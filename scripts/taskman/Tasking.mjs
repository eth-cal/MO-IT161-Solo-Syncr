class UUIDObject {
    #id;

 
 
    knownAs(id) {
        return this.#id == id;
    }



    toString() {
        return this.#id;
    }



    constructor(premadeId) {
        // TODO: Test for premadeID validity? Idk how UUIDv4 works.
        this.#id = premadeId? premadeId : self.crypto.randomUUID();
    }
}

/** @class Identifiable */
export class Identifiable {
    /** @type {UUIDObject} UUID v4 identifier.*/
    #id;

    /** @returns {UUIDObject} Unique ID of object. */
    getId() {
        return this.#id;
    }

    /** @returns {UUIDObject} Whether given ID matches that of the object. */
    knownAs(id) {
        return this.#id.knownAs(id);
    }

    constructor(premadeId) {
        // TODO: Test for premadeID validity? Idk how UUIDv4 works.
        this.#id = UUIDObject(premadeId);
    }
}



/**
 * @class Task
 * @extends Identifiable
 */
export class Task extends Identifiable {
    /** @type {string} */
    taskTitle;

    /** @type {string} */
    taskDescription;

    /** @type {Map<class, TaskComponent>} */
    #components;

    /** @type {PlannerContents} */
    #plannerParent;



    /** @param {TaskComponent} component */
    /** @returns {boolean} Whether the component was added successfully. */
    addComponent(component) {
        if (this.includesRoleOfComponent(component)) {
            console.error(`TaskComponent role ${component.getRole()} is already taken.`);
            return false;
        } else if (this.ownsComponent(component)) {
            console.error(`TaskComponent object with role ${component.getRole()} is owned by another task; cannot be shared.`)
            return false;
        }

        this.#components.set(component.getRole(), component);
        return true;
    }



    ownsComponent(component) {
        return component.owner() == this;
    }



    includesRoleOfComponent(component) {
        return this.#components.has(component.getRole());
    }



    toObject(withId = true, memorisePartKeys = true) {
        let obj = {
            title : this.taskTitle,
            desc : this.taskDescription,
        };

        if (withId) {
            obj.id = this.getId();
        }

        if (memorisePartKeys) {
            obj.parts = {}

            for (let [role, object] of this.#components) {
                obj.parts[role] = object.toObject()
            }
        } else {
            obj.parts = []

            for (let [role, object] of this.#components) {
                obj.parts.push(object.toObject());
            }
        }

        return obj;
    }



    /**
     * @constructor
     * @param {string} taskTitle
     * @param {string} taskDescription
     */
    constructor(taskTitle, taskDescription) {
        super();

        this.taskTitle = taskTitle | "Task";
        this.taskDescription = (taskDescription | "");
        
        this.#components = new Map();
    }
}



export class TaskComponent {
    /** @type {string} */
    #componentRole;
    /** @type {Task?} */
    #parentTask;



    /** @param {Task} task */
    setOwner(task) {
        this.#parentTask = task;
    }



    /** @returns {Task?} */
    owner() {
        return this.#parentTask;
    }



    /** @returns {boolean} */
    isOwned() {
        return this.#parentTask != undefined;
    }



    /** @returns {string} */
    getRole() {
        return this.#componentRole;
    }



    toObject(withOwner = true) {
        let obj = {
            role : this.#componentRole
        };

        if (withOwner) {
            obj.owner = this.#parentTask.getId();
        }

        return obj;
    }



    constructor(componentRole) {
        this.#componentRole = componentRole | "generic";
    }
}



export class PlannerContents extends Identifiable {
    /** @type {Map<string, Task>} */
    #tasks = new Map();



    /** @param {string} taskTitle */
    /** @param {string} taskDescription */
    /** @param {TaskComponent[]?} component */
    /** @returns {Task} */
    newTask(taskTitle, taskDescription, components) {
        let task = new Task(taskTitle, taskDescription);

        if (components != undefined) {
            for (let component of components) {
                task.addComponent(component);
            }
        }

        this.#tasks.set(task.getId(), task);
        return task;
    }



    ownsTask(task) {
        return this.#tasks.has(task.getId());
    }



    /** @param {Task} task */
    /** @returns {boolean} */
    removeTask(task) {
        if (!this.ownsTask(task)) {return false;}

        this.#tasks.delete(task.getId().toString());
    }



    toObject() {
        
    }
}



export class TaskView {
    #viewingPlanner;
}