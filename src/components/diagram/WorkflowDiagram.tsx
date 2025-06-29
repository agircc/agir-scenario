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
  MarkerType,
  Handle,
  Position,
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { type IScenario, type State, type Tool } from '@/lib/models/Scenario'

interface WorkflowDiagramProps {
  scenario: IScenario
}

// Custom Edge with animated moving dot along the path
const AnimatedWorkflowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {/* Animated blue dot moving along the edge path */}
      <circle r="4" fill="#3b82f6" opacity="0.9">
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
}

// Enhanced CSS for improved animations
const flowingAnimationCSS = `
@keyframes borderFlow {
  0% {
    border-color: #9ca3af;
  }
  50% {
    border-color: #6b7280;
  }
  100% {
    border-color: #9ca3af;
  }
}

.react-flow__edge-path {
  stroke-dasharray: 8, 4 !important;
  stroke-width: 2px !important;
}

.react-flow__edge.animated .react-flow__edge-path {
  stroke-dasharray: 8, 4;
  animation: dash 2s linear infinite;
}

@keyframes dash {
  0% {
    stroke-dashoffset: 12;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.workflow-node {
  transition: all 0.2s ease-in-out;
}

.workflow-node:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
`

// Enhanced WorkflowNode with improved design and distinction for start/end nodes
const WorkflowNode = ({ data }: {
  data: {
    name: string
    description: string
    roles: string[]
    tools: Tool[]
    isStart?: boolean
    isEnd?: boolean
    stepNumber: number
  }
}) => {
  const { isStart, isEnd, stepNumber } = data

  // Determine node styling based on type
  const getNodeStyle = () => {
    if (isStart) {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderColor: '#059669',
        textColor: 'text-white'
      }
    }
    if (isEnd) {
      return {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        borderColor: '#b91c1c',
        textColor: 'text-white'
      }
    }
    return {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderColor: '#e2e8f0',
      textColor: 'text-gray-900'
    }
  }

  const nodeStyle = getNodeStyle()

  return (
    <div className="workflow-node relative flex items-center justify-center" style={{
      minHeight: '300px',
      minWidth: '350px'
    }}>
      {/* Main card */}
      <div
        className={`relative border-2 rounded-xl p-5 shadow-lg ${nodeStyle.textColor}`}
        style={{
          background: nodeStyle.background,
          borderColor: nodeStyle.borderColor,
          minWidth: '320px',
          minHeight: '240px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Step number badge */}
        <div
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{
            background: isStart ? '#059669' : isEnd ? '#b91c1c' : '#3b82f6',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {stepNumber}
        </div>

        {/* Source and Target handles */}
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: '#3b82f6',
            border: '2px solid #fff',
            width: '12px',
            height: '12px',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            opacity: isStart ? 0 : 1
          }}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#3b82f6',
            border: '2px solid #fff',
            width: '12px',
            height: '12px',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            opacity: isEnd ? 0 : 1
          }}
        />

        {/* Content */}
        <div className="space-y-3">
          <div className={`font-bold text-lg leading-tight ${isStart || isEnd ? 'text-white' : 'text-gray-900'}`}>
            {data.name}
          </div>

          <div
            className={`text-sm leading-relaxed ${isStart || isEnd ? 'text-gray-100' : 'text-gray-600'}`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {data.description}
          </div>

          {data.roles && data.roles.length > 0 && (
            <div className="space-y-2">
              <div className={`text-xs font-semibold ${isStart || isEnd ? 'text-gray-200' : 'text-gray-700'}`}>
                Agents:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.roles.map((role, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isStart || isEnd
                      ? 'bg-white text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {role.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.tools && data.tools.length > 0 && (
            <div className="space-y-2">
              <div className={`text-xs font-semibold ${isStart || isEnd ? 'text-gray-200' : 'text-gray-700'}`}>
                Tools:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.tools.slice(0, 3).map((tool: Tool, index: number) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isStart || isEnd
                      ? 'bg-white text-gray-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {tool.name}
                  </span>
                ))}
                {data.tools.length > 3 && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${isStart || isEnd
                    ? 'bg-white text-gray-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    +{data.tools.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const nodeTypes = {
  workflowNode: WorkflowNode,
}

const edgeTypes = {
  animated: AnimatedWorkflowEdge,
}

// Hierarchical layout algorithm that follows workflow sequence
function createHierarchicalLayout(states: State[], transitions: { from: string; to: string; condition?: string }[]) {
  // Build adjacency list from transitions
  const adjacencyList = new Map<string, string[]>()
  const incomingCount = new Map<string, number>()

  // Initialize
  states.forEach(state => {
    adjacencyList.set(state.name, [])
    incomingCount.set(state.name, 0)
  })

  // Build graph
  transitions.forEach(transition => {
    const fromState = transition.from
    const toState = transition.to

    if (adjacencyList.has(fromState) && adjacencyList.has(toState)) {
      adjacencyList.get(fromState)!.push(toState)
      incomingCount.set(toState, (incomingCount.get(toState) || 0) + 1)
    }
  })

  // Find root nodes (nodes with no incoming edges)
  const rootNodes = states.filter(state => incomingCount.get(state.name) === 0)

  // If no clear root, use first state
  if (rootNodes.length === 0) {
    console.warn('No clear root node found, using first state as root')
    return createSimpleSequentialLayout(states)
  }

  // Perform topological sort with level assignment
  const levels: string[][] = []
  const visited = new Set<string>()
  const nodeLevel = new Map<string, number>()

  function assignLevels(nodeName: string, level: number) {
    if (visited.has(nodeName)) return

    visited.add(nodeName)
    nodeLevel.set(nodeName, level)

    // Ensure level exists
    while (levels.length <= level) {
      levels.push([])
    }
    levels[level].push(nodeName)

    // Process children
    const children = adjacencyList.get(nodeName) || []
    children.forEach(child => {
      assignLevels(child, level + 1)
    })
  }

  // Start from root nodes
  rootNodes.forEach(root => assignLevels(root.name, 0))

  // Handle any remaining unvisited nodes
  states.forEach(state => {
    if (!visited.has(state.name)) {
      const level = Math.max(...Array.from(nodeLevel.values())) + 1
      assignLevels(state.name, level)
    }
  })

  return { levels, nodeLevel }
}

// Fallback sequential layout
function createSimpleSequentialLayout(states: State[]) {
  const levels: string[][] = []
  const nodeLevel = new Map<string, number>()

  // Simple sequential layout with 3 nodes per row
  const nodesPerRow = 3

  for (let i = 0; i < states.length; i += nodesPerRow) {
    const level = Math.floor(i / nodesPerRow)
    levels[level] = []

    for (let j = i; j < Math.min(i + nodesPerRow, states.length); j++) {
      levels[level].push(states[j].name)
      nodeLevel.set(states[j].name, level)
    }
  }

  return { levels, nodeLevel }
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

    // Layout configuration
    const nodeSpacing = 400  // Horizontal spacing between nodes
    const levelHeight = 350  // Vertical spacing between levels
    const topPadding = 100   // Top padding

    const nodes: Node[] = []
    const stateNameToIndex = new Map<string, number>()

    // Create state name to index mapping
    states.forEach((state, index) => {
      stateNameToIndex.set(state.name, index)
    })

    // Position nodes based on hierarchical layout
    levels.forEach((level, levelIndex) => {
      const nodesInLevel = level.length
      const totalWidth = Math.max(nodesInLevel - 1, 0) * nodeSpacing
      const startX = -totalWidth / 2

      level.forEach((stateName, positionInLevel) => {
        const stateIndex = stateNameToIndex.get(stateName)
        if (stateIndex === undefined) return

        const state = states[stateIndex]
        const xPosition = startX + positionInLevel * nodeSpacing
        const yPosition = topPadding + levelIndex * levelHeight

        // Determine if this is start or end node
        const isStart = levelIndex === 0 && positionInLevel === 0
        const isEnd = stateName === 'Case Closed'

        nodes.push({
          id: `state-${stateIndex}`,
          type: 'workflowNode',
          position: { x: xPosition, y: yPosition },
          data: {
            name: state.name,
            description: state.description,
            roles: state.roles,
            tools: state.tools,
            inputs: state.inputs,
            outputs: state.outputs,
            isStart,
            isEnd,
            stepNumber: stateIndex + 1,
          },
        })
      })
    })

    // Create edges with improved styling
    const edges: Edge[] = []
    transitions.forEach((transition, index) => {
      const fromIndex = stateNameToIndex.get(transition.from)
      const toIndex = stateNameToIndex.get(transition.to)

      if (fromIndex === undefined || toIndex === undefined) {
        return
      }

      const hasCondition = !!transition.condition
      const isBackwardFlow = (toIndex < fromIndex) // Detect backward/loop transitions

      edges.push({
        id: `edge-${index}`,
        source: `state-${fromIndex}`,
        target: `state-${toIndex}`,
        type: 'animated',
        animated: true,
        style: {
          stroke: hasCondition ? (isBackwardFlow ? '#f59e0b' : '#8b5cf6') : '#3b82f6',
          strokeWidth: 2,
          strokeDasharray: hasCondition ? '8,4' : '12,6',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: hasCondition ? (isBackwardFlow ? '#f59e0b' : '#8b5cf6') : '#3b82f6',
          width: 12,
          height: 12,
        },
        label: transition.condition || undefined,
        labelStyle: hasCondition ? {
          fontSize: '11px',
          fontWeight: '600',
          fill: isBackwardFlow ? '#f59e0b' : '#8b5cf6',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${isBackwardFlow ? '#f59e0b' : '#8b5cf6'}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        } : undefined,
        labelBgStyle: hasCondition ? {
          fill: 'rgba(255, 255, 255, 0.95)',
          fillOpacity: 0.95,
        } : undefined
      })
    })

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
    const firstNode = initialNodes.find(node => node.data?.stepNumber === 1)
    if (!firstNode) {
      return { x: 0, y: 0, zoom: 0.9 }
    }

    // Position the view so the first node appears near the top
    // Account for the container size and desired padding
    const containerWidth = 600 // Approximate container width
    const topPadding = 50 // Desired padding from top

    const x = (containerWidth / 2) - firstNode.position.x
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
        <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} color="#cbd5e1" />
      </ReactFlow>
    </div>
  )
}
