import { addEdge, type Connection, type Edge, type Node } from '@xyflow/react';

interface ConnectionValidatorOptions {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
}

function canAddMultiEdge(
  connection: Connection,
  edges: Edge[],
  nodes: Node[],
  lettersPerQuiz: number,
  targetsPerQuiz: number,
): boolean {
  if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
    if (edges.some((e) => e.target === connection.target)) return false;
    const targetNodes = nodes.filter((n) => n.type === 'targetQuiz');
    return edges.length < targetNodes.length - 1;
  }

  if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
    if (edges.some((e) => e.source === connection.source)) return false;
    const letterNodes = nodes.filter((n) => n.type === 'letterQuiz');
    return edges.length < letterNodes.length - 1;
  }

  return true;
}

function filterExistingEdges(
  connection: Connection,
  edges: Edge[],
  lettersPerQuiz: number,
  targetsPerQuiz: number,
): Edge[] {
  if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
    return edges.filter((e) => e.source !== connection.source);
  }
  if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
    return edges.filter((e) => e.target !== connection.target);
  }
  return edges.filter(
    (e) => e.source !== connection.source && e.target !== connection.target,
  );
}

/**
 * Handles new connection logic for quiz.
 * Returns updated edges array or null if connection should be rejected.
 */
export function handleQuizConnection(
  connection: Connection,
  edges: Edge[],
  nodes: Node[],
  options: ConnectionValidatorOptions,
): Edge[] | null {
  if (!connection.source || !connection.target) return null;

  const { lettersPerQuiz, targetsPerQuiz, multiEdge } = options;

  if (
    multiEdge &&
    !canAddMultiEdge(connection, edges, nodes, lettersPerQuiz, targetsPerQuiz)
  ) {
    return null;
  }

  const newEdges = multiEdge
    ? edges
    : filterExistingEdges(connection, edges, lettersPerQuiz, targetsPerQuiz);

  const newEdge: Edge = {
    ...connection,
    id: `${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    animated: true,
  };

  return addEdge(newEdge, newEdges);
}

/**
 * Calculates the required number of connections for the quiz.
 */
export function calculateRequiredConnection(
  letterCount: number,
  targetCount: number,
  options: Pick<
    ConnectionValidatorOptions,
    'lettersPerQuiz' | 'targetsPerQuiz' | 'multiEdge'
  >,
): number {
  const { lettersPerQuiz, targetsPerQuiz, multiEdge } = options;

  if (multiEdge) {
    if (lettersPerQuiz === 1) return targetCount - 1;
    if (targetsPerQuiz === 1) return letterCount - 1;
  }
  return 1;
}
