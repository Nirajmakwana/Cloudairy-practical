# 🧩 Cloudairy practical

A React + TypeScript-based drag-and-drop interface to design dynamic visual workflows, inspired by Zapier and Lucidchart.

---

## 🚀 Features

✅ Drag & drop nodes:  
 - Start  
 - Send Email  
 - Delay  
 - Webhook  
 - Decision  
 - End

✅ Connect nodes with edges  
✅ Set edge conditions (e.g., true/false for Decision nodes)  
✅ Node-specific configuration  
✅ Live validation rules  
✅ Export graph as JSON  
✅ Simulate execution with sample input  
✅ Built with Redux Toolkit, React Flow, Core CSS (no Tailwind)

---

## 📦 Tech Stack

- React + TypeScript  
- Redux Toolkit  
- React Flow  
- Core CSS

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Canvas.tsx
│   ├── NodeConfigPanel.tsx
├── redux/
│   ├── store.ts
│   └── workflowSlice.ts
├── styles.css
└── App.tsx
```

---

## 🛠️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Nirajmakwana/Cloudairy-practical#
cd Cloudairy-practical#
npm install
```

### 2. Run the App

```bash
npm start
```

Open your browser: `http://localhost:3000`

---

## 🧩 How to Use

1. Drag a node (e.g., **Start**, **Send Email**) from the left sidebar to the canvas.
2. Connect two nodes by dragging a connection from the source handle to the target.
   - If the source node is a **Decision**, you’ll be prompted to enter a condition (`true` or `false`).
3. Click on a node to edit its properties in the right panel (e.g., email details, delay time, webhook URL).
4. Press **Export JSON** to download the entire workflow as structured data.
5. Click **Simulate Execution** to walk through the workflow logic and log steps to the console.

---

## 🔄 JSON Output Example

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "Start",
      "position": [100, 100],
      "config": {}
    },
    {
      "id": "2",
      "type": "Send Email",
      "position": [300, 100],
      "config": { "to": "test@example.com", "subject": "Hello!" }
    }
  ],
  "edges": [
    {
      "from": "1",
      "to": "2"
    }
  ]
}
```

---

## 🧠 Validation Rules

- Only **one Start** and **one End** node allowed.
- **No cycles** in the graph.
- **Webhook** nodes must include a valid `url` in config.
- **Decision** nodes must have exactly 2 outgoing connections with conditions `true` and `false`.

---

## ⚙️ Assumptions

- Node IDs are unique and generated using `uuid` or `Date.now()` for simplicity.
- Conditions are used only on **Decision** node edges.
- Simulation walks linearly through the flow and evaluates Decision nodes using a manual input (`true`/`false`).

---

## 🧪 Bonus Ideas

- Undo/Redo functionality
- Import saved JSON back into canvas
- Auto-layout with `dagre` or `elkjs`
- Save/load from localStorage

---

## 👨‍💻 Author

[Niraj Makwana](https://www.linkedin.com/in/nirajmakwana12/)  
[Portfolio](https://portfolio-nirajmakwanas-projects.vercel.app/)  
[GitHub](https://github.com/Nirajmakwana)

---

## 📄 License

MIT
