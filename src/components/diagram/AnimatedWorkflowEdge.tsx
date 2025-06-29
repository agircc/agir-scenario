'use client'

import React from 'react'
import {
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
} from '@xyflow/react'

// Custom Edge with animated moving dot along the path
export const AnimatedWorkflowEdge = ({
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