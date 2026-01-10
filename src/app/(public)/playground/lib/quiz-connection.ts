import { addEdge, type Connection, type Edge, type Node } from '@xyflow/react';

interface ConnectionValidatorOptions {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
}

/**
 * Validates if a connection between quiz nodes is valid.
 */
export function isValidQuizConnection(connection: Edge | Connection): boolean {
  const sourceId = connection.source;
  const targetId = connection.target;
  return Boolean(
    sourceId?.startsWith('letter-quiz-') &&
      targetId?.startsWith('target-quiz-'),
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
  let newEdges: Edge[];

  if (multiEdge) {
    if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
      const connectionExists = edges.some(
        (e) => e.target === connection.target,
      );
      if (connectionExists) return null;
      const targetNodes = nodes.filter((n) => n.type === 'targetQuiz');
      const maxEdges = targetNodes.length - 1;
      if (edges.length >= maxEdges) return null;
    }

    if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
      const connectionExists = edges.some(
        (e) => e.source === connection.source,
      );
      if (connectionExists) return null;
      const letterNodes = nodes.filter((n) => n.type === 'letterQuiz');
      const maxEdges = letterNodes.length - 1;
      if (edges.length >= maxEdges) return null;
    }

    newEdges = edges;
  } else {
    if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
      newEdges = edges.filter((e) => e.source !== connection.source);
    } else if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
      newEdges = edges.filter((e) => e.target !== connection.target);
    } else {
      newEdges = edges.filter(
        (e) => e.source !== connection.source && e.target !== connection.target,
      );
    }
  }

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
export function calculateRequiredConnections(
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
