const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Question = require('../models/Question');
const CodingQuestion = require('../models/CodingQuestion');
const CodingSubmission = require('../models/CodingSubmission');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const QuestionAttempt = require('../models/QuestionAttempt');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const SecurityEvent = require('../models/SecurityEvent');
const { osAndNetworksQuestions } = require('./osAndNetworksQuestions');
const { codingQuestionsData } = require('./codingQuestionsData');
const { connectDB, disconnectDB } = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

// 120 Comprehensive technical questions across DSA, SQL, OOP, and DBMS (10 Easy, 10 Med, 10 Hard each)
const questionsData = [
  // ===================== DSA EASY (10) =====================
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the time complexity of accessing an element in an array by its index?',
    options: [{ id: 'A', text: 'O(1)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(log n)' }, { id: 'D', text: 'O(n²)' }],
    correctAnswer: 'A',
    explanation: 'Arrays store elements in contiguous memory locations, allowing direct memory offset computation in O(1) constant time.',
    tags: ['DSA', 'Arrays', 'Complexity']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which data structure follows the Last In First Out (LIFO) principle?',
    options: [{ id: 'A', text: 'Queue' }, { id: 'B', text: 'Stack' }, { id: 'C', text: 'Linked List' }, { id: 'D', text: 'Binary Tree' }],
    correctAnswer: 'B',
    explanation: 'A Stack is a linear data structure adhering strictly to the Last In First Out (LIFO) order.',
    tags: ['DSA', 'Stack', 'Basics']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the best-case time complexity of Linear Search in an unsorted list of size n?',
    options: [{ id: 'A', text: 'O(n)' }, { id: 'B', text: 'O(log n)' }, { id: 'C', text: 'O(1)' }, { id: 'D', text: 'O(n log n)' }],
    correctAnswer: 'C',
    explanation: 'If the target item resides at the very first index of the array, linear search completes in O(1) time.',
    tags: ['DSA', 'Searching']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which of the following data structures is non-linear?',
    options: [{ id: 'A', text: 'Array' }, { id: 'B', text: 'Singly Linked List' }, { id: 'C', text: 'Queue' }, { id: 'D', text: 'Binary Tree' }],
    correctAnswer: 'D',
    explanation: 'Trees and Graphs are non-linear data structures because elements are organized hierarchically rather than sequentially.',
    tags: ['DSA', 'Trees']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the average time complexity of inserting a node at the head of a Singly Linked List?',
    options: [{ id: 'A', text: 'O(1)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(log n)' }, { id: 'D', text: 'O(n²)' }],
    correctAnswer: 'A',
    explanation: 'Inserting at the head simply requires updating the new nodes next pointer and the head pointer, taking constant O(1) time.',
    tags: ['DSA', 'Linked List']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which operation is used to add an item to the end of a standard Queue?',
    options: [{ id: 'A', text: 'Pop' }, { id: 'B', text: 'Enqueue' }, { id: 'C', text: 'Dequeue' }, { id: 'D', text: 'Peek' }],
    correctAnswer: 'B',
    explanation: 'Enqueue adds an element to the rear of the queue, while Dequeue removes an element from the front.',
    tags: ['DSA', 'Queue']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'In a complete binary tree of depth d, what is the maximum number of nodes at level d (where root is level 0)?',
    options: [{ id: 'A', text: '2^d' }, { id: 'B', text: '2^(d+1) - 1' }, { id: 'C', text: '2^(d-1)' }, { id: 'D', text: 'd²' }],
    correctAnswer: 'A',
    explanation: 'At level 0 there is 1 node (2^0), level 1 has 2 (2^1), and general level d has at most 2^d nodes.',
    tags: ['DSA', 'Trees']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the space complexity of an in-place Bubble Sort algorithm?',
    options: [{ id: 'A', text: 'O(n)' }, { id: 'B', text: 'O(log n)' }, { id: 'C', text: 'O(1)' }, { id: 'D', text: 'O(n²)' }],
    correctAnswer: 'C',
    explanation: 'In-place Bubble Sort operates directly on the input array requiring only a constant amount of auxiliary memory O(1).',
    tags: ['DSA', 'Sorting']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which data structure is primarily used in implementing recursion calls under the hood?',
    options: [{ id: 'A', text: 'Queue' }, { id: 'B', text: 'Call Stack' }, { id: 'C', text: 'Priority Queue' }, { id: 'D', text: 'Heap' }],
    correctAnswer: 'B',
    explanation: 'The runtime environment employs the call stack to maintain active stack frames and return addresses during recursive function calls.',
    tags: ['DSA', 'Recursion', 'Stack']
  },
  {
    topic: 'DSA', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the time complexity of searching in a sorted array using Binary Search?',
    options: [{ id: 'A', text: 'O(n)' }, { id: 'B', text: 'O(log n)' }, { id: 'C', text: 'O(n log n)' }, { id: 'D', text: 'O(1)' }],
    correctAnswer: 'B',
    explanation: 'Binary search halves the search interval at every step, yielding a logarithmic runtime of O(log n).',
    tags: ['DSA', 'Searching']
  },

  // ===================== DSA MEDIUM (10) =====================
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the worst-case time complexity of QuickSort when the pivot chosen is always the maximum or minimum element?',
    options: [{ id: 'A', text: 'O(n log n)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(n²)' }, { id: 'D', text: 'O(2^n)' }],
    correctAnswer: 'C',
    explanation: 'When the partition is unbalanced into sizes 0 and n-1 at each recursive level, QuickSort degrades to O(n²).',
    tags: ['DSA', 'Sorting', 'Complexity']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which algorithmic approach does Floyd-Warshall use for solving the all-pairs shortest path problem?',
    options: [{ id: 'A', text: 'Greedy' }, { id: 'B', text: 'Divide and Conquer' }, { id: 'C', text: 'Dynamic Programming' }, { id: 'D', text: 'Backtracking' }],
    correctAnswer: 'C',
    explanation: 'Floyd-Warshall evaluates shortest paths between all pairs using intermediate vertices through dynamic programming in O(V³) time.',
    tags: ['DSA', 'Graphs', 'DP']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'How can you detect a cycle in a linked list using O(1) auxiliary memory?',
    options: [{ id: 'A', text: 'Hash set of visited pointers' }, { id: 'B', text: 'Floyds Tortoise and Hare algorithm' }, { id: 'C', text: 'Recursion with visited boolean flag' }, { id: 'D', text: 'Invert pointer direction' }],
    correctAnswer: 'B',
    explanation: 'Floyds cycle detection employs two pointers advancing at speeds 1 and 2, which meet inside any cycle in O(1) space.',
    tags: ['DSA', 'Pointers', 'Linked List']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the balance factor of a node in an AVL tree defined as?',
    options: [{ id: 'A', text: 'Height(Left) - Height(Right)' }, { id: 'B', text: 'Depth(Left) + Depth(Right)' }, { id: 'C', text: 'Nodes(Left) - Nodes(Right)' }, { id: 'D', text: 'Height(Root) - Height(Node)' }],
    correctAnswer: 'A',
    explanation: 'In an AVL tree, the balance factor is defined as the height of the left subtree minus the height of the right subtree, and must be -1, 0, or 1.',
    tags: ['DSA', 'AVL Tree']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which data structure is most suitable for implementing Dijkstras algorithm efficiently with adjacency lists?',
    options: [{ id: 'A', text: 'Stack' }, { id: 'B', text: 'Min-Heap (Priority Queue)' }, { id: 'C', text: 'Circular Queue' }, { id: 'D', text: 'Double-ended Queue' }],
    correctAnswer: 'B',
    explanation: 'A min-heap extracts the minimum distance unvisited vertex in O(log V) time, giving O((V + E) log V) total complexity.',
    tags: ['DSA', 'Graphs', 'Heap']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In a 0/1 Knapsack problem with n items and capacity W, what is the standard DP time complexity?',
    options: [{ id: 'A', text: 'O(n²)' }, { id: 'B', text: 'O(n * W)' }, { id: 'C', text: 'O(2^n)' }, { id: 'D', text: 'O(W²)' }],
    correctAnswer: 'B',
    explanation: 'The standard dynamic programming tabulation fills an n x W matrix, running in pseudo-polynomial time O(n * W).',
    tags: ['DSA', 'DP']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the time complexity of building a Binary Heap of n elements using the bottom-up Heapify method?',
    options: [{ id: 'A', text: 'O(n log n)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(n²)' }, { id: 'D', text: 'O(log n)' }],
    correctAnswer: 'B',
    explanation: 'Bottom-up heap construction sums the heights across all nodes, forming a converging geometric series bounded strictly by O(n).',
    tags: ['DSA', 'Heap']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the amortized cost of inserting elements into a hash table that resolves collisions using separate chaining?',
    options: [{ id: 'A', text: 'O(n)' }, { id: 'B', text: 'O(log n)' }, { id: 'C', text: 'O(1)' }, { id: 'D', text: 'O(n²)' }],
    correctAnswer: 'C',
    explanation: 'With a good hash function and proper load factor alpha, the average chain length is constant, providing O(1) average lookup/insert.',
    tags: ['DSA', 'Hash Table']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which tree traversal produces the prefix expression corresponding to an expression tree?',
    options: [{ id: 'A', text: 'In-order' }, { id: 'B', text: 'Pre-order' }, { id: 'C', text: 'Post-order' }, { id: 'D', text: 'Level-order' }],
    correctAnswer: 'B',
    explanation: 'Pre-order traversal visits root operator before operands, producing the polish prefix notation (+ A B).',
    tags: ['DSA', 'Trees']
  },
  {
    topic: 'DSA', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the maximum number of edges in a simple undirected connected graph with V vertices?',
    options: [{ id: 'A', text: 'V * (V - 1) / 2' }, { id: 'B', text: 'V * (V - 1)' }, { id: 'C', text: 'V - 1' }, { id: 'D', text: '2^V' }],
    correctAnswer: 'A',
    explanation: 'A complete undirected graph connects every pair of vertices once without self-loops, giving V choose 2 = V(V - 1)/2 edges.',
    tags: ['DSA', 'Graphs']
  },

  // ===================== DSA HARD (10) =====================
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the tight worst-case time complexity of finding the k-th smallest element using the Median-of-Medians algorithm?',
    options: [{ id: 'A', text: 'O(n log n)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(n²)' }, { id: 'D', text: 'O(k log n)' }],
    correctAnswer: 'B',
    explanation: 'The Median-of-Medians pivot selection guarantees at worst a 70/30 partition split, yielding T(n) <= T(n/5) + T(7n/10) + O(n) = O(n) strictly deterministic worst-case.',
    tags: ['DSA', 'Algorithms', 'Advanced']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which data structure supports disjoint-set union (Union-Find) operations in nearly constant alpha(n) inverse Ackermann time?',
    options: [{ id: 'A', text: 'Path compression + Union by rank' }, { id: 'B', text: 'Binary Indexed Tree (Fenwick)' }, { id: 'C', text: 'Splay Tree' }, { id: 'D', text: 'Trie' }],
    correctAnswer: 'A',
    explanation: 'Combining path compression during Find with union by rank or size bounds the amortized cost per operation to O(alpha(n)).',
    tags: ['DSA', 'Disjoint Set']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the maximum flow value equal to in a directed network according to the Max-Flow Min-Cut theorem?',
    options: [{ id: 'A', text: 'The maximum capacity of any single path' }, { id: 'B', text: 'The net capacity of the minimum s-t cut' }, { id: 'C', text: 'The total capacity of all outgoing edges from source' }, { id: 'D', text: 'The chromatic number of the graph' }],
    correctAnswer: 'B',
    explanation: 'The Max-Flow Min-Cut theorem states that in a flow network, the maximum amount of flow passing from source to sink equals the total capacity of the edges in the minimum cut.',
    tags: ['DSA', 'Network Flow']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In a Segment Tree storing range minimums for an array of length n, what is the time complexity of both point update and range query?',
    options: [{ id: 'A', text: 'Update: O(1), Query: O(n)' }, { id: 'B', text: 'Update: O(log n), Query: O(log n)' }, { id: 'C', text: 'Update: O(n), Query: O(1)' }, { id: 'D', text: 'Update: O(log n), Query: O(1)' }],
    correctAnswer: 'B',
    explanation: 'Segment trees partition ranges into binary intervals of height ceil(log n), executing both point updates and range queries in O(log n).',
    tags: ['DSA', 'Segment Tree']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the amortized time complexity of an operation in a Splay Tree over an arbitrary sequence of m operations?',
    options: [{ id: 'A', text: 'O(log n)' }, { id: 'B', text: 'O(1)' }, { id: 'C', text: 'O(n)' }, { id: 'D', text: 'O(sqrt(n))' }],
    correctAnswer: 'A',
    explanation: 'Via Tarjans potential method, splaying self-adjusts frequently accessed nodes, proving an amortized bound of O(log n) per operation.',
    tags: ['DSA', 'Splay Tree']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which string matching algorithm uses a Failure Function (partial match table) to achieve O(n + m) worst-case time?',
    options: [{ id: 'A', text: 'Rabin-Karp' }, { id: 'B', text: 'Knuth-Morris-Pratt (KMP)' }, { id: 'C', text: 'Boyer-Moore' }, { id: 'D', text: 'Aho-Corasick' }],
    correctAnswer: 'B',
    explanation: 'KMP precomputes the longest proper prefix that is also a suffix (LPS array), avoiding backtracking on text characters.',
    tags: ['DSA', 'Strings', 'KMP']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the time complexity of finding Strongly Connected Components (SCCs) using Tarjans algorithm on a graph G(V, E)?',
    options: [{ id: 'A', text: 'O(V²)' }, { id: 'B', text: 'O(V + E)' }, { id: 'C', text: 'O(V * E)' }, { id: 'D', text: 'O(V log V + E)' }],
    correctAnswer: 'B',
    explanation: 'Tarjans SCC algorithm performs a single depth-first search tracking discovery times and low-link values in linear O(V + E) time.',
    tags: ['DSA', 'Graphs', 'Tarjan']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In a Fibonacci Heap, what is the amortized cost of the Decrease-Key operation?',
    options: [{ id: 'A', text: 'O(log n)' }, { id: 'B', text: 'O(1)' }, { id: 'C', text: 'O(n)' }, { id: 'D', text: 'O(log* n)' }],
    correctAnswer: 'B',
    explanation: 'Fibonacci heaps delay tree consolidation and use cascading cuts, giving Decrease-Key an amortized complexity of O(1).',
    tags: ['DSA', 'Advanced Heaps']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'How many distinct topological orderings can a Directed Acyclic Graph (DAG) with n independent isolated vertices possess?',
    options: [{ id: 'A', text: '1' }, { id: 'B', text: 'n' }, { id: 'C', text: 'n!' }, { id: 'D', text: '2^n' }],
    correctAnswer: 'C',
    explanation: 'With zero precedence constraints among n vertices, any permutation of the n vertices forms a valid topological sort, giving n! permutations.',
    tags: ['DSA', 'Graphs', 'Topological Sort']
  },
  {
    topic: 'DSA', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which property distinguishes a Treap from a standard Binary Search Tree?',
    options: [{ id: 'A', text: 'Keys satisfy BST property; randomly generated priorities satisfy Max/Min Heap property' }, { id: 'B', text: 'Colors alternate between red and black' }, { id: 'C', text: 'Height is strictly log2(n) without rotations' }, { id: 'D', text: 'All leaves must remain at the same level' }],
    correctAnswer: 'A',
    explanation: 'A Treap is a randomized BST where nodes maintain search tree ordering by key and heap ordering by priority, ensuring O(log n) expected height.',
    tags: ['DSA', 'Treap']
  },

  // ===================== SQL EASY (10) =====================
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which SQL command is used to extract data from a database table?',
    options: [{ id: 'A', text: 'GET' }, { id: 'B', text: 'EXTRACT' }, { id: 'C', text: 'SELECT' }, { id: 'D', text: 'FETCH' }],
    correctAnswer: 'C',
    explanation: 'SELECT is the fundamental SQL DQL statement used to query and read data records from tables.',
    tags: ['SQL', 'DQL']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which clause is used to filter records in a basic SELECT statement before grouping?',
    options: [{ id: 'A', text: 'HAVING' }, { id: 'B', text: 'WHERE' }, { id: 'C', text: 'ORDER BY' }, { id: 'D', text: 'GROUP BY' }],
    correctAnswer: 'B',
    explanation: 'WHERE filters row records meeting a specific boolean condition prior to any aggregate operations.',
    tags: ['SQL', 'Filtering']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which SQL keyword is used to eliminate duplicate rows from the query output?',
    options: [{ id: 'A', text: 'UNIQUE' }, { id: 'B', text: 'DISTINCT' }, { id: 'C', text: 'DIFFERENT' }, { id: 'D', text: 'NO_REPEAT' }],
    correctAnswer: 'B',
    explanation: 'SELECT DISTINCT returns only unique tuples by removing duplicated rows from the result set.',
    tags: ['SQL', 'Keywords']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the default sort order applied by the ORDER BY clause?',
    options: [{ id: 'A', text: 'Descending (DESC)' }, { id: 'B', text: 'Ascending (ASC)' }, { id: 'C', text: 'Random' }, { id: 'D', text: 'Primary Key Order' }],
    correctAnswer: 'B',
    explanation: 'If neither ASC nor DESC is explicitly declared, SQL orders results in Ascending (ASC) order by default.',
    tags: ['SQL', 'Sorting']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which aggregate function returns the count of non-null values in a given column?',
    options: [{ id: 'A', text: 'TOTAL()' }, { id: 'B', text: 'SUM()' }, { id: 'C', text: 'COUNT(column)' }, { id: 'D', text: 'LEN()' }],
    correctAnswer: 'C',
    explanation: 'COUNT(column_name) counts all non-NULL occurrences, whereas COUNT(*) counts all rows regardless of NULLs.',
    tags: ['SQL', 'Aggregates']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which constraint uniquely identifies each row in a database table and disallows NULLs?',
    options: [{ id: 'A', text: 'UNIQUE' }, { id: 'B', text: 'FOREIGN KEY' }, { id: 'C', text: 'PRIMARY KEY' }, { id: 'D', text: 'CHECK' }],
    correctAnswer: 'C',
    explanation: 'A PRIMARY KEY enforces both uniqueness and non-nullability for row identification.',
    tags: ['SQL', 'Constraints']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which SQL operator is used to test for the absence of a value (null value)?',
    options: [{ id: 'A', text: '= NULL' }, { id: 'B', text: 'IS NULL' }, { id: 'C', text: '== NULL' }, { id: 'D', text: 'LIKE NULL' }],
    correctAnswer: 'B',
    explanation: 'NULL represents an unknown state, so comparison operators like = return NULL/Unknown; IS NULL must be used.',
    tags: ['SQL', 'Nullability']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which statement permanently deletes all records from a table without logging individual row deletions?',
    options: [{ id: 'A', text: 'DROP TABLE' }, { id: 'B', text: 'TRUNCATE TABLE' }, { id: 'C', text: 'DELETE FROM' }, { id: 'D', text: 'REMOVE TABLE' }],
    correctAnswer: 'B',
    explanation: 'TRUNCATE TABLE is a DDL operation that deallocates data pages rapidly without per-row undo logging.',
    tags: ['SQL', 'DDL']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which SQL wildcard character represents zero, one, or multiple characters in a LIKE pattern?',
    options: [{ id: 'A', text: '_' }, { id: 'B', text: '%' }, { id: 'C', text: '*' }, { id: 'D', text: '?' }],
    correctAnswer: 'B',
    explanation: '% matches any sequence of zero or more characters, whereas _ matches exactly one single character.',
    tags: ['SQL', 'Pattern Matching']
  },
  {
    topic: 'SQL', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which command modifies existing data inside a table?',
    options: [{ id: 'A', text: 'ALTER' }, { id: 'B', text: 'MODIFY' }, { id: 'C', text: 'UPDATE' }, { id: 'D', text: 'CHANGE' }],
    correctAnswer: 'C',
    explanation: 'UPDATE is the DML command used to alter attribute values of existing records in a table.',
    tags: ['SQL', 'DML']
  },

  // ===================== SQL MEDIUM (10) =====================
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the main distinction between UNION and UNION ALL?',
    options: [{ id: 'A', text: 'UNION preserves duplicate rows; UNION ALL strips duplicates' }, { id: 'B', text: 'UNION removes duplicate rows; UNION ALL retains all duplicates' }, { id: 'C', text: 'UNION can only combine two tables; UNION ALL can combine many' }, { id: 'D', text: 'UNION sorts alphabetically; UNION ALL sorts numerically' }],
    correctAnswer: 'B',
    explanation: 'UNION performs a distinct sort/hash to strip duplicates across result sets; UNION ALL simply concatenates rows directly.',
    tags: ['SQL', 'Set Operations']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which window function produces ranking without leaving gaps between consecutive rank values (e.g. 1, 2, 2, 3)?',
    options: [{ id: 'A', text: 'RANK()' }, { id: 'B', text: 'DENSE_RANK()' }, { id: 'C', text: 'ROW_NUMBER()' }, { id: 'D', text: 'PERCENT_RANK()' }],
    correctAnswer: 'B',
    explanation: 'DENSE_RANK() assigns consecutive rank integers without skipping numbers when ties occur.',
    tags: ['SQL', 'Window Functions']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In an INNER JOIN, what happens to rows in Table A that do not match any row in Table B?',
    options: [{ id: 'A', text: 'Included with NULL fields from Table B' }, { id: 'B', text: 'Excluded from the final result' }, { id: 'C', text: 'Assigned default table values' }, { id: 'D', text: 'Causes an SQL error' }],
    correctAnswer: 'B',
    explanation: 'INNER JOIN strictly returns tuples where the join predicate evaluates to true for both tables, discarding unmatched rows.',
    tags: ['SQL', 'Joins']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What does a Common Table Expression (CTE) defined with the WITH clause provide?',
    options: [{ id: 'A', text: 'A permanent materialized view in the database' }, { id: 'B', text: 'A temporary named result set existing only for the execution scope of a query' }, { id: 'C', text: 'A physical table index' }, { id: 'D', text: 'An encrypted database trigger' }],
    correctAnswer: 'B',
    explanation: 'A CTE provides a readable, modular temporary result set defined using WITH that exists solely during single query execution.',
    tags: ['SQL', 'CTE']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which clause is mandatory to filter aggregate values generated by GROUP BY?',
    options: [{ id: 'A', text: 'WHERE' }, { id: 'B', text: 'HAVING' }, { id: 'C', text: 'FILTER' }, { id: 'D', text: 'QUALIFY' }],
    correctAnswer: 'B',
    explanation: 'HAVING operates after aggregation groups are formulated, allowing conditions on aggregate expressions like HAVING COUNT(*) > 5.',
    tags: ['SQL', 'Aggregation']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What will be the result of: SELECT COALESCE(NULL, NULL, \'Zelis\', \'Healthcare\')?',
    options: [{ id: 'A', text: 'NULL' }, { id: 'B', text: 'Zelis' }, { id: 'C', text: 'Healthcare' }, { id: 'D', text: 'Zelis Healthcare' }],
    correctAnswer: 'B',
    explanation: 'COALESCE returns the very first non-null argument encountered in its parameter list from left to right.',
    tags: ['SQL', 'Functions']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is a Correlated Subquery in SQL?',
    options: [{ id: 'A', text: 'A subquery that executes once independently before the outer query' }, { id: 'B', text: 'A subquery that references columns from the outer query and re-evaluates for every outer row' }, { id: 'C', text: 'A subquery used only inside CREATE TABLE statements' }, { id: 'D', text: 'A recursive UNION statement' }],
    correctAnswer: 'B',
    explanation: 'A correlated subquery depends on values from the current outer row, causing it to evaluate per outer candidate row.',
    tags: ['SQL', 'Subqueries']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which index type is most efficient for queries involving range scans like "WHERE age BETWEEN 25 AND 35"?',
    options: [{ id: 'A', text: 'Hash Index' }, { id: 'B', text: 'B-Tree Index' }, { id: 'C', text: 'Full-Text Index' }, { id: 'D', text: 'Spatial Index' }],
    correctAnswer: 'B',
    explanation: 'B-Tree leaf pages maintain ordered linked lists of keys, making range searches and sorted scans extremely fast.',
    tags: ['SQL', 'Indexing']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the effect of an ON DELETE CASCADE constraint on a Foreign Key?',
    options: [{ id: 'A', text: 'Blocks deletion of parent row if children exist' }, { id: 'B', text: 'Automatically deletes corresponding child rows when the referenced parent row is deleted' }, { id: 'C', text: 'Sets foreign key columns in child rows to NULL' }, { id: 'D', text: 'Raises an unhandled exception' }],
    correctAnswer: 'B',
    explanation: 'ON DELETE CASCADE propagates deletions in the parent table down to dependent child rows automatically.',
    tags: ['SQL', 'Foreign Keys']
  },
  {
    topic: 'SQL', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which window clause defines a rolling window of the previous 2 rows and the current row?',
    options: [{ id: 'A', text: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW' }, { id: 'B', text: 'RANGE 2 ROWS' }, { id: 'C', text: 'WINDOW 3 ROWS' }, { id: 'D', text: 'OFFSET 2 ROWS' }],
    correctAnswer: 'A',
    explanation: 'The ROWS frame specification explicitly bounds the aggregation to the current row and the preceding 2 rows.',
    tags: ['SQL', 'Window Framing']
  },

  // ===================== SQL HARD (10) =====================
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Under the SQL-92 standard, which isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads completely?',
    options: [{ id: 'A', text: 'Read Committed' }, { id: 'B', text: 'Repeatable Read' }, { id: 'C', text: 'Serializable' }, { id: 'D', text: 'Snapshot Isolation' }],
    correctAnswer: 'C',
    explanation: 'Serializable is the highest ANSI isolation level, ensuring transactions appear as though executed sequentially, eliminating all concurrency anomalies.',
    tags: ['SQL', 'Transactions', 'ACID']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is an "Index Covering" query (Covering Index) in database query optimization?',
    options: [{ id: 'A', text: 'An index that covers all tables in the entire database schema' }, { id: 'B', text: 'A query whose SELECT, WHERE, and JOIN columns are fully resolved from index leaf nodes without accessing base table pages' }, { id: 'C', text: 'An index that automatically compresses data' }, { id: 'D', text: 'A clustered index with foreign keys' }],
    correctAnswer: 'B',
    explanation: 'A covering index contains all attributes requested by the query, eliminating expensive table data page lookups (bookmark lookups).',
    tags: ['SQL', 'Optimization', 'Indexing']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In query execution plans, when is a Hash Join preferred over a Nested Loop Join by the query optimizer?',
    options: [{ id: 'A', text: 'When joining two massive datasets without useful indexes on the join columns' }, { id: 'B', text: 'When one table has only 2 rows and the other has an index' }, { id: 'C', text: 'When performing a non-equi join with > operator' }, { id: 'D', text: 'When results must be emitted in sorted order immediately' }],
    correctAnswer: 'A',
    explanation: 'Hash Joins excel for equi-joins between substantial unsorted datasets by building an in-memory hash table on the smaller relation and probing with the larger.',
    tags: ['SQL', 'Execution Plans']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What occurs during a "Phantom Read" anomaly?',
    options: [{ id: 'A', text: 'A transaction reads uncommitted changes that are subsequently rolled back' }, { id: 'B', text: 'A transaction re-reads a row and discovers modified column values committed by another transaction' }, { id: 'C', text: 'A transaction re-executes a range query and discovers newly inserted rows committed by another concurrent transaction' }, { id: 'D', text: 'Two transactions deadlock on an index latch' }],
    correctAnswer: 'C',
    explanation: 'Phantom Reads occur when new records satisfying search criteria appear during subsequent range executions within the same transaction.',
    tags: ['SQL', 'Concurrency']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the purpose of the QUALIFY clause present in modern analytical SQL engines (Snowflake, BigQuery, Teradata)?',
    options: [{ id: 'A', text: 'Filters results based on window function evaluations without requiring an outer wrapper query' }, { id: 'B', text: 'Enforces database column schema types' }, { id: 'C', text: 'Validates cryptographic digital signatures' }, { id: 'D', text: 'Grants database user roles' }],
    correctAnswer: 'A',
    explanation: 'QUALIFY filters directly on window functions (e.g. QUALIFY ROW_NUMBER() OVER (...) = 1) avoiding cumbersome subquery nesting.',
    tags: ['SQL', 'Modern SQL']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the primary trade-off of introducing an excessive number of indexes on an OLTP table?',
    options: [{ id: 'A', text: 'Degrades SELECT query speed' }, { id: 'B', text: 'Substantially slows down INSERT, UPDATE, and DELETE operations due to index tree maintenance' }, { id: 'C', text: 'Corrupts foreign key relationships' }, { id: 'D', text: 'Invalidates database backups' }],
    correctAnswer: 'B',
    explanation: 'Every write operation must update every relevant B-Tree index on the table, generating significant I/O and lock overhead on write-heavy OLTP workloads.',
    tags: ['SQL', 'OLTP', 'Performance']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'How does a Clustered Index physically organize the underlying table data in engines like SQL Server or MySQL InnoDB?',
    options: [{ id: 'A', text: 'Stores pointers in a separate heap table' }, { id: 'B', text: 'Physically sorts and stores the actual table data rows in the leaf nodes of the index' }, { id: 'C', text: 'Stores hash maps in system RAM' }, { id: 'D', text: 'Creates read-only view snapshots' }],
    correctAnswer: 'B',
    explanation: 'A clustered index dictates the physical storage order of the actual table rows at its leaf level, meaning a table can have only one clustered index.',
    tags: ['SQL', 'Storage Engine']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In a recursive CTE, which statement serves as the termination condition to prevent infinite looping?',
    options: [{ id: 'A', text: 'The anchor member' }, { id: 'B', text: 'A WHERE clause inside the recursive member that eventually returns zero rows' }, { id: 'C', text: 'The ORDER BY statement' }, { id: 'D', text: 'A COMMIT keyword' }],
    correctAnswer: 'B',
    explanation: 'A recursive CTE continues iterating until the recursive query member evaluates to an empty result set, bounded by its WHERE clause.',
    tags: ['SQL', 'Recursive CTE']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is Write-Ahead Logging (WAL) designed to guarantee in relational DBMS engines like PostgreSQL and SQLite?',
    options: [{ id: 'A', text: 'Fast SELECT query response times' }, { id: 'B', text: 'Durability and Atomicity by ensuring log records are flushed to non-volatile storage before dirty data pages are written' }, { id: 'C', text: 'Real-time JSON serialization' }, { id: 'D', text: 'Zero database index fragmentation' }],
    correctAnswer: 'B',
    explanation: 'WAL guarantees crash recovery and durability (ACID) by logging modifications to persistent storage prior to flushing modified data pages.',
    tags: ['SQL', 'WAL', 'Durability']
  },
  {
    topic: 'SQL', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which query hint or technique forces a deterministic plan when database statistics are temporarily stale or inaccurate?',
    options: [{ id: 'A', text: 'Index hints (e.g., FORCE INDEX / WITH (INDEX(...)))' }, { id: 'B', text: 'Adding comments to SELECT' }, { id: 'C', text: 'Renaming columns' }, { id: 'D', text: 'Changing user passwords' }],
    correctAnswer: 'A',
    explanation: 'Optimizer hints (such as FORCE INDEX) instruct the database query optimizer to bypass cost estimations and use specified access paths.',
    tags: ['SQL', 'Query Optimization']
  },

  // ===================== OOP EASY (10) =====================
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which of the following is NOT one of the four foundational pillars of Object-Oriented Programming?',
    options: [{ id: 'A', text: 'Encapsulation' }, { id: 'B', text: 'Inheritance' }, { id: 'C', text: 'Compilation' }, { id: 'D', text: 'Polymorphism' }],
    correctAnswer: 'C',
    explanation: 'The four core pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    tags: ['OOP', 'Core Pillars']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the bundling of data and the methods that operate on that data into a single unit called?',
    options: [{ id: 'A', text: 'Polymorphism' }, { id: 'B', text: 'Encapsulation' }, { id: 'C', text: 'Inheritance' }, { id: 'D', text: 'Overloading' }],
    correctAnswer: 'B',
    explanation: 'Encapsulation refers to binding data and methods together within a class while restricting direct access to internal components.',
    tags: ['OOP', 'Encapsulation']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is a special method called automatically when an object of a class is instantiated?',
    options: [{ id: 'A', text: 'Destructor' }, { id: 'B', text: 'Constructor' }, { id: 'C', text: 'Initializer callback' }, { id: 'D', text: 'Static loader' }],
    correctAnswer: 'B',
    explanation: 'A constructor initializes a newly created object and its internal member state upon instantiation.',
    tags: ['OOP', 'Constructor']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which keyword in Java or C++ is used by a subclass to refer to members or constructor of its direct parent class?',
    options: [{ id: 'A', text: 'this' }, { id: 'B', text: 'super / base' }, { id: 'C', text: 'parent' }, { id: 'D', text: 'root' }],
    correctAnswer: 'B',
    explanation: 'The super keyword (or base in C#) allows derived subclasses to access superclass constructors and overridden methods.',
    tags: ['OOP', 'Inheritance']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What access modifier allows class members to be accessed ONLY within the class itself?',
    options: [{ id: 'A', text: 'public' }, { id: 'B', text: 'protected' }, { id: 'C', text: 'private' }, { id: 'D', text: 'default' }],
    correctAnswer: 'C',
    explanation: 'Private members are strictly inaccessible from outside code and derived classes, enforcing internal data hiding.',
    tags: ['OOP', 'Access Modifiers']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is it called when two or more methods in the same class share the same name but possess different parameter signatures?',
    options: [{ id: 'A', text: 'Method Overriding' }, { id: 'B', text: 'Method Overloading' }, { id: 'C', text: 'Method Hiding' }, { id: 'D', text: 'Dynamic Dispatch' }],
    correctAnswer: 'B',
    explanation: 'Method Overloading is compile-time polymorphism where methods share names but differ in parameter count or types.',
    tags: ['OOP', 'Polymorphism']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Can an Abstract Class be instantiated directly using the new keyword?',
    options: [{ id: 'A', text: 'Yes, always' }, { id: 'B', text: 'No, abstract classes cannot be directly instantiated' }, { id: 'C', text: 'Yes, if it has no abstract methods' }, { id: 'D', text: 'Only in static contexts' }],
    correctAnswer: 'B',
    explanation: 'Abstract classes serve as blueprints and incomplete templates; they cannot be instantiated directly without a concrete subclass.',
    tags: ['OOP', 'Abstract Class']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What type of relationship between classes is modeled by Inheritance?',
    options: [{ id: 'A', text: 'HAS-A relationship' }, { id: 'B', text: 'IS-A relationship' }, { id: 'C', text: 'USES-A relationship' }, { id: 'D', text: 'CAN-DO relationship' }],
    correctAnswer: 'B',
    explanation: 'Inheritance models an IS-A relationship (e.g. Dog IS-A Animal), while Composition models a HAS-A relationship.',
    tags: ['OOP', 'Relationships']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which concept refers to displaying only necessary features while hiding background operational details from the caller?',
    options: [{ id: 'A', text: 'Abstraction' }, { id: 'B', text: 'Inheritance' }, { id: 'C', text: 'Garbage Collection' }, { id: 'D', text: 'Coupling' }],
    correctAnswer: 'A',
    explanation: 'Abstraction exposes clean interfaces while masking internal mechanical complexities from consumers.',
    tags: ['OOP', 'Abstraction']
  },
  {
    topic: 'OOP', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What happens to objects in memory when they are no longer reachable by any active reference in managed runtimes (like Java/V8)?',
    options: [{ id: 'A', text: 'They cause immediate kernel memory faults' }, { id: 'B', text: 'They are reclaimed by the Garbage Collector' }, { id: 'C', text: 'They remain permanently in RAM until machine reboot' }, { id: 'D', text: 'They convert into static variables' }],
    correctAnswer: 'B',
    explanation: 'Automatic garbage collectors trace active object graphs and reclaim heap memory occupied by unreachable unreferenced objects.',
    tags: ['OOP', 'Memory Management']
  },

  // ===================== OOP MEDIUM (10) =====================
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which SOLID principle states that high-level modules should not depend on low-level modules, but both should depend on abstractions?',
    options: [{ id: 'A', text: 'Single Responsibility Principle' }, { id: 'B', text: 'Open/Closed Principle' }, { id: 'C', text: 'Interface Segregation Principle' }, { id: 'D', text: 'Dependency Inversion Principle' }],
    correctAnswer: 'D',
    explanation: 'DIP (the D in SOLID) mandates decoupling high-level policy code from low-level detail code through interfaces and abstractions.',
    tags: ['OOP', 'SOLID']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What design pattern defines a one-to-many dependency between objects such that when one changes state, all dependents are notified automatically?',
    options: [{ id: 'A', text: 'Singleton Pattern' }, { id: 'B', text: 'Observer Pattern' }, { id: 'C', text: 'Factory Method' }, { id: 'D', text: 'Decorator Pattern' }],
    correctAnswer: 'B',
    explanation: 'The Observer Pattern (publish-subscribe) decouples subject providers from observer listeners who react to state broadcasts.',
    tags: ['OOP', 'Design Patterns']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Why is Composition generally preferred over Class Inheritance according to modern software architecture (Favor Composition over Inheritance)?',
    options: [{ id: 'A', text: 'Composition executes faster at hardware CPU level' }, { id: 'B', text: 'Composition promotes looser coupling, avoids fragile base class issues, and allows dynamic runtime behavioral swapping' }, { id: 'C', text: 'Composition eliminates the need for unit testing' }, { id: 'D', text: 'Inheritance is deprecated in modern programming languages' }],
    correctAnswer: 'B',
    explanation: 'Composition avoids tight compile-time coupling and deep inheritance hierarchies by assembling behaviors through interfaces.',
    tags: ['OOP', 'Design Principles']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the purpose of the Decorator pattern?',
    options: [{ id: 'A', text: 'Creates families of related or dependent objects' }, { id: 'B', text: 'Attaches additional responsibilities to an object dynamically without modifying its underlying class' }, { id: 'C', text: 'Ensures only one instance of a class exists' }, { id: 'D', text: 'Converts an interface into another expected interface' }],
    correctAnswer: 'B',
    explanation: 'Decorators wrap concrete components to augment their behavior at runtime without sub-classing or altering existing code.',
    tags: ['OOP', 'Design Patterns']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What mechanism facilitates Runtime Polymorphism (dynamic dispatch) under the hood in languages like C++?',
    options: [{ id: 'A', text: 'Global Hash Maps' }, { id: 'B', text: 'Virtual Method Tables (vtable) and virtual pointers (vptr)' }, { id: 'C', text: 'Preprocessor macros' }, { id: 'D', text: 'Direct branch jumps' }],
    correctAnswer: 'B',
    explanation: 'Compilers construct a vtable containing function pointers for virtual methods, dereferenced at runtime via each instance’s vptr.',
    tags: ['OOP', 'Virtual Methods']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the primary objective of the Interface Segregation Principle (ISP)?',
    options: [{ id: 'A', text: 'Clients should not be forced to depend upon interfaces and methods they do not use' }, { id: 'B', text: 'Every class must implement at least two interfaces' }, { id: 'C', text: 'Interfaces should contain private method variables' }, { id: 'D', text: 'Prevent multiple inheritance across all modules' }],
    correctAnswer: 'A',
    explanation: 'ISP argues against bloated fat interfaces, encouraging fine-grained client-specific role interfaces instead.',
    tags: ['OOP', 'SOLID']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which structural design pattern acts as a wrapper to convert the incompatible interface of a legacy service into a modern client interface?',
    options: [{ id: 'A', text: 'Facade' }, { id: 'B', text: 'Adapter' }, { id: 'C', text: 'Proxy' }, { id: 'D', text: 'Bridge' }],
    correctAnswer: 'B',
    explanation: 'The Adapter pattern enables classes with mismatched interfaces to collaborate by converting calls into acceptable signatures.',
    tags: ['OOP', 'Design Patterns']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the difference between Shallow Copy and Deep Copy of an object?',
    options: [{ id: 'A', text: 'Shallow copy duplicates nested objects; Deep copy copies references' }, { id: 'B', text: 'Shallow copy copies references to nested objects; Deep copy recursively clones all referenced objects into independent memory' }, { id: 'C', text: 'There is no difference in garbage collected languages' }, { id: 'D', text: 'Shallow copy operates on disk; Deep copy operates in RAM' }],
    correctAnswer: 'B',
    explanation: 'Shallow copies leave shared mutable sub-objects pointed to the original references; deep copy constructs completely autonomous duplicates.',
    tags: ['OOP', 'Object Copying']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which design pattern is best suited for constructing complex objects step-by-step with various configuration options?',
    options: [{ id: 'A', text: 'Prototype Pattern' }, { id: 'B', text: 'Builder Pattern' }, { id: 'C', text: 'Singleton Pattern' }, { id: 'D', text: 'Command Pattern' }],
    correctAnswer: 'B',
    explanation: 'The Builder pattern separates construction of an intricate object from its representation, providing readable chained fluent configuration.',
    tags: ['OOP', 'Design Patterns']
  },
  {
    topic: 'OOP', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the "Diamond Problem" in Object-Oriented languages that support Multiple Inheritance?',
    options: [{ id: 'A', text: 'Excessive memory allocation caused by static fields' }, { id: 'B', text: 'Ambiguity arising when a class inherits from two parent classes that both inherit from a common base class' }, { id: 'C', text: 'Inability to override private methods' }, { id: 'D', text: 'Circular dependency between package files' }],
    correctAnswer: 'B',
    explanation: 'The Diamond Problem occurs when Class D inherits from B and C, both inheriting from A, creating ambiguity over which superclass method implementation D receives.',
    tags: ['OOP', 'Multiple Inheritance']
  },

  // ===================== OOP HARD (10) =====================
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'According to the Liskov Substitution Principle (LSP), which of the following contract rules must a derived subtype satisfy?',
    options: [{ id: 'A', text: 'Subtype may strengthen preconditions and weaken postconditions' }, { id: 'B', text: 'Preconditions cannot be strengthened in a subtype, and postconditions cannot be weakened' }, { id: 'C', text: 'Subtype must throw broader checked exceptions than supertype' }, { id: 'D', text: 'Subtype must override every private member of base class' }],
    correctAnswer: 'B',
    explanation: 'Under behavioral subtyping (LSP), a subclass can accept wider input (weakened preconditions) and must deliver at least the promised guarantees (strengthened postconditions).',
    tags: ['OOP', 'LSP', 'Type Theory']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What design pattern uses Double-Checked Locking with a volatile variable to guarantee thread-safe lazy initialization in multithreaded environments?',
    options: [{ id: 'A', text: 'Thread-Safe Singleton' }, { id: 'B', text: 'Flyweight' }, { id: 'C', text: 'Memento' }, { id: 'D', text: 'Chain of Responsibility' }],
    correctAnswer: 'A',
    explanation: 'Double-checked locking minimizes synchronization overhead while the volatile qualifier prevents instruction reordering on instance initialization.',
    tags: ['OOP', 'Concurrency', 'Patterns']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which behavioral pattern separates an algorithm from the object structure on which it operates, allowing new operations without modifying classes?',
    options: [{ id: 'A', text: 'Strategy Pattern' }, { id: 'B', text: 'Visitor Pattern' }, { id: 'C', text: 'Template Method' }, { id: 'D', text: 'Mediator' }],
    correctAnswer: 'B',
    explanation: 'The Visitor Pattern employs double-dispatch to execute operations across heterogeneous object structures without editing their element classes.',
    tags: ['OOP', 'Visitor Pattern']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In Domain-Driven Design (DDD), what is the key distinction between an Entity and a Value Object?',
    options: [{ id: 'A', text: 'Entities have explicit identity that persists over time; Value Objects are defined strictly by their immutable attributes' }, { id: 'B', text: 'Entities can never be stored in database tables' }, { id: 'C', text: 'Value objects have unique UUID primary keys' }, { id: 'D', text: 'Entities must be stateless singletons' }],
    correctAnswer: 'A',
    explanation: 'An Entity is tracked by its distinct continuous identity across state changes; a Value Object has no conceptual identity and is immutable.',
    tags: ['OOP', 'DDD']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the purpose of the Flyweight design pattern in high-scale systems?',
    options: [{ id: 'A', text: 'Asynchronously routes messages between services' }, { id: 'B', text: 'Minimizes memory usage by sharing common intrinsic state across a large number of fine-grained objects' }, { id: 'C', text: 'Enforces security firewalls around class methods' }, { id: 'D', text: 'Automates database migration generation' }],
    correctAnswer: 'B',
    explanation: 'Flyweight segregates intrinsic state (shared) from extrinsic state (context-dependent) to handle millions of objects without exhausting RAM.',
    tags: ['OOP', 'Flyweight']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'How does an Inversion of Control (IoC) container resolve circular dependencies between two singleton beans?',
    options: [{ id: 'A', text: 'Immediately terminates application with fatal crash' }, { id: 'B', text: 'Exposes early three-level object cache references (instantiated but not fully populated)' }, { id: 'C', text: 'Converts them to primitive variables' }, { id: 'D', text: 'Duplicates objects indefinitely' }],
    correctAnswer: 'B',
    explanation: 'IoC frameworks (like Spring) utilize a three-level cache that exposes raw instantiated bean references before property injection completes.',
    tags: ['OOP', 'IoC', 'Architecture']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is "Object Slicing" in C++ when passing derived objects by value to a function expecting a base class parameter?',
    options: [{ id: 'A', text: 'Array memory boundary overflow' }, { id: 'B', text: 'The derived portions of the object are stripped off, leaving only the base sub-object copied' }, { id: 'C', text: 'Destructor failure causing memory leaks' }, { id: 'D', text: 'Division of integer properties' }],
    correctAnswer: 'B',
    explanation: 'Passing by value allocates storage only for the base class type, slicing away derived member variables and vtable overrides.',
    tags: ['OOP', 'C++', 'Object Slicing']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What architectural advantage does the Strategy pattern provide over extensive switch/case blocks for business calculations?',
    options: [{ id: 'A', text: 'Satisfies Open/Closed Principle by encapsulating interchangeable algorithms into distinct classes extensible without modifying caller' }, { id: 'B', text: 'Halves CPU instruction cycles' }, { id: 'C', text: 'Eliminates garbage collection pauses' }, { id: 'D', text: 'Compresses source code binaries' }],
    correctAnswer: 'A',
    explanation: 'The Strategy pattern adheres to OCP: new algorithm strategies can be introduced as clean implementations without mutating existing code.',
    tags: ['OOP', 'Strategy Pattern']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In reactive programming and OOP event systems, what is the "Lapsed Listener" problem?',
    options: [{ id: 'A', text: 'Listeners dropping network packets during socket timeouts' }, { id: 'B', text: 'Memory leak caused by an event publisher holding strong references to subscribed listener objects, preventing garbage collection' }, { id: 'C', text: 'Corrupted vtable pointers' }, { id: 'D', text: 'A listener subscribing multiple times' }],
    correctAnswer: 'B',
    explanation: 'When publishers hold strong references to subscribers that should be discarded, the subscribers cannot be GC collected (resolved with WeakReferences).',
    tags: ['OOP', 'Memory Leaks']
  },
  {
    topic: 'OOP', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Which pattern decouples an abstraction from its implementation so that the two can vary independently across multiple dimensions?',
    options: [{ id: 'A', text: 'Bridge Pattern' }, { id: 'B', text: 'Facade Pattern' }, { id: 'C', text: 'Composite Pattern' }, { id: 'D', text: 'Interpreter Pattern' }],
    correctAnswer: 'A',
    explanation: 'The Bridge Pattern replaces orthogonal inheritance hierarchies with composition, allowing abstraction and implementation to evolve autonomously.',
    tags: ['OOP', 'Bridge Pattern']
  },

  // ===================== DBMS EASY (10) =====================
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What does the acronym DBMS stand for?',
    options: [{ id: 'A', text: 'Data Base Management System' }, { id: 'B', text: 'Database Binary Mapping Server' }, { id: 'C', text: 'Digital Backup Management Software' }, { id: 'D', text: 'Data Block Manipulation Standard' }],
    correctAnswer: 'A',
    explanation: 'DBMS stands for Database Management System, software designed to define, manipulate, retrieve, and manage data.',
    tags: ['DBMS', 'Basics']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What does the "A" in ACID database transaction properties represent?',
    options: [{ id: 'A', text: 'Availability' }, { id: 'B', text: 'Atomicity' }, { id: 'C', text: 'Authentication' }, { id: 'D', text: 'Accuracy' }],
    correctAnswer: 'B',
    explanation: 'Atomicity ensures that all operations in a transaction succeed completely or none take effect (All or Nothing).',
    tags: ['DBMS', 'ACID']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'In a Relational Database, what is a single row in a table formally referred to as?',
    options: [{ id: 'A', text: 'Attribute' }, { id: 'B', text: 'Tuple' }, { id: 'C', text: 'Domain' }, { id: 'D', text: 'Schema' }],
    correctAnswer: 'B',
    explanation: 'In formal relational algebra, a row in a relation corresponds to a tuple, while columns correspond to attributes.',
    tags: ['DBMS', 'Relational Model']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which of the following is an example of a NoSQL document database?',
    options: [{ id: 'A', text: 'PostgreSQL' }, { id: 'B', text: 'MongoDB' }, { id: 'C', text: 'MySQL' }, { id: 'D', text: 'Oracle DB' }],
    correctAnswer: 'B',
    explanation: 'MongoDB is a leading document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents.',
    tags: ['DBMS', 'NoSQL']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What key uniquely identifies a record and consists of a candidate key chosen by the database designer?',
    options: [{ id: 'A', text: 'Primary Key' }, { id: 'B', text: 'Foreign Key' }, { id: 'C', text: 'Secondary Key' }, { id: 'D', text: 'Composite Key' }],
    correctAnswer: 'A',
    explanation: 'The Primary Key is the chosen candidate key designated to uniquely and non-nullably identify rows in a table.',
    tags: ['DBMS', 'Keys']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is metadata commonly defined as in a database catalog?',
    options: [{ id: 'A', text: 'Encrypted user passwords' }, { id: 'B', text: 'Data about data (schema definitions, types, constraints)' }, { id: 'C', text: 'Temporary deleted records' }, { id: 'D', text: 'Hardware network packets' }],
    correctAnswer: 'B',
    explanation: 'Metadata is structural descriptive data that defines schemas, tables, constraints, types, and permissions in the catalog.',
    tags: ['DBMS', 'Metadata']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which command undoes all uncommitted transactions during an active database session?',
    options: [{ id: 'A', text: 'COMMIT' }, { id: 'B', text: 'ROLLBACK' }, { id: 'C', text: 'SAVEPOINT' }, { id: 'D', text: 'REVERT' }],
    correctAnswer: 'B',
    explanation: 'ROLLBACK aborts active transaction operations and restores database state to the last consistent commit point.',
    tags: ['DBMS', 'Transactions']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What type of dependency is eliminated to satisfy First Normal Form (1NF)?',
    options: [{ id: 'A', text: 'Multivalued or repeating groups (enforcing atomic values)' }, { id: 'B', text: 'Partial dependencies' }, { id: 'C', text: 'Transitive dependencies' }, { id: 'D', text: 'Foreign key constraints' }],
    correctAnswer: 'A',
    explanation: '1NF requires that each column contains atomic (indivisible) values and that there are no repeating groups or arrays.',
    tags: ['DBMS', 'Normalization']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is a Foreign Key used for in relational database design?',
    options: [{ id: 'A', text: 'Speed up math calculations' }, { id: 'B', text: 'Enforce referential integrity between two related tables' }, { id: 'C', text: 'Encrypt database files' }, { id: 'D', text: 'Create random primary numbers' }],
    correctAnswer: 'B',
    explanation: 'Foreign keys establish relationships and enforce referential integrity between child and parent tables.',
    tags: ['DBMS', 'Integrity']
  },
  {
    topic: 'DBMS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which view level in the Three-Schema ANSI/SPARC architecture is closest to physical disk storage?',
    options: [{ id: 'A', text: 'External Schema' }, { id: 'B', text: 'Conceptual Schema' }, { id: 'C', text: 'Internal (Physical) Schema' }, { id: 'D', text: 'Logical Schema' }],
    correctAnswer: 'C',
    explanation: 'The Internal Schema specifies physical storage structures, data page layouts, compression, and access paths on disk.',
    tags: ['DBMS', 'Architecture']
  },

  // ===================== DBMS MEDIUM (10) =====================
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which normal form addresses and eliminates Transitive Functional Dependencies (X -> Y and Y -> Z where Z is non-prime)?',
    options: [{ id: 'A', text: '1NF' }, { id: 'B', text: '2NF' }, { id: 'C', text: '3NF' }, { id: 'D', text: 'BCNF' }],
    correctAnswer: 'C',
    explanation: 'Third Normal Form (3NF) requires 2NF and mandates that no non-prime attribute is transitively dependent on any candidate key.',
    tags: ['DBMS', '3NF', 'Normalization']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What concurrency control locking protocol guarantees conflict serializability in transactions?',
    options: [{ id: 'A', text: 'Two-Phase Locking (2PL)' }, { id: 'B', text: 'Single-phase lock acquisition' }, { id: 'C', text: 'Optimistic reads only' }, { id: 'D', text: 'Round-robin locking' }],
    correctAnswer: 'A',
    explanation: 'Strict Two-Phase Locking (Growing phase where locks are acquired, Shrinking phase where locks are released) guarantees conflict serializability.',
    tags: ['DBMS', 'Concurrency', '2PL']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is a Deadlock in a database management system?',
    options: [{ id: 'A', text: 'A corrupted database file on physical disk' }, { id: 'B', text: 'A state where two or more transactions are waiting indefinitely for locks held by each other' }, { id: 'C', text: 'A query running longer than 10 minutes' }, { id: 'D', text: 'Exhaustion of primary key integers' }],
    correctAnswer: 'B',
    explanation: 'Deadlock arises from circular wait conditions where Transaction A waits for locks held by B, while B waits for locks held by A.',
    tags: ['DBMS', 'Deadlocks']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In the CAP Theorem for distributed data stores, what does the theorem assert?',
    options: [{ id: 'A', text: 'A distributed system can simultaneously guarantee Consistency, Availability, and Partition Tolerance under all conditions' }, { id: 'B', text: 'In the presence of a network partition (P), a distributed system must trade off between Consistency (C) and Availability (A)' }, { id: 'C', text: 'Computers cannot store more than 1 Petabyte of data' }, { id: 'D', text: 'Performance improves exponentially with node counts' }],
    correctAnswer: 'B',
    explanation: 'Eric Brewers CAP theorem states that distributed networks experiencing partitions must choose between consistency or availability.',
    tags: ['DBMS', 'CAP Theorem', 'Distributed']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the main requirement for a relation to be in Boyce-Codd Normal Form (BCNF)?',
    options: [{ id: 'A', text: 'It must have at least 5 columns' }, { id: 'B', text: 'For every functional dependency X -> Y, X must be a superkey' }, { id: 'C', text: 'All attributes must be foreign keys' }, { id: 'D', text: 'It must not have primary keys' }],
    correctAnswer: 'B',
    explanation: 'BCNF is a stricter variant of 3NF requiring that in every non-trivial functional dependency X -> Y, the determinant X is a superkey.',
    tags: ['DBMS', 'BCNF']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the purpose of Database Checkpointing during transaction processing?',
    options: [{ id: 'A', text: 'Flushes all dirty log and data buffers to disk so recovery after crash does not have to reprocess from the beginning of the log' }, { id: 'B', text: 'Compiles SQL queries into native machine instructions' }, { id: 'C', text: 'Backs up database to tape once daily' }, { id: 'D', text: 'Deletes all completed user accounts' }],
    correctAnswer: 'A',
    explanation: 'Checkpoints limit recovery time by synchronizing modified in-memory pages with disk, defining a safe baseline for recovery replay.',
    tags: ['DBMS', 'Recovery', 'Checkpoints']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which mechanism prevents the "Lost Update" concurrency problem when multiple users attempt to edit the same record concurrently?',
    options: [{ id: 'A', text: 'Pessimistic locking (SELECT FOR UPDATE) or Optimistic locking (version numbers)' }, { id: 'B', text: 'Disabling transaction logs' }, { id: 'C', text: 'Decreasing disk write cache' }, { id: 'D', text: 'Allowing all queries to execute without locks' }],
    correctAnswer: 'A',
    explanation: 'Version checks (optimistic locking) or exclusive row locks (SELECT FOR UPDATE) prevent simultaneous overwrites of conflicting updates.',
    tags: ['DBMS', 'Concurrency Control']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is Database Sharding?',
    options: [{ id: 'A', text: 'Horizontal partitioning of data across multiple autonomous database servers/nodes' }, { id: 'B', text: 'Encrypting table columns with SHA-256' }, { id: 'C', text: 'Creating database views' }, { id: 'D', text: 'Compressing database backup zip files' }],
    correctAnswer: 'A',
    explanation: 'Sharding partitions rows across multiple separate database cluster nodes using a shard key for horizontal scale-out.',
    tags: ['DBMS', 'Sharding', 'Scaling']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In MongoDB, what is the role of the Replica Set primary node?',
    options: [{ id: 'A', text: 'Receives all default write operations and records mutations in its oplog' }, { id: 'B', text: 'Acts strictly as a passive cold backup' }, { id: 'C', text: 'Cannot perform reads under any circumstances' }, { id: 'D', text: 'Generates random shard keys' }],
    correctAnswer: 'A',
    explanation: 'The primary node in a replica set processes all write operations and broadcasts changes to secondaries via the operations log (oplog).',
    tags: ['DBMS', 'MongoDB', 'Replication']
  },
  {
    topic: 'DBMS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is a Phantom Deadlock in distributed database systems?',
    options: [{ id: 'A', text: 'A deadlock that is falsely detected by distributed lock managers due to network latency delays in message propagation' }, { id: 'B', text: 'A hardware controller fault' }, { id: 'C', text: 'A deadlock between CPU registers' }, { id: 'D', text: 'A deadlock in single-threaded databases' }],
    correctAnswer: 'A',
    explanation: 'Phantom deadlocks occur when lag in distributed communication leads lock managers to detect cycles that have already been resolved.',
    tags: ['DBMS', 'Distributed Systems']
  },

  // ===================== DBMS HARD (10) =====================
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is Multi-Version Concurrency Control (MVCC) and why does it improve database throughput?',
    options: [{ id: 'A', text: 'It enforces single-user access' }, { id: 'B', text: 'It maintains multiple historical snapshots of rows so readers do not block writers and writers do not block readers' }, { id: 'C', text: 'It eliminates the need for database storage' }, { id: 'D', text: 'It compresses data rows into multiple zip versions' }],
    correctAnswer: 'B',
    explanation: 'MVCC allows read queries to view a consistent snapshot corresponding to their transaction start timestamp without acquiring blocking read locks.',
    tags: ['DBMS', 'MVCC', 'High Performance']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What algorithm is considered the gold standard for database crash recovery with physiological logging (incorporating Analysis, Redo, and Undo phases)?',
    options: [{ id: 'A', text: 'ARIES (Algorithms for Recovery and Isolation Exploiting Semantics)' }, { id: 'B', text: 'Dijkstras Recovery Method' }, { id: 'C', text: 'Raft Consensus' }, { id: 'D', text: 'Paxos Commit' }],
    correctAnswer: 'A',
    explanation: 'Mohans ARIES algorithm implements fine-grained physiological logging, repeating history during REDO and undoing uncommitted transactions during UNDO.',
    tags: ['DBMS', 'ARIES', 'Recovery']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the fundamental difference between Strict 2PL (S2PL) and Rigorous 2PL (SS2PL)?',
    options: [{ id: 'A', text: 'S2PL holds exclusive locks until end-of-transaction; Rigorous 2PL holds BOTH shared and exclusive locks until end-of-transaction' }, { id: 'B', text: 'S2PL does not use locks at all' }, { id: 'C', text: 'Rigorous 2PL releases all locks immediately after reading' }, { id: 'D', text: 'There is no difference' }],
    correctAnswer: 'A',
    explanation: 'Rigorous 2PL holds all acquired locks (both read and write) until COMMIT or ROLLBACK, guaranteeing strict serializability and preventing cascading aborts.',
    tags: ['DBMS', '2PL', 'Serializability']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In distributed transaction management, why is the Two-Phase Commit (2PC) protocol vulnerable to coordinator crashes during the prepare phase?',
    options: [{ id: 'A', text: 'Participants may remain indefinitely blocked holding locks if the coordinator crashes after they vote YES' }, { id: 'B', text: 'It converts relational tables into NoSQL collections' }, { id: 'C', text: 'It causes immediate data loss across all nodes' }, { id: 'D', text: 'It violates network encryption keys' }],
    correctAnswer: 'A',
    explanation: '2PC is a blocking protocol: if the coordinator dies before issuing COMMIT or ABORT, participating nodes in the prepared state must wait indefinitely.',
    tags: ['DBMS', '2PC', 'Distributed Transactions']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is a Log-Structured Merge-tree (LSM Tree) optimized for in modern storage engines (like RocksDB, Cassandra)?',
    options: [{ id: 'A', text: 'Random read performance on magnetic tape' }, { id: 'B', text: 'Extremely high write throughput by appending mutations sequentially to a MemTable and SSTables on disk' }, { id: 'C', text: 'In-memory graph traversals' }, { id: 'D', text: 'Replacing relational schemas' }],
    correctAnswer: 'B',
    explanation: 'LSM trees convert random writes into sequential disk writes via in-memory memtables flushed to immutable SSTables, vastly outpacing traditional B-Trees on write-heavy loads.',
    tags: ['DBMS', 'LSM Tree', 'Storage Engines']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the Write Amplification Factor (WAF) in database storage engines?',
    options: [{ id: 'A', text: 'The ratio of bytes written to persistent storage versus bytes requested to be written by the application' }, { id: 'B', text: 'The number of simultaneous write queries per second' }, { id: 'C', text: 'The compression ratio of database backups' }, { id: 'D', text: 'The CPU utilization during INSERT queries' }],
    correctAnswer: 'A',
    explanation: 'WAF measures the excess physical disk writes incurred by index updates, page splits, and compaction relative to logical payload size.',
    tags: ['DBMS', 'WAF', 'Storage']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'How does the Paxos or Raft consensus algorithm overcome the blocking limitation of Two-Phase Commit (2PC)?',
    options: [{ id: 'A', text: 'Requires unanimity across all cluster nodes' }, { id: 'B', text: 'Achieves progress as long as a strict majority (quorum) of non-faulty nodes are online and communicative' }, { id: 'C', text: 'Disables network communication completely' }, { id: 'D', text: 'Permits data corruption silently' }],
    correctAnswer: 'B',
    explanation: 'Consensus protocols like Raft/Paxos proceed upon achieving quorum agreement among (N/2 + 1) nodes, surviving minority node outages without blocking.',
    tags: ['DBMS', 'Raft', 'Consensus']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is a "Snapshot Isolation Write Skew" anomaly?',
    options: [{ id: 'A', text: 'Two concurrent transactions read overlapping datasets, make disjoint updates that violate a global integrity constraint, and both commit successfully' }, { id: 'B', text: 'A transaction reads uncommitted changes from another transaction' }, { id: 'C', text: 'A hard disk crash during snapshot backup' }, { id: 'D', text: 'A failure of MongoDB sharding routing' }],
    correctAnswer: 'A',
    explanation: 'Under Snapshot Isolation, transactions modifying separate rows do not trigger first-committer-wins conflicts, allowing global invariant violations (e.g., both doctors on-call leaving simultaneously).',
    tags: ['DBMS', 'Snapshot Isolation', 'Write Skew']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What does Linearizability (Atomic Consistency) guarantee in a distributed storage system?',
    options: [{ id: 'A', text: 'Eventual consistency within 24 hours' }, { id: 'B', text: 'Every read operation returns the result of the most recent write in real-time global wall-clock ordering' }, { id: 'C', text: 'Queries execute in alphabetical order' }, { id: 'D', text: 'Nodes must be located in the same data center' }],
    correctAnswer: 'B',
    explanation: 'Linearizability is the strongest consistency model: operations appear to occur instantaneously at some point between invocation and response relative to global time.',
    tags: ['DBMS', 'Linearizability', 'Distributed']
  },
  {
    topic: 'DBMS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In B+ Tree database indexes, what structural characteristic differentiates them from standard B-Trees?',
    options: [{ id: 'A', text: 'Data pointers/records are stored ONLY in the leaf nodes, which are linked together in a doubly linked list for rapid sequential scans' }, { id: 'B', text: 'All nodes have exactly 2 children' }, { id: 'C', text: 'Leaf nodes cannot be cached in memory' }, { id: 'D', text: 'Keys are hashed instead of compared' }],
    correctAnswer: 'A',
    explanation: 'B+ Trees store data records solely in leaves and connect them sequentially, providing maximum fanout for internal routing nodes and optimal range query scans.',
    tags: ['DBMS', 'B+ Trees', 'Indexing']
  },
];

