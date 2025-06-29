import { type State } from '@/lib/models/Scenario'

export interface LayoutResult {
  levels: string[][]
  nodeLevel: Map<string, number>
}

// Hierarchical layout algorithm that follows workflow sequence
export function createHierarchicalLayout(
  states: State[], 
  transitions: { from: string; to: string; condition?: string }[]
): LayoutResult {
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
export function createSimpleSequentialLayout(states: State[]): LayoutResult {
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