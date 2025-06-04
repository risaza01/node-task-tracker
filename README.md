# 📊 Rastreador de Tareas CLI

Es una aplicación que monitorea y gestiona tareas. A través de una interfaz de línea de comandos (CLI) sencilla, monitoriza lo que se necesita hacer, lo que se ha terminado y en lo que se está trabajando actualmente.

---

## ✨ Características

- Agregar tareas con descripciones personalizadas.
- Modificar las descripciones de cada tarea.
- Eliminar tareas.
- Listar tareas por estado: `todo`, `in-progress` o `done`.
- Cambiar el estado de las tareas.
- Almacenar las tareas en un archivo `tasks.json`.
- Interfaz por línea de comandos amigable.

---

## ⚙️ Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/risaza01/node-task-tracker.git
```

2. Asegúrate de tener [Node.js](https://nodejs.org) instalado (v14 o superior).

3. Ejecuta la aplicación usando Node.js:

```bash
node task-cli.js [comando] [argumentos]
```

---

## 📖 Comandos Disponibles

### Agregar una tarea nueva

```bash
node task-cli.js add "Comprar frutas"
```

### Modificar una tarea

```bash
node task-cli.js update 1 "Comprar frutas y verduras"
```

### Eliminar una tarea

```bash
node task-cli.js delete 1
```

### Listar tareas

```bash
node task-cli.js list               # Tareas totales
node task-cli.js list todo          # Solo tareas pendientes
node task-cli.js list in-progress   # Solo tareas en progreso
node task-cli.js list done          # Solo tareas terminadas
```

### Cambiar estado de una tarea

```bash
node task-cli.js mark-in-progress 1
node task-cli.js mark-done 1
```

---

## 🔍 Estructura de Datos

Las tareas se almacenan como objetos JSON dentro del archivo `tasks.json`:

```json
[
  {
    "id": 1,
    "description": "Comprar frutas",
    "status": "todo",
    "createdAt": "2025-06-03, 14:00",
    "updatedAt": "2025-06-03, 14:00"
  }
]
```

---

## 📗 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 💬 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar esta herramienta, abre un issue o haz un pull request.

---

## 🚀 Autor

Desarrollado por Ricardo Isaza

---

¡Gracias por usar esta herramienta CLI de tareas! 🚀
