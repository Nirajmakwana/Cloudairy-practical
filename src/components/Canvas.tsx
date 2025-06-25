import React, { useCallback } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
  useReactFlow,
} from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addEdge,
  addNode,
  EdgeConfig,
  NodeConfig,
  setNodes,
} from "../redux/workflowSlice";
import { toast } from "react-toastify";

let nodeIdCounter = 2;

const Flow = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state: RootState) => state.workflow);

  const flowNodes = nodes.map((node) => ({
    id: node.id,
    type: "default",
    data: { label: node.type },
    position: node.position,
  }));

  const flowEdges = edges.map((e) => ({
    id: `${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    label: e.condition || "",
  }));

  const { project } = useReactFlow();

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const position = project({
        x: event.clientX - 250,
        y: event.clientY,
      });

      const newNode = {
        id: `${nodeIdCounter++}`,
        type,
        position,
        config: {},
      };

      dispatch(addNode(newNode));
    },
    [dispatch, project]
  );

  const handleNodesChange = (changes: NodeChange[]) => {
    
    const updatedNodes = applyNodeChanges(changes, nodes as any).map(
      (node) => ({
        ...node,
        data: node.data || {},
        id: node.id,
        position: node.position,
        type: node.type || "default",
      })
    ) as any[];
    dispatch(setNodes(updatedNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges as any);
    dispatch(addEdge(updatedEdges as any));
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        let condition = "";
        const fromNode = nodes.find((n) => n.id === params.source);
        if (fromNode?.type === "Decision") {
          condition =
            prompt("Enter condition for this edge (true/false):") || "";
        }

        dispatch(
          addEdge({
            from: params.source,
            to: params.target,
            condition,
          })
        );
      }
    },
    [dispatch, nodes]
  );

  const simulateExecution = (
    nodes: NodeConfig[],
    edges: EdgeConfig[],
    inputResult: boolean
  ) => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const start = nodes.find((n) => n.type === "Start");
    if (!start) return toast.warn("No Start node.");

    const visited = new Set<string>();

    let current = start;
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      toast.warn(`Executing: ${current.type}, config:`, current.config);

      const outgoing = edges.filter((e) => e.from === current!.id);
      if (current.type === "Decision") {
        const nextId = outgoing.find((e) => String(inputResult) === e.condition)
          ?.to as string;
        current = nodeMap.get(nextId) as NodeConfig;
      } else {
        const nextId = outgoing[0]?.to;
        current = nodeMap.get(nextId) as NodeConfig;
      }
    }
    if (start.type === "Start") {
      toast.warn("Simulation complete");
      return;
    }
  };

  const createJSON = () => {
    const jsondata = edges.map((e) => ({
      from: e.from,
      to: e.to,
      condition: e.condition,
    }));
    toast.success(JSON.stringify(jsondata));
  };

  return (
    <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div style={{ position: "absolute",zIndex:99999999999 , display:"grid", gap:"10px", bottom: 10, right: 10 }}>
        <div>
          <button className="cursorBtn" style={{ minWidth:"200px", backgroundColor:"blue", color:"white", padding:"10px" ,border:"none" , borderRadius:"10px"}} onClick={() => simulateExecution(nodes, edges, true)}>
            simulate
          </button>
        </div>
        <div>
          <button className="cursorBtn" style={{ zIndex:99999, minWidth:"200px",backgroundColor:"red", color:"white", padding:"10px" ,border:"none", borderRadius:"10px" }} onClick={createJSON}>Export Json</button>
        </div>
      </div>
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default Canvas;
