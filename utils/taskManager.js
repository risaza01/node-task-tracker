const fs = require("fs/promises");

class TaskManager {
  constructor() {}

  async init() {
    try {
      // Verificar si el archivo tasks.json existe
      await fs.access("tasks.json");
    } catch (err) {
      // Si no existe el archivo tasks.json, lo creamos
      if (err.code === "ENOENT") {
        try {
          await fs.writeFile("tasks.json", "[]");
        } catch (writeErr) {
          throw new Error("Error al crear el archivo tasks.json", {
            cause: writeErr,
          });
        }
      } else {
        throw new Error("Error al inicializar el archivo", { cause: err });
      }
    }
  }

  async getTasks() {
    try {
      let fileHandle = await fs.open("tasks.json", "r");
      let stream = fileHandle.createReadStream();
      // Aquí se acumularán los datos leídos en formato texto
      let data = "";

      // Se retorna una promesa ya que los métodos del stream son asíncronos, por lo que queremos que retornen una respuesta al terminar la lectura
      return new Promise((resolve, reject) => {
        // Cada vez que se reciba un fragmento ("chunk") de datos, lo añadimos a 'data'
        stream.on("data", (chunk) => {
          data += chunk.toString("utf8");
        });

        // Cuando se haya terminado de leer el archivo por completo...
        stream.on("end", async () => {
          // Cerramos el file handle para liberar el recurso
          await fileHandle.close();
          try {
            // Parseamos los datos acumulados como JSON y resolvemos la promesa
            resolve(JSON.parse(data));
          } catch (err) {
            // Si ocurre un error al parsear (ej. JSON mal formado), rechazamos la promesa
            reject(new Error("Error al parsear JSON", { cause: err }));
          }
        });

        // Si ocurre algún error mientras se lee el archivo...
        stream.on("error", async (err) => {
          // Cerramos también el file handle por seguridad
          await fileHandle.close();
          // Rechazamos la promesa con el error de lectura
          reject(new Error("Error de lectura", { cause: err }));
        });
      });
    } catch (err) {
      throw new Error("Error al obtener las tareas", { cause: err });
    }
  }

  async addTask(description) {
    try {
      if (!description || !description.trim()) {
        throw new Error("Error, se debe agregar una descripción a la tarea");
      }

      // Obtener la lista actual de tareas desde el archivo JSON
      const tasks = await this.getTasks();
      // Determinar el ID para la nueva tarea
      const newId = !tasks.length ? 1 : tasks[tasks.length - 1].id + 1;
      const now = new Date().toISOString();

      // Crear un nuevo objeto de tarea con los campos requeridos
      tasks.push({
        id: newId,
        description,
        status: "todo",
        createdAt: now,
        updatedAt: now,
      });

      const fileHandle = await fs.open("tasks.json", "w");
      const stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));

      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
      });
    } catch (err) {
      throw new Error("Error al agregar una nueva tarea", { cause: err });
    }
  }
}

module.exports = TaskManager;
