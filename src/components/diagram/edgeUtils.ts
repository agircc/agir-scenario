import { Edge, MarkerType } from '@xyflow/react'

export interface Transition {
  from: string
  to: string
  condition?: string
}

export function createEdges(
  transitions: Transition[],
  stateNameToIndex: Map<string, number>
): Edge[] {
  const edges: Edge[] = []

  transitions.forEach((transition, index) => {
    const fromIndex = stateNameToIndex.get(transition.from)
    const toIndex = stateNameToIndex.get(transition.to)

    if (fromIndex === undefined || toIndex === undefined) {
      return
    }

    const hasCondition = !!transition.condition
    const isBackwardFlow = toIndex < fromIndex // Detect backward/loop transitions

    edges.push({
      id: `edge-${index}`,
      source: `state-${fromIndex}`,
      target: `state-${toIndex}`,
      type: 'animated',
      animated: true,
      style: {
        stroke: hasCondition
          ? isBackwardFlow
            ? '#f59e0b'
            : '#8b5cf6'
          : '#3b82f6',
        strokeWidth: 2,
        strokeDasharray: hasCondition ? '8,4' : '12,6',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: hasCondition
          ? isBackwardFlow
            ? '#f59e0b'
            : '#8b5cf6'
          : '#3b82f6',
        width: 12,
        height: 12,
      },
      label: transition.condition || undefined,
      labelStyle: hasCondition
        ? {
            fontSize: '11px',
            fontWeight: '600',
            fill: isBackwardFlow ? '#f59e0b' : '#8b5cf6',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${isBackwardFlow ? '#f59e0b' : '#8b5cf6'}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }
        : undefined,
      labelBgStyle: hasCondition
        ? {
            fill: 'rgba(255, 255, 255, 0.95)',
            fillOpacity: 0.95,
          }
        : undefined,
    })
  })

  return edges
}
