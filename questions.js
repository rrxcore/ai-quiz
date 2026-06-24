const QUIZ_DATA = [
  {
    "id": 1,
    "group": "Introduction and Intelligent Agents",
    "question": "Define Artificial Intelligence in terms of Thinking Humanly.",
    "answer": "AI is the study of making machines think like humans using cognitive processes."
  },
  {
    "id": 2,
    "group": "Introduction and Intelligent Agents",
    "question": "Differentiate natural Intelligence from Artificial Intelligence.",
    "answer": "Natural intelligence is biological human/animal intelligence; AI is machine-made intelligence."
  },
  {
    "id": 3,
    "group": "Introduction and Intelligent Agents",
    "question": "What is an agent in AI?",
    "answer": "An entity that perceives its environment and acts on it."
  },
  {
    "id": 4,
    "group": "Introduction and Intelligent Agents",
    "question": "Define a Rational Agent in AI.",
    "answer": "An agent that chooses the best action to maximize performance."
  },
  {
    "id": 5,
    "group": "Introduction and Intelligent Agents",
    "question": "What is perception in the context of AI agents?",
    "answer": "The process by which an agent receives information from the environment."
  },
  {
    "id": 6,
    "group": "Introduction and Intelligent Agents",
    "question": "What are the features of a reflex-based agent?",
    "answer": "Uses condition-action rules and acts only on current percepts."
  },
  {
    "id": 7,
    "group": "Introduction and Intelligent Agents",
    "question": "In case a machine can change its course of action based on the external environment without any external help, what is that machine called?",
    "answer": "Autonomous agent/machine."
  },
  {
    "id": 8,
    "group": "Introduction and Intelligent Agents",
    "question": "Knowledge-based agents are composed of two main parts. What are they?",
    "answer": "Knowledge base and Inference engine."
  },
  {
    "id": 9,
    "group": "Introduction and Intelligent Agents",
    "question": "Discuss the various types of agents in AI with examples.",
    "answer": "Types of agents: Simple reflex, model-based, goal-based, utility-based, and learning agents."
  },
  {
    "id": 10,
    "group": "Introduction and Intelligent Agents",
    "question": "What is intelligence?",
    "answer": "Ability to learn, reason, solve problems, and adapt."
  },
  {
    "id": 11,
    "group": "Search Algorithms and Optimization",
    "question": "State the A* Algorithm in AI.",
    "answer": "Selects the node with minimum f(n) = g(n) + h(n)."
  },
  {
    "id": 12,
    "group": "Search Algorithms and Optimization",
    "question": "An algorithm is admissible if it never overestimates the cost of reaching the goal.",
    "answer": "An admissible algorithm/heuristic never overestimates the cost to reach the goal."
  },
  {
    "id": 13,
    "group": "Search Algorithms and Optimization",
    "question": "What is Breadth-First Search in problem-solving? When is it optimal?",
    "answer": "Explores nodes level by level; optimal when all step costs are equal."
  },
  {
    "id": 14,
    "group": "Search Algorithms and Optimization",
    "question": "Which search is implemented with an empty first-in-first-out (FIFO) queue?",
    "answer": "Breadth-First Search."
  },
  {
    "id": 15,
    "group": "Search Algorithms and Optimization",
    "question": "Which search algorithm requires less memory?",
    "answer": "Depth-First Search requires less memory."
  },
  {
    "id": 16,
    "group": "Search Algorithms and Optimization",
    "question": "Are Uninformed and Blind search the same? Is Iterative Deepening search a Blind search?",
    "answer": "Yes, uninformed and blind search are the same. Iterative deepening is also blind search."
  },
  {
    "id": 17,
    "group": "Search Algorithms and Optimization",
    "question": "Discuss the different types of Problem-Solving strategies in AI.",
    "answer": "Problem-solving strategies: Uninformed search, informed search, local search, adversarial search, and CSP."
  },
  {
    "id": 18,
    "group": "Search Algorithms and Optimization",
    "question": "The first and most simple step in problem-solving is: (a) Goal Formulation (b) Problem Formulation (c) Path Costing (d) None of the above.",
    "answer": "(a) Goal Formulation."
  },
  {
    "id": 19,
    "group": "Search Algorithms and Optimization",
    "question": "The process of removing details from a given state representation is called what?",
    "answer": "Abstraction."
  },
  {
    "id": 20,
    "group": "Search Algorithms and Optimization",
    "question": "The problem-solving agent with several immediate options of unknown value can decide what to do by just examining different possible sequences of actions that lead to states of known value, and then choosing the best sequence. This process is called Search.",
    "answer": "Search."
  },
  {
    "id": 21,
    "group": "Search Algorithms and Optimization",
    "question": "Describe Hill Climbing Search.",
    "answer": "A local search that moves to a better neighboring state until no improvement is possible."
  },
  {
    "id": 22,
    "group": "Search Algorithms and Optimization",
    "question": "Define Plateau or flat local maximum in the State Space Diagram.",
    "answer": "A flat region where neighboring states have the same value."
  },
  {
    "id": 23,
    "group": "Search Algorithms and Optimization",
    "question": "What do you understand by a Shoulder in the State Space Diagram?",
    "answer": "A plateau with an upward path available after sideways movement."
  },
  {
    "id": 24,
    "group": "Search Algorithms and Optimization",
    "question": "What do you mean by simulated annealing in AI?",
    "answer": "A search method that sometimes accepts worse moves to escape local maxima."
  },
  {
    "id": 25,
    "group": "Search Algorithms and Optimization",
    "question": "What is the goal of Alpha-Beta pruning?",
    "answer": "To remove branches that cannot affect the final minimax decision."
  },
  {
    "id": 26,
    "group": "Search Algorithms and Optimization",
    "question": "Which form is called a conjunction of disjunction of literals?",
    "answer": "Conjunctive Normal Form, CNF."
  },
  {
    "id": 27,
    "group": "Search Algorithms and Optimization",
    "question": "Which one is used for utility functions in game-playing algorithms?",
    "answer": "Minimax algorithm uses utility/evaluation functions."
  },
  {
    "id": 28,
    "group": "Search Algorithms and Optimization",
    "question": "What is the heuristic function of greedy best-first search?",
    "answer": "h(n), estimated cost or distance from node to goal."
  },
  {
    "id": 29,
    "group": "Search Algorithms and Optimization",
    "question": "In what type of problems are heuristic search strategies particularly useful?",
    "answer": "Heuristic search is useful in large or complex search spaces."
  },
  {
    "id": 30,
    "group": "Search Algorithms and Optimization",
    "question": "Which heuristic search strategy is particularly useful for problems where the goal state is not welldefined?",
    "answer": "Hill Climbing Search."
  },
  {
    "id": 31,
    "group": "Search Algorithms and Optimization",
    "question": "What are Constraint Satisfaction Problems (CSP)?",
    "answer": "Problems defined by variables, domains, and constraints."
  },
  {
    "id": 32,
    "group": "Search Algorithms and Optimization",
    "question": "What are the two characteristics of heuristic knowledge?",
    "answer": "Heuristic knowledge is problem-specific and approximate/rule-of-thumb."
  },
  {
    "id": 33,
    "group": "Search Algorithms and Optimization",
    "question": "What do you mean by AO* search?",
    "answer": "A heuristic search algorithm for AND-OR graphs."
  },
  {
    "id": 34,
    "group": "Knowledge Representation and Logic",
    "question": "What do you mean by knowledge representation? List the four ways of knowledge representation.",
    "answer": "A way to store knowledge so machines can reason. Four methods: logic, semantic networks, frames, and production rules."
  },
  {
    "id": 35,
    "group": "Knowledge Representation and Logic",
    "question": "What are the approaches to knowledge representation? How are knowledges correctly represented in AI?",
    "answer": "Approaches: Simple relational, inheritable, inferential, and procedural knowledge. Knowledge is correctly represented using clear syntax, semantics, consistency, and inference."
  },
  {
    "id": 36,
    "group": "Knowledge Representation and Logic",
    "question": "Define a knowledge base.",
    "answer": "A collection of facts and rules about a domain."
  },
  {
    "id": 37,
    "group": "Knowledge Representation and Logic",
    "question": "Define Syntax and Semantics. Why is Semantics used in propositional logic?",
    "answer": "Syntax: Rules for forming valid sentences. Semantics: Meaning of sentences. Semantics is used to determine truth."
  },
  {
    "id": 38,
    "group": "Knowledge Representation and Logic",
    "question": "What is Tautology in Propositional logic?",
    "answer": "A statement that is always true."
  },
  {
    "id": 39,
    "group": "Knowledge Representation and Logic",
    "question": "What is Modus Ponens in Propositional logic?",
    "answer": "From P and P → Q, infer Q."
  },
  {
    "id": 40,
    "group": "Knowledge Representation and Logic",
    "question": "Resolution is also called a single inference rule.",
    "answer": "Resolution is a single inference rule."
  },
  {
    "id": 41,
    "group": "Knowledge Representation and Logic",
    "question": "What is the negation of the CNF expression: (p OR q) AND (r OR s)?",
    "answer": "Negation: (¬p AND ¬q) OR (¬r AND ¬s)."
  },
  {
    "id": 42,
    "group": "Knowledge Representation and Logic",
    "question": "What do you understand by FOL (First-Order Logic)?",
    "answer": "Logic that uses objects, predicates, functions, and quantifiers."
  },
  {
    "id": 43,
    "group": "Knowledge Representation and Logic",
    "question": "List the quantifiers in First-Order Logic.",
    "answer": "Universal quantifier ∀ and Existential quantifier ∃."
  },
  {
    "id": 44,
    "group": "Knowledge Representation and Logic",
    "question": "What is the negation of the statement \"for all x, P(x)\" in predicate logic?",
    "answer": "∃x ¬P(x)."
  },
  {
    "id": 45,
    "group": "Knowledge Representation and Logic",
    "question": "Convert into 1st-order predicate logic: \"Mary loves everyone\" (assuming the domain includes both humans and non-humans).",
    "answer": "∀x Loves(Mary, x)"
  },
  {
    "id": 46,
    "group": "Knowledge Representation and Logic",
    "question": "What is a frame in knowledge representation?",
    "answer": "A structure with slots and values used to represent knowledge."
  },
  {
    "id": 47,
    "group": "Knowledge Representation and Logic",
    "question": "What is used to compute the truth of any sentence?",
    "answer": "A model/interpretation is used to compute truth."
  },
  {
    "id": 48,
    "group": "Knowledge Representation and Logic",
    "question": "What is the purpose of reasoning in AI?",
    "answer": "To derive new conclusions from known facts."
  },
  {
    "id": 49,
    "group": "Uncertainty and Fuzzy Logic",
    "question": "What does a Bayesian network provide?",
    "answer": "A graphical representation of probabilistic relationships."
  },
  {
    "id": 50,
    "group": "Uncertainty and Fuzzy Logic",
    "question": "How can the compactness of a Bayesian network be described?",
    "answer": "Its compactness comes from conditional independence."
  },
  {
    "id": 51,
    "group": "Uncertainty and Fuzzy Logic",
    "question": "An event in probability that will never happen is called what?",
    "answer": "Impossible event."
  },
  {
    "id": 52,
    "group": "Uncertainty and Fuzzy Logic",
    "question": "What is fuzzy logic?",
    "answer": "Logic that allows degrees of truth between 0 and 1."
  },
  {
    "id": 53,
    "group": "Uncertainty and Fuzzy Logic",
    "question": "What is the difference between a Crisp set and a Fuzzy set?",
    "answer": "Crisp set: Membership is 0 or 1. Fuzzy set: Membership can be between 0 and 1."
  },
  {
    "id": 54,
    "group": "Expert Systems and Machine Learning",
    "question": "Name two Tools used to develop expert systems.",
    "answer": "CLIPS and PROLOG."
  },
  {
    "id": 55,
    "group": "Expert Systems and Machine Learning",
    "question": "List two real-world applications of expert systems.",
    "answer": "Medical diagnosis and fault diagnosis."
  },
  {
    "id": 56,
    "group": "Expert Systems and Machine Learning",
    "question": "What is the relationship between AI and ML?",
    "answer": "Machine Learning is a subset of AI."
  },
  {
    "id": 57,
    "group": "Expert Systems and Machine Learning",
    "question": "State the differences between Supervised and Unsupervised learning.",
    "answer": "Supervised learning: Uses labeled data. Unsupervised learning: Uses unlabeled data."
  },
  {
    "id": 58,
    "group": "Expert Systems and Machine Learning",
    "question": "Explain Hypotheses space with an example.",
    "answer": "Hypothesis space: Set of all possible hypotheses/models. Example: all possible rules for classifying emails as spam or not spam."
  },
  {
    "id": 59,
    "group": "Expert Systems and Machine Learning",
    "question": "Factors which affect the performance of a learner system do not include: [List of factors].",
    "answer": "The options are missing, so the exact MCQ answer cannot be selected. Common factors include training data, algorithm, features, noise, and representation."
  },
  {
    "id": 60,
    "group": "Expert Systems and Machine Learning",
    "question": "Define Explanation-based learning.",
    "answer": "Learning by explaining examples using prior knowledge and generalizing them."
  },
  {
    "id": 61,
    "group": "Expert Systems and Machine Learning",
    "question": "A production system consists of how many data type predicates? (a) One (b) Two (c) Three (d) Four.",
    "answer": "(c) Three — rules, working memory/database, and control strategy."
  },
  {
    "id": 62,
    "group": "Expert Systems and Machine Learning",
    "question": "What is Relevance-based Learning (RBL) in AI?",
    "answer": "Learning that uses prior knowledge to identify relevant features or examples."
  },
  {
    "id": 63,
    "group": "Expert Systems and Machine Learning",
    "question": "Face Recognition systems are based on which type of approach?",
    "answer": "Pattern recognition approach."
  },
  {
    "id": 64,
    "group": "Expert Systems and Machine Learning",
    "question": "A rule-based system makes decisions based on: A. set of constructs B. set of predefined rules C. set of clauses.",
    "answer": "B. Set of predefined rules."
  },
  {
    "id": 65,
    "group": "Natural Language Processing (NLP)",
    "question": "List the two types of Parsing.",
    "answer": "Top-down parsing and Bottom-up parsing."
  },
  {
    "id": 66,
    "group": "Natural Language Processing (NLP)",
    "question": "Write down the process of analyzing the structure of a sentence.",
    "answer": "Parsing / Syntactic analysis."
  },
  {
    "id": 67,
    "group": "Natural Language Processing (NLP)",
    "question": "What is the purpose of named entity recognition in NLP?",
    "answer": "To identify and classify names such as persons, places, organizations, dates, etc."
  },
  {
    "id": 68,
    "group": "Natural Language Processing (NLP)",
    "question": "Choose from the following areas where NLP cannot be useful: A. Automatic Text Summarization B. Medical transcription C. Information Retrieval D. Image Classification.",
    "answer": "D. Image Classification."
  }
];
