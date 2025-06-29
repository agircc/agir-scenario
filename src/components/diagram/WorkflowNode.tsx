'use client'

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { type Tool } from '@/lib/models/Scenario'

interface WorkflowNodeData {
  name: string
  description: string
  roles: string[]
  tools: Tool[]
  isStart?: boolean
  isEnd?: boolean
  stepNumber: number
}

interface WorkflowNodeProps {
  data: WorkflowNodeData
}

// Enhanced WorkflowNode with improved design and distinction for start/end nodes
export const WorkflowNode = ({ data }: WorkflowNodeProps) => {
  const { isStart, isEnd, stepNumber } = data

  // Determine node styling based on type
  const getNodeStyle = () => {
    if (isStart) {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderColor: '#059669',
        textColor: 'text-white',
      }
    }
    if (isEnd) {
      return {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        borderColor: '#b91c1c',
        textColor: 'text-white',
      }
    }
    return {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderColor: '#e2e8f0',
      textColor: 'text-gray-900',
    }
  }

  const nodeStyle = getNodeStyle()

  return (
    <div
      className="workflow-node relative flex items-center justify-center"
      style={{
        minHeight: '300px',
        minWidth: '350px',
      }}
    >
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
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
            opacity: isStart ? 0 : 1,
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
            opacity: isEnd ? 0 : 1,
          }}
        />

        {/* Content */}
        <div className="space-y-3">
          <div
            className={`font-bold text-lg leading-tight ${isStart || isEnd ? 'text-white' : 'text-gray-900'}`}
          >
            {data.name}
          </div>

          <div
            className={`text-sm leading-relaxed ${isStart || isEnd ? 'text-gray-100' : 'text-gray-600'}`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {data.description}
          </div>

          {data.roles && data.roles.length > 0 && (
            <div className="space-y-2">
              <div
                className={`text-xs font-semibold ${isStart || isEnd ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Agents:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.roles.map((role, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isStart || isEnd
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
              <div
                className={`text-xs font-semibold ${isStart || isEnd ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Tools:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.tools.slice(0, 3).map((tool: Tool, index: number) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isStart || isEnd
                        ? 'bg-white text-gray-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {tool.name}
                  </span>
                ))}
                {data.tools.length > 3 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isStart || isEnd
                        ? 'bg-white text-gray-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
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
