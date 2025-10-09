import * as Tasking from "/scripts/taskman/Tasking.mjs";
/* code testing thing */

let test = new Tasking.Task("Name", "Desc")

console.log(JSON.stringify(test.toObject())) 