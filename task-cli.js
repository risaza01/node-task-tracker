const TaskManager = require("./utils/taskManager");

const tm = new TaskManager();
const args = process.argv.slice(2);

(async () => {
  try {
    await tm.init();

    if (args[0] === "add") {
      let description = args[1];
      await tm.addTask(description);
    }
  } catch (err) {
    throw new Error("Error al ejecutar la aplicación", { cause: err });
  }
})();
