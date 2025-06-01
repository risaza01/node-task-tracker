const fs = require("fs/promises");

class TaskManager {
  constructor() {
    (async () => {
      try {
        // Verificar si el archivo tasks.json existe
        this.fileHandle = await fs.open("tasks.json", "r");
      } catch (err) {
        // Si no existe el archivo tasks.json, lo creamos y volvemos a definir nuestro fileHandle
        if (err.code === "ENOENT") {
          try {
            await fs.writeFile("tasks.json", "[]");
            this.fileHandle = await fs.open("tasks.json", "r");
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
