const TaskManager = require("./utils/taskManager");

const tm = new TaskManager();
const args = process.argv.slice(2);

(async () => {
  try {
    await tm.init();

    if (args[0] === "add") {
      const description = args[1];
      await tm.addTask(description);
    } else if (args[0] === "delete") {
      const id = Number(args[1]);
      await tm.deleteTask(id);
    }
  } catch (err) {
    throw new Error("Error al ejecutar la aplicación", { cause: err });
  }
})();