async function _seedDatabaseCore(standalone = false) {
  try {
    console.log('Seeding Zelis Hiring Platform database...');

    // Clear existing data
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await Question.deleteMany({});
    await CodingQuestion.deleteMany({});
    await CodingSubmission.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentAttempt.deleteMany({});
    await QuestionAttempt.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await SecurityEvent.deleteMany({});

    console.log('Cleared existing collections.');

    // 1. Create Users
    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin',
      title: 'Head of Engineering & Talent Ops',
    });

    const recruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@example.com',
      password: 'Password123!',
      role: 'recruiter',
      title: 'Principal Technical Recruiter',
    });

    const candidateUser = await User.create({
      name: 'Alex Rivera',
      email: 'candidate@example.com',
      password: 'Password123!',
      role: 'candidate',
      title: 'Full Stack & Distributed Systems Engineer',
    });

    // Create Candidate Profile for Alex
    await CandidateProfile.create({
      user: candidateUser._id,
      headline: 'Passionate Problem Solver | MERN, Distributed Systems & Algorithms',
      bio: 'B.S. in Computer Science with 3+ years experience building scalable backend architectures, RESTful APIs, and responsive React applications. Strong algorithmic background.',
      phone: '+1 (555) 234-5678',
      location: 'Boston, MA (Open to Remote / Hybrid)',
      college: 'Massachusetts Institute of Technology (MIT)',
      degree: 'B.S. in Computer Science',
      graduationYear: 2024,
      resumeUrl: 'https://zelis-assets.s3.amazonaws.com/resumes/alex-rivera-cv.pdf',
      resumeText: 'Alex Rivera - Senior Software Engineer candidate with expertise in DSA, React, Node.js, Express, MongoDB, and System Design.',
      yearsOfExperience: 3,
      skills: ['DSA', 'SQL', 'OOP', 'DBMS', 'Node.js', 'React', 'MongoDB', 'System Design'],
      githubUrl: 'https://github.com/alexrivera-zelis',
      linkedinUrl: 'https://linkedin.com/in/alexrivera-tech',
      education: [
        {
          institution: 'Massachusetts Institute of Technology (MIT)',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science & Engineering',
          graduationYear: 2024,
        },
      ],
    });

    // Create secondary candidates for rich recruitment pipeline demonstration
    const candidate2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      password: 'Password123!',
      role: 'candidate',
      title: 'Backend Systems Engineer',
    });
    await CandidateProfile.create({
      user: candidate2._id,
      headline: 'Backend Engineer | Go, Python, SQL & Cloud Systems',
      phone: '+1 (555) 876-5432',
      location: 'New York, NY',
      college: 'Cornell University',
      degree: 'B.S. in Computer Engineering',
      graduationYear: 2023,
      yearsOfExperience: 4,
      skills: ['SQL', 'DBMS', 'OS', 'Go', 'Python', 'PostgreSQL', 'Docker'],
    });

    const candidate3 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: 'Password123!',
      role: 'candidate',
      title: 'Senior Frontend & Algorithms Engineer',
    });
    await CandidateProfile.create({
      user: candidate3._id,
      headline: 'Senior Engineer | TypeScript, React, DSA & UI Architecture',
      phone: '+1 (555) 345-6789',
      location: 'San Jose, CA',
      college: 'UC Berkeley',
      degree: 'M.S. in Software Engineering',
      graduationYear: 2022,
      yearsOfExperience: 5,
      skills: ['DSA', 'OOP', 'Computer Networks', 'TypeScript', 'React', 'Algorithms'],
    });

    console.log('✓ Created users and profiles.');

    // 2. Insert 180 Comprehensive MCQs (DSA, SQL, OOP, DBMS, OS, Computer Networks)
    const allQuestions = [...questionsData, ...osAndNetworksQuestions];
    console.log(`Seeding ${allQuestions.length} technical MCQs across 6 core pillars into Question Bank...`);
    const preparedQuestions = allQuestions.map((q) => ({
      ...q,
      createdBy: recruiterUser._id,
    }));
    const insertedQuestions = await Question.insertMany(preparedQuestions);
    console.log(`✓ Inserted ${insertedQuestions.length} MCQs across DSA, SQL, OOP, DBMS, OS, and Computer Networks!`);

    // 3. Insert 15 Production Coding Problems (5 Easy, 5 Medium, 5 Hard)
    console.log(`Seeding ${codingQuestionsData.length} production coding problems...`);
    const preparedCoding = codingQuestionsData.map((cq) => ({
      ...cq,
      createdBy: recruiterUser._id,
    }));
    const insertedCoding = await CodingQuestion.insertMany(preparedCoding);
    console.log(`✓ Inserted ${insertedCoding.length} Coding Problems across Easy, Medium, and Hard!`);

    // 4. Create Default Assessments with Sections & Coding
    console.log('Creating default enterprise assessments...');
    const technicalAssessment = await Assessment.create({
      title: 'Zelis Enterprise Adaptive Assessment',
      description: 'Production adaptive hiring ecosystem measuring algorithmic logic, database architecture, systems design, object design, and live sandboxed coding execution. Adapts dynamically to candidate responses.',
      role: 'Full Stack Software Engineer',
      experienceLevel: 'Fresher to Mid-Level',
      duration: 60, // 60 minutes
      topics: ['DSA', 'SQL', 'OOP', 'DBMS', 'OS', 'Computer Networks'],
      questionCount: 15,
      passingScore: 65,
      negativeMarking: false,
      proctoringLevel: 'strict',
      codingRequired: true,
      allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
      sections: [
        {
          title: 'Section 1: Data Structures & Algorithms',
          topic: 'DSA',
          type: 'mcq',
          questionCount: 5,
          marks: 10,
          cutoffPercentage: 60,
          durationMinutes: 15,
        },
        {
          title: 'Section 2: Database Systems & SQL',
          topic: 'SQL',
          type: 'sql',
          questionCount: 4,
          marks: 8,
          cutoffPercentage: 60,
          durationMinutes: 12,
        },
        {
          title: 'Section 3: Operating Systems & Networks',
          topic: 'OS',
          type: 'mcq',
          questionCount: 4,
          marks: 8,
          cutoffPercentage: 60,
          durationMinutes: 12,
        },
        {
          title: 'Section 4: Live Algorithmic Coding',
          topic: 'Algorithms',
          type: 'coding',
          questionCount: 2,
          marks: 30,
          cutoffPercentage: 70,
          durationMinutes: 21,
        },
      ],
      difficultyConfig: {
        startDifficulty: 'easy',
        consecutiveFailuresToDowngrade: 2,
        marks: { easy: 1, medium: 2, hard: 3 },
      },
      difficultyDistribution: {
        easy: 35,
        medium: 45,
        hard: 20,
      },
      createdBy: recruiterUser._id,
      status: 'published',
    });

    const systemsAssessment = await Assessment.create({
      title: 'Systems & Cloud Architecture Assessment',
      description: 'Comprehensive evaluation for backend and cloud systems engineering roles emphasizing OS concurrency, networking, high-scale database internals, and performance optimization.',
      role: 'Backend Systems Engineer',
      experienceLevel: 'Mid to Senior',
      duration: 60,
      topics: ['DBMS', 'SQL', 'OS', 'Computer Networks'],
      questionCount: 15,
      passingScore: 70,
      negativeMarking: false,
      proctoringLevel: 'strict',
      codingRequired: true,
      allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
      difficultyConfig: {
        startDifficulty: 'easy',
        consecutiveFailuresToDowngrade: 2,
        marks: { easy: 1, medium: 2, hard: 3 },
      },
      createdBy: recruiterUser._id,
      status: 'published',
    });

    // 5. Create Seed Applications & Past Attempts for Demonstration
    console.log('Creating sample candidate assessment attempts, interviews, and pipeline records...');

    // Attempt for Marcus Vance (High Scorer - 88%)
    const attemptMarcus = await AssessmentAttempt.create({
      candidate: candidate2._id,
      assessment: technicalAssessment._id,
      startedAt: new Date(Date.now() - 3600000 * 24 * 2),
      submittedAt: new Date(Date.now() - 3600000 * 24 * 2 + 1800000),
      currentDifficulty: 'hard',
      failureCount: 0,
      totalScore: 28,
      maxPossibleScore: 32,
      percentage: 88,
      accuracy: 87,
      highestDifficulty: 'hard',
      questionsAttemptedCount: 15,
      totalQuestions: 15,
      status: 'completed',
      codingScore: 20,
      maxCodingScore: 20,
      codingProblemsSolved: 1,
      codingProblemsAttempted: 1,
      languagesUsed: ['python'],
      tabSwitchCount: 1,
      fullscreenExitCount: 1,
      suspiciousEvents: [
        {
          type: 'tab-hidden',
          severity: 'medium',
          details: 'Candidate switched tabs during section 2',
          timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 600000),
        },
        {
          type: 'fullscreen-exit',
          severity: 'medium',
          details: 'Candidate temporarily exited fullscreen mode',
          timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 1200000),
        },
      ],
      skillAnalysis: [
        { topic: 'SQL', attempted: 5, correct: 5, accuracy: 100 },
        { topic: 'DBMS', attempted: 4, correct: 4, accuracy: 100 },
        { topic: 'OS', attempted: 3, correct: 3, accuracy: 100 },
        { topic: 'DSA', attempted: 4, correct: 3, accuracy: 75 },
        { topic: 'OOP', attempted: 2, correct: 1, accuracy: 50 },
      ],
      difficultyHistory: [
        { questionNumber: 1, difficulty: 'easy', result: 'correct', score: 1, topic: 'DSA', timeTaken: 25 },
        { questionNumber: 2, difficulty: 'medium', result: 'correct', score: 2, topic: 'SQL', timeTaken: 40 },
        { questionNumber: 3, difficulty: 'hard', result: 'correct', score: 3, topic: 'DBMS', timeTaken: 65 },
        { questionNumber: 4, difficulty: 'hard', result: 'correct', score: 3, topic: 'SQL', timeTaken: 55 },
        { questionNumber: 5, difficulty: 'hard', result: 'wrong', score: 0, topic: 'DSA', timeTaken: 70 },
        { questionNumber: 6, difficulty: 'hard', result: 'wrong', score: 0, topic: 'OOP', timeTaken: 60 },
        { questionNumber: 7, difficulty: 'medium', result: 'correct', score: 2, topic: 'DBMS', timeTaken: 35 },
        { questionNumber: 8, difficulty: 'hard', result: 'correct', score: 3, topic: 'SQL', timeTaken: 48 },
      ],
    });

    // Record Security Events for Marcus
    await SecurityEvent.create([
      {
        candidate: candidate2._id,
        attempt: attemptMarcus._id,
        eventType: 'tab-hidden',
        severity: 'medium',
        details: 'Candidate switched browser tabs during section 2',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 600000),
      },
      {
        candidate: candidate2._id,
        attempt: attemptMarcus._id,
        eventType: 'fullscreen-exit',
        severity: 'medium',
        details: 'Candidate temporarily exited fullscreen secure mode',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 1200000),
      },
    ]);

    // Record Coding Submission for Marcus
    await CodingSubmission.create({
      candidate: candidate2._id,
      attempt: attemptMarcus._id,
      codingQuestion: insertedCoding[0]._id,
      language: 'python',
      code: 'def solution(input_data):\n    nums = input_data["nums"]\n    target = input_data["target"]\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []\n',
      status: 'Accepted',
      sampleTestsPassed: 2,
      totalSampleTests: 2,
      hiddenTestsPassed: 3,
      totalHiddenTests: 3,
      score: 10,
      maxScore: 10,
      executionTimeMs: 45,
      memoryKb: 12400,
    });

    const applicationMarcus = await Application.create({
      candidate: candidate2._id,
      assessment: technicalAssessment._id,
      latestAttempt: attemptMarcus._id,
      jobTitle: 'Senior Systems Engineer',
      company: 'Zelis Healthcare',
      status: 'L2 Interview',
      assessmentScore: 88,
      accuracy: 87,
      highestDifficulty: 'hard',
      recommendation: 'Strong Hire',
      notes: 'Outstanding grasp of SQL window framing, DBMS recovery, and OS concurrency.',
      statusHistory: [
        { status: 'Applied', changedAt: new Date(Date.now() - 3600000 * 24 * 5), note: 'Direct application via portal' },
        { status: 'Assessment', changedAt: new Date(Date.now() - 3600000 * 24 * 2), note: 'Completed adaptive assessment with 88% score' },
        { status: 'Shortlisted', changedAt: new Date(Date.now() - 3600000 * 24 * 1), note: 'Recruiter shortlisted candidate' },
        { status: 'L1 Interview', changedAt: new Date(Date.now() - 3600000 * 12), note: 'L1 Technical screening passed with score 88' },
        { status: 'L2 Interview', changedAt: new Date(), note: 'Advanced to L2 Systems Architecture round' },
      ],
    });

    // Schedule L1 and L2 interviews for Marcus
    await Interview.create([
      {
        candidate: candidate2._id,
        application: applicationMarcus._id,
        round: 'L1',
        interviewer: 'David Miller (Staff Engineer)',
        date: '2026-10-04',
        time: '14:00 EST',
        status: 'Completed',
        rating: 4.5,
        technicalScore: 88,
        communicationScore: 85,
        recommendation: 'Strong Hire',
        notes: 'Deep understanding of distributed systems, Go concurrency, and database indexing.',
        scheduledBy: recruiterUser._id,
      },
      {
        candidate: candidate2._id,
        application: applicationMarcus._id,
        round: 'L2',
        interviewer: 'Evelyn Reed (VP of Architecture)',
        date: '2026-10-08',
        time: '11:00 EST',
        status: 'Scheduled',
        rating: 0,
        technicalScore: 0,
        communicationScore: 0,
        recommendation: 'Pending',
        notes: 'Final system design and scalability evaluation.',
        scheduledBy: recruiterUser._id,
      },
    ]);

    // Attempt for Priya Sharma (Strong Scorer - 94%)
    const attemptPriya = await AssessmentAttempt.create({
      candidate: candidate3._id,
      assessment: technicalAssessment._id,
      startedAt: new Date(Date.now() - 3600000 * 24 * 3),
      submittedAt: new Date(Date.now() - 3600000 * 24 * 3 + 1500000),
      currentDifficulty: 'hard',
      failureCount: 0,
      totalScore: 31,
      maxPossibleScore: 33,
      percentage: 94,
      accuracy: 93,
      highestDifficulty: 'hard',
      questionsAttemptedCount: 15,
      totalQuestions: 15,
      status: 'completed',
      codingScore: 20,
      maxCodingScore: 20,
      codingProblemsSolved: 1,
      codingProblemsAttempted: 1,
      languagesUsed: ['javascript'],
      tabSwitchCount: 0,
      fullscreenExitCount: 0,
      suspiciousEvents: [],
      skillAnalysis: [
        { topic: 'DSA', attempted: 6, correct: 6, accuracy: 100 },
        { topic: 'OOP', attempted: 4, correct: 4, accuracy: 100 },
        { topic: 'SQL', attempted: 3, correct: 3, accuracy: 100 },
        { topic: 'Computer Networks', attempted: 3, correct: 3, accuracy: 100 },
        { topic: 'DBMS', attempted: 2, correct: 1, accuracy: 50 },
      ],
      difficultyHistory: [
        { questionNumber: 1, difficulty: 'easy', result: 'correct', score: 1, topic: 'DSA', timeTaken: 20 },
        { questionNumber: 2, difficulty: 'medium', result: 'correct', score: 2, topic: 'OOP', timeTaken: 30 },
        { questionNumber: 3, difficulty: 'hard', result: 'correct', score: 3, topic: 'DSA', timeTaken: 45 },
        { questionNumber: 4, difficulty: 'hard', result: 'correct', score: 3, topic: 'OOP', timeTaken: 50 },
        { questionNumber: 5, difficulty: 'hard', result: 'correct', score: 3, topic: 'SQL', timeTaken: 40 },
        { questionNumber: 6, difficulty: 'hard', result: 'correct', score: 3, topic: 'DSA', timeTaken: 60 },
      ],
    });

    const applicationPriya = await Application.create({
      candidate: candidate3._id,
      assessment: technicalAssessment._id,
      latestAttempt: attemptPriya._id,
      jobTitle: 'Lead Software Engineer',
      company: 'Zelis Healthcare',
      status: 'Offer',
      assessmentScore: 94,
      accuracy: 93,
      highestDifficulty: 'hard',
      recommendation: 'Strong Hire',
      notes: 'Flawless algorithmic demonstration. Fast problem solving and pristine code structure.',
      statusHistory: [
        { status: 'Applied', changedAt: new Date(Date.now() - 3600000 * 24 * 7), note: 'Applied via campus outreach' },
        { status: 'Assessment', changedAt: new Date(Date.now() - 3600000 * 24 * 3), note: 'Completed test with 94% score' },
        { status: 'Shortlisted', changedAt: new Date(Date.now() - 3600000 * 24 * 2), note: 'Ranked #1 on Leaderboard' },
        { status: 'L1 Interview', changedAt: new Date(Date.now() - 3600000 * 24 * 1), note: 'L1 Cleared with rave reviews' },
        { status: 'L2 Interview', changedAt: new Date(Date.now() - 3600000 * 10), note: 'L2 System Design Cleared' },
        { status: 'Selected', changedAt: new Date(Date.now() - 3600000 * 4), note: 'Hiring committee approved' },
        { status: 'Offer', changedAt: new Date(), note: 'Formal offer extended' },
      ],
    });

    // Schedule L1 and L2 interviews for Priya
    await Interview.create([
      {
        candidate: candidate3._id,
        application: applicationPriya._id,
        round: 'L1',
        interviewer: 'Michael Ross (Engineering Lead)',
        date: '2026-10-02',
        time: '10:00 EST',
        status: 'Completed',
        rating: 5,
        technicalScore: 96,
        communicationScore: 95,
        recommendation: 'Strong Hire',
        notes: 'Top 1% technical candidate. Clean explanation of trade-offs and complexity.',
        scheduledBy: recruiterUser._id,
      },
      {
        candidate: candidate3._id,
        application: applicationPriya._id,
        round: 'L2',
        interviewer: 'Rachel Adams (Director of Engineering)',
        date: '2026-10-03',
        time: '15:00 EST',
        status: 'Completed',
        rating: 5,
        technicalScore: 95,
        communicationScore: 92,
        recommendation: 'Strong Hire',
        notes: 'Outstanding technical and behavioral fit. Unanimous offer recommendation.',
        scheduledBy: recruiterUser._id,
      },
    ]);

    // Create Initial Application for Alex Rivera so Candidate Dashboard and Assessment start works seamlessly
    await Application.create({
      candidate: candidateUser._id,
      assessment: technicalAssessment._id,
      jobTitle: 'Software Development Engineer (Full Stack)',
      company: 'Zelis Healthcare',
      status: 'Applied',
      assessmentScore: 0,
      accuracy: 0,
      highestDifficulty: 'easy',
      recommendation: 'Under Review',
      notes: 'Profile registered. Ready to begin monitored adaptive assessment.',
      statusHistory: [
        { status: 'Applied', changedAt: new Date(), note: 'Profile registered and ready for assessment' },
      ],
    });

    console.log('========================================================');
    console.log('✓ Database seeded successfully!');
    console.log('Demo Credentials:');
    console.log('  Candidate: candidate@example.com / Password123!');
    console.log('  Recruiter: recruiter@example.com / Password123!');
    console.log('  Admin:     admin@example.com     / Password123!');
    console.log('========================================================');

    // Only disconnect and exit when running as a standalone script
    if (standalone) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding error:', error);
    if (standalone) process.exit(1);
    else throw error;
  }
}

async function seedDatabase(standalone = false) {
  // This is a wrapper that decides connection behaviour
  // The real work is in _seedDatabaseCore
  return _seedDatabaseCore(standalone);
}

if (require.main === module) {
  connectDB().then(() => _seedDatabaseCore(true));
}

module.exports = { seedDatabase };
