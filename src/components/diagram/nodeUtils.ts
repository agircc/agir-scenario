import { Node } from '@xyflow/react'
import { type State } from '@/lib/models/Scenario'

// Layout configuration constants
export const LAYOUT_CONFIG = {
  nodeSpacing: 400, // Horizontal spacing between nodes
  levelHeight: 350, // Vertical spacing between levels
  topPadding: 100, // Top padding
}

export function createNodes(
  states: State[],
  levels: string[][],
  stateNameToIndex: Map<string, number>
): Node[] {
  const nodes: Node[] = []

  // Position nodes based on hierarchical layout
  levels.forEach((level, levelIndex) => {
    const nodesInLevel = level.length
    const totalWidth = Math.max(nodesInLevel - 1, 0) * LAYOUT_CONFIG.nodeSpacing
    const startX = -totalWidth / 2

    level.forEach((stateName, positionInLevel) => {
      const stateIndex = stateNameToIndex.get(stateName)
      if (stateIndex === undefined) return

      const state = states[stateIndex]
      const xPosition = startX + positionInLevel * LAYOUT_CONFIG.nodeSpacing
      const yPosition =
        LAYOUT_CONFIG.topPadding + levelIndex * LAYOUT_CONFIG.levelHeight

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

  return nodes
}
