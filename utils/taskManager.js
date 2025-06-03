const fs = require("fs/promises");
const path = require("path");

class TaskManager {
  constructor() {
    // Obtener la zona horaria del entorno donde se ejecuta el programa
    this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Obtener la fecha y hora en formato 'en-CA'
    this.now = new Date().toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: this.userTimeZone,
    });
    // Obtener la ruta absoluta del archivo tasks.json
    this.filePath = path.join(__dirname, "../tasks.json");
  }

  async init() {
    try {
      // Verificar si el archivo tasks.json existe
      await fs.access(this.filePath);
    } catch (err) {
      // Si no existe el archivo tasks.json, lo creamos
      if (err.code === "ENOENT") {
        try {
          await fs.writeFile(this.filePath, "[]");
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
      let fileHandle = await fs.open(this.filePath, "r");
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
        throw new Error("Se debe agregar una descripción a la tarea");
      }

      // Obtener la lista actual de tareas desde el archivo JSON
      const tasks = await this.getTasks();
      // Determinar el id para la nueva tarea
      const newId = !tasks.length ? 1 : tasks[tasks.length - 1].id + 1;

      // Crear un nuevo objeto de tarea con los campos requeridos
      tasks.push({
        id: newId,
        description,
        status: "todo",
        createdAt: this.now,
        updatedAt: this.now,
      });

      const fileHandle = await fs.open(this.filePath, "w");
      const stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));
      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
        console.log("Tarea creada correctamente");
      });
    } catch (err) {
      throw new Error("Error al agregar una nueva tarea", { cause: err });
    }
  }

  async deleteTask(id) {
    try {
      let tasks = await this.getTasks();
      // Verificar si la tarea existe por su id
      const taskExist = tasks.some((task) => task.id === id);

      if (!id || !taskExist) {
        throw new Error("El id es inválido o inexistente");
      }

      // Obtener sólo las tareas que no son iguales al id
      tasks = tasks.filter((task) => task.id !== id);

      const fileHandle = await fs.open(this.filePath, "w");
      const stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));
      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
        console.log(`Tarea ${id} eliminada correctamente`);
      });
    } catch (err) {
      throw new Error("Error al eliminar la tarea", { cause: err });
    }
  }

  async updateTask(id, description) {
    try {
      const tasks = await this.getTasks();
      // Verificar si la tarea existe por su id
      const taskExist = tasks.some((task) => task.id === id);

      if (!id || !taskExist) {
        throw new Error("El id es inválido o inexistente");
      }
      if (!description || !description.trim()) {
        throw new Error("Se debe agregar una descripción a la tarea");
      }

      for (let task of tasks) {
        if (task.id === id) {
          // Modificar las propiedades de la tarea correspondiente
          task.description = description;
          task.updatedAt = this.now;
        }
      }

      const fileHandle = await fs.open(this.filePath, "w");
      const stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));
      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
        console.log(`La tarea ${id} se ha actualizado correctamente`);
      });
    } catch (err) {
      throw new Error("Error al actualizar una tarea", { cause: err });
    }
  }

  async markTask(markType, id) {
    try {
      const tasks = await this.getTasks();
      // Verificar si la tarea existe por su id
      const taskExist = tasks.some((task) => task.id === id);

      if (!id || !taskExist) {
        throw new Error("El id es inválido o inexistente");
      }

      const newStatus =
        markType === "mark-in-progress" ? "in-progress" : "done";

      for (let task of tasks) {
        if (task.id === id) {
          task.status = newStatus;
        }
      }

      const fileHandle = await fs.open(this.filePath, "w");
      const stream = fileHandle.createWriteStream();

      // Escribir la lista de tareas actualizada en el archivo
      stream.end(JSON.stringify(tasks));
      // Escuchar el evento 'finish', que se emite cuando toda la escritura ha terminado
      stream.on("finish", async () => {
        // Cerramos el file handle para liberar el recurso
        await fileHandle.close();
        console.log(`La tarea ${id} ha cambiado su estado a '${newStatus}'`);
      });
    } catch (err) {
      throw new Error("Error al marcar una tarea", { cause: err });
    }
  }

  async listTasks(listType) {
    try {
      // Validar que el tipo de lista insertado sea válido
      if (!["total", "todo", "in-progress", "done"].includes(listType)) {
        throw new Error("El tipo de lista es inválido");
      }

      let tasks = await this.getTasks();

      // Si el tipo de lista es diferente a 'total', debe filtrar las tareas según el estatus
      if (listType !== "total") {
        tasks = tasks.filter((task) => task.status === listType);
      }

      if (!tasks.length) {
        // Imprimir un mensaje informando si la lista de tareas está vacía
        console.log(`No hay tareas en la categoría "${listType}"`);
      } else {
        // Si no está vacía, debe imprimir una tabla con las tareas
        // Se hace un mapeo antes para que los campos aparezcan en español
        const tableData = tasks.map((task) => ({
          ID: task.id,
          Descripción: task.description,
          Estado: task.status,
          "Creado el": task.createdAt,
          "Actualizado el": task.updatedAt,
        }));
        console.table(tableData);
      }
    } catch (err) {
      throw new Error("Error al listar las tareas", { cause: err });
    }
  }
}

module.exports = TaskManager;
