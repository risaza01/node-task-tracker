const fs = require("fs/promises");

class TaskManager {
  constructor() {
    (async () => {
      try {
        // Verificar si el archivo tasks.json existe
        await fs.access("tasks.json");
      } catch (err) {
        // Si no existe el archivo tasks.json, lo creamos
        if (err.code === "ENOENT") {
          try {
            await fs.writeFile("tasks.json", "[]");
          } catch (err) {
            console.error(err);
          }
        } else {
          console.error(err);
        }
      }
    })();
  }
}

module.exports = TaskManager;
