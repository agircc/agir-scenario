'use client'

import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { type IScenario } from '@/lib/models/Scenario'
import { AnimatedWorkflowEdge } from './AnimatedWorkflowEdge'
import { WorkflowNode } from './WorkflowNode'
import { createHierarchicalLayout } from './layoutUtils'
import { createEdges } from './edgeUtils'
import { createNodes } from './nodeUtils'
import { flowingAnimationCSS } from './diagramStyles'

interface WorkflowDiagramProps {
  scenario: IScenario
}

const nodeTypes = {
  workflowNode: WorkflowNode,
}

const edgeTypes = {
  animated: AnimatedWorkflowEdge,
}

export default function WorkflowDiagram({ scenario }: WorkflowDiagramProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const states = scenario.states || []
    const transitions = scenario.transitions || []

    if (states.length === 0) {
      return { nodes: [], edges: [] }
    }

    // Create hierarchical layout
    const { levels } = createHierarchicalLayout(states, transitions)

    // Create state name to index mapping
    const stateNameToIndex = new Map<string, number>()
    states.forEach((state, index) => {
      stateNameToIndex.set(state.name, index)
    })

    // Create nodes and edges
    const nodes: Node[] = createNodes(states, levels, stateNameToIndex)
    const edges: Edge[] = createEdges(transitions, stateNameToIndex)

    return { nodes, edges }
  }, [scenario])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Calculate optimal viewport to show the first state at the top
  const getInitialViewport = useMemo(() => {
    if (initialNodes.length === 0) {
      return { x: 0, y: 0, zoom: 0.9 }
    }

    // Find the first node (stepNumber = 1)
    const firstNode = initialNodes.find((node) => node.data?.stepNumber === 1)
    if (!firstNode) {
      return { x: 0, y: 0, zoom: 0.9 }
    }

    // Position the view so the first node appears near the top
    // Account for the container size and desired padding
    const containerWidth = 600 // Approximate container width
    const topPadding = 50 // Desired padding from top

    const x = containerWidth / 2 - firstNode.position.x
    const y = topPadding - firstNode.position.y

    return { x, y, zoom: 0.9 }
  }, [initialNodes])

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border shadow-inner">
      {/* Inject enhanced CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: flowingAnimationCSS }} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        className="bg-gradient-to-br from-slate-50 to-slate-100"
        minZoom={0.4}
        maxZoom={1.8}
        fitView={false}
        defaultViewport={getInitialViewport}
        connectOnClick={false}
        elementsSelectable={true}
        nodesConnectable={false}
        nodesDraggable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        preventScrolling={true}
      >
        <Controls />
        <Background
          variant={BackgroundVariant.Dots}
          gap={25}
          size={1.5}
          color="#cbd5e1"
        />
      </ReactFlow>
    </div>
  )
}
