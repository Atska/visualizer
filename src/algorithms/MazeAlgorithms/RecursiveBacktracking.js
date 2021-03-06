import { shuffleArray } from "../../utils/helperFunctions.js";

/**
 * This algortihm uses a depth-first-search algorithm to traverse the graph.
 * A stack is used to keep track of the visited node and ensures the ability to backtrack if you hit a dead end.
 * The frontend graph looks like a chessboard so you have to traverse 2 nodes at the same time
 * to generate walls and passable nodes.
 * @param {Array} graph 2D-Array/Matrix consisting of specific node objects
 * @param {Object} startNode object with row, column, wall, start, end as keys
 * @param {Object} endNode object with row, column, wall, start, end as keys
 * @returns {Array} Array of wall coordinates in arrays without start and end location
 */
class RecursiveBacktracking {
  constructor(graph, startNode, endNode) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
  }

  // executes the recursive backtraking algorithm
  runMaze() {
    const start = [this.startNode.row, this.startNode.column];
    const stack = [start];
    const visited = {};
    const mazeList = [];
    this.dfs(stack, visited, mazeList);
    // removes first and last for frontend purposes
    mazeList.shift();
    mazeList.pop();
    return mazeList;
  }

  // depth-first-search algorithm to traverse the graph
  dfs(stack, visited, mazeList) {
    // pop current Node in the stack
    const currentNode = stack.pop();
    // Will become a wall node
    mazeList.push(currentNode);
    // node is visited!
    visited[currentNode] = true;
    // TODO: traverse 2 node at the same time -> [0, 0] neighbor are [0, 2] or [2, 0]
    // get all neighbors which werent visited yet
    const unvisitedNeigh = this.getUnvisitedNeighbors(currentNode, visited);
    // hit a dead end -> backtrack!
    if (unvisitedNeigh.length === 0) {
      // no value in stack -> dfs is finished
      if (stack.length === 0) return;
      // else perform dfs with the node on top of the stack (backtrack)
      return this.dfs(stack, visited, mazeList);
    }
    // has valid neighbors -> put back to stack to backtrack
    stack.push(currentNode);
    // get a random unvisited neighbor
    const neighbor = shuffleArray(unvisitedNeigh).pop();
    // Remember: We traverse 2 node at the same time -> get in between node
    const inBetweenNode = this.getInBetweenNodes(currentNode, neighbor);
    visited[inBetweenNode] = true;
    mazeList.push(inBetweenNode);
    // we traversed 2 nodes and set the current location as next node -> recursion with current node
    stack.push(neighbor);
    this.dfs(stack, visited, mazeList);
  }

  /**
   * We traverse 2 nodes at the same time. Get the in between node
   * @param {Array} currentNode current location of the node
   * @param {Array} neigh neighbor node of the current node
   * @returns {Array} location of the in between node
   */
  getInBetweenNodes(currentNode, neigh) {
    const row = (neigh[0] - currentNode[0]) / 2;
    const col = (neigh[1] - currentNode[1]) / 2;
    const inBetweenNode = [currentNode[0] + row, currentNode[1] + col];
    return inBetweenNode;
  }

  /**
   * Gets all unvisited neighbors of current node
   * @param {Array} currentNode current location of the node
   * @param {Object} visited Obj which checks if nodes are true (has been visited)
   * @returns {Array} filtered array of all unvisited nodes
   */
  getUnvisitedNeighbors(currentNode, visited) {
    const rowSize = this.graph.length - 2;
    const columnSize = this.graph[0].length - 2;
    const row = currentNode[0];
    const column = currentNode[1];
    const unvisited = [];
    // right
    if (column < columnSize) {
      unvisited.push([row, column + 2]);
    }
    // bottom
    if (row < rowSize) {
      unvisited.push([row + 2, column]);
    }
    // left
    if (column > 1) {
      unvisited.push([row, column - 2]);
    }
    // top
    if (row > 1) {
      unvisited.push([row - 2, column]);
    }
    return unvisited.filter((i) => {
      return visited[i] === undefined;
    });
  }
}

export default RecursiveBacktracking;
