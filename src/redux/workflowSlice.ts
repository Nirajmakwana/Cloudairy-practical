import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface NodeConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  config?: Record<string, any>;
}

interface WorkflowState {
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  selectedNodeId: string | null;
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
};

export interface EdgeConfig {
  from: string;
  to: string;
  condition?: string;
}

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<NodeConfig>) => {
      state.nodes.push(action.payload);
    },
    setNodes: (state, action: PayloadAction<any[]>) => {
      state.nodes = action.payload;
    },
    addEdge: (state, action: PayloadAction<EdgeConfig>) => {
      state.edges.push(action.payload);
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    updateNodeConfig: (
      state,
      action: PayloadAction<{ id: string; config: Record<string, any> }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.id);
      if (node) node.config = action.payload.config;
    },
    validateWorkflow: (state) => {
      const startNodes = state.nodes.filter((n) => n.type === "Start");
      const endNodes = state.nodes.filter((n) => n.type === "End");
      if (startNodes.length > 1 || endNodes.length > 1) {
        toast.warning("Only one Start and one End node are allowed.");
      }
      for (const node of state.nodes) {
        if (node.type === "Webhook" && !node.config?.url) {
          toast.warning(`Webhook node ${node.id} requires a URL.`);
        }
        if (node.type === "Decision") {
          const outgoing = state.edges.filter((e) => e.from === node.id);
          if (outgoing.length !== 2) {
            toast.warning(
              `Decision node ${node.id} must have 2 outgoing edges.`
            );
          }
        }
      }
      const visited = new Set<string>();
      const stack = new Set<string>();
      const hasCycle = (id: string): boolean => {
        if (stack.has(id)) return true;
        if (visited.has(id)) return false;
        visited.add(id);
        stack.add(id);
        const children = state.edges
          .filter((e) => e.from === id)
          .map((e) => e.to);
        for (const child of children) {
          if (hasCycle(child)) return true;
        }
        stack.delete(id);
        return false;
      };
      for (const node of state.nodes) {
        if (hasCycle(node.id)) {
          toast.warning(`Cycle detected starting at node ${node.id}`);
          break;
        }
      }
    },
  },
});

export const {
  addNode,
  addEdge,
  selectNode,
  updateNodeConfig,
  validateWorkflow,
  setNodes,
} = workflowSlice.actions;

export default workflowSlice.reducer;
