const TaskManager = require("./utils/taskManager");

const tm = new TaskManager();

const commands = [
  "add",
  "delete",
  "update",
  "mark-in-progress",
  "mark-done",
  "list",
  "done",
  "todo",
  "in-progress",
];

const args = process.argv.slice(2);
