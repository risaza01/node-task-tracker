const TaskManager = require("./utils/taskManager");

const tm = new TaskManager();
const args = process.argv.slice(2);

(async () => {
  try {
    // Verifica si el documento existe. Si no existe, lo crea
    await tm.init();

    if (args[0] === "add") {
      const description = args[1];
      await tm.addTask(description);
    } else if (args[0] === "delete") {
      const id = Number(args[1]);
      await tm.deleteTask(id);
    } else if (args[0] === "update") {
      const id = Number(args[1]);
      const description = args[2];
      await tm.updateTask(id, description);
    } else if (args[0] === "mark-in-progress" || args[0] === "mark-done") {
      const markType = args[0];
      const id = Number(args[1]);
      await tm.markTask(markType, id);
    } else if (args[0] === "list") {
      const listType = args[1] === undefined ? "total" : args[1];
      await tm.listTasks(listType);
    } else {
      throw new Error("El comando insertado es inválido");
    }
  } catch (err) {
    throw new Error("Error al ejecutar la aplicación", { cause: err });
  }
})();
