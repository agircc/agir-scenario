// Enhanced CSS for improved animations
export const flowingAnimationCSS = `
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