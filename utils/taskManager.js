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

  async getTasks() {
    try {
      let fileHandle = await fs.open("tasks.json", "r");
      let stream = fileHandle.createReadStream();
      let data = "";

      // Se retorna una promesa ya que los métodos del stream son asíncronos, por lo que queremos que retornen una respuesta al terminar la lectura
      return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => {
          data += chunk.toString("utf8");
        });

        stream.on("end", async () => {
          await fileHandle.close();
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error("Error al parsear JSON: " + err.message));
          }
        });

        stream.on("error", async (err) => {
          await fileHandle.close();
          reject(new Error("Error de lectura: " + err.message));
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = TaskManager;
