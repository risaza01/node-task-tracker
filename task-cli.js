const TaskManager = require("./utils/taskManager");

const tm = new TaskManager();
const args = process.argv.slice(2);

if (args[0] === "add") {
  let description = args[1];
  tm.addTask(description);
}
