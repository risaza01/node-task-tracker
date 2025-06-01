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
            reject(new Error("Error al parsear JSON: " + err.message));
          }
        });

        // Si ocurre algún error mientras se lee el archivo...
        stream.on("error", async (err) => {
          // Cerramos también el file handle por seguridad
          await fileHandle.close();
          // Rechazamos la promesa con el error de lectura
          reject(new Error("Error de lectura: " + err.message));
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  async addTask(description) {
    try {
      // Obtener la lista actual de tareas desde el archivo JSON
      const tasks = await this.getTasks();

      // Determinar el ID para la nueva tarea
      let newId;
      if (!tasks.length) {
        // Si no hay tareas, asigna el ID 1
        newId = 1;
      } else {
        // Si hay tareas, toma el último ID y le suma 1
        newId = tasks[tasks.length - 1].id + 1;
      }

      // Crear un nuevo objeto de tarea con los campos requeridos
      tasks.push({
        id: newId,
        description,
        status: "todo",
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      });

      let fileHandle = await fs.open("tasks.json", "w");
      let stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));

      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = TaskManager;
