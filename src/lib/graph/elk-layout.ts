import type { Edge, Node } from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import type { HierarchyDirection } from '@/schemas/graph';

const elk = new ELK();

interface ElkLayoutOptions {
  direction: HierarchyDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
}

/**
 * Apply ELK layout to nodes and edges
 * Returns new nodes with updated positions
 */
export async function applyElkLayout(
  nodes: Node[],
  edges: Edge[],
  options: ElkLayoutOptions,
): Promise<Node[]> {
  const { direction, nodeSpacing = 80, layerSpacing = 150 } = options;

  // Map direction to ELK direction
  const elkDirection = direction === 'vertical' ? 'DOWN' : 'RIGHT';

  // Create ELK graph
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': elkDirection,
      'elk.spacing.nodeNode': String(nodeSpacing),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: getNodeWidth(node.type),
      height: getNodeHeight(node.type),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(elkGraph);

    // Map positions back to nodes
    return nodes.map((node) => {
      const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);
      if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
        return { ...node, position: { x: elkNode.x, y: elkNode.y } };
      }
      return node;
    });
  } catch (error) {
    // TODO: handle error
    console.error('ELK layout error:', error);
    return nodes;
  }
}

/**
 * Get estimated node width based on type
 */
function getNodeWidth(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 64; // w-16 = 64px
    case 'articulation-area':
      return 120;
    case 'articulation-point':
      return 100;
    case 'trait-group':
      return 120;
    case 'trait':
      return 100;
    default:
      return 80;
  }
}

/**
 * Get estimated node height based on type
 */
function getNodeHeight(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 64; // h-16 = 64px
    case 'articulation-area':
      return 40;
    case 'articulation-point':
      return 32;
    case 'trait-group':
      return 48;
    case 'trait':
      return 36;
    default:
      return 40;
  }
}

/**
 * Apply radial layout to nodes
 * Places nodes in concentric circles based on their type
 */
export function applyRadialLayout(nodes: Node[], centerX: number, centerY: number): Node[] {
  // Group nodes by type
  const nodesByType = new Map<string, Node[]>();
  for (const node of nodes) {
    const type = node.type || 'default';
    if (!nodesByType.has(type)) {
      nodesByType.set(type, []);
    }
    nodesByType.get(type)?.push(node);
  }

  // Define ring radii for each type (inner to outer)
  const ringConfig: Record<string, number> = {
    letter: 350,
    'articulation-point': 550,
    'articulation-area': 650,
    trait: 500,
    'trait-group': 600,
  };

  const layoutedNodes: Node[] = [];

  for (const [type, typeNodes] of nodesByType) {
    const radius = ringConfig[type] || 300;
    typeNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / typeNodes.length - Math.PI / 2;
      layoutedNodes.push({
        ...node,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        },
      });
    });
  }

  return layoutedNodes;
}
