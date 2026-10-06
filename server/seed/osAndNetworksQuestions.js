/**
 * 60 Comprehensive Technical Questions across Operating Systems (OS) and Computer Networks (CN)
 * 10 Easy, 10 Medium, 10 Hard for each topic.
 */

const osAndNetworksQuestions = [
  // ===================== OS EASY (10) =====================
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the primary role of an Operating System kernel?',
    options: [
      { id: 'A', text: 'To act as the core interface between user hardware and application processes' },
      { id: 'B', text: 'To compile user application code into assembly language' },
      { id: 'C', text: 'To manage web browser rendering engines' },
      { id: 'D', text: 'To encrypt hard drive sectors during power-off' }
    ],
    correctAnswer: 'A',
    explanation: 'The kernel is the foundational core of an OS that manages CPU, memory, devices, and system calls.',
    tags: ['OS', 'Kernel', 'Basics']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which process state occurs when a running process requests an I/O operation and must wait for completion?',
    options: [
      { id: 'A', text: 'Ready' },
      { id: 'B', text: 'Waiting / Blocked' },
      { id: 'C', text: 'Terminated' },
      { id: 'D', text: 'Zombie' },
    ],
    correctAnswer: 'B',
    explanation: 'A process transitions to the Blocked/Waiting state until the asynchronous I/O event signals completion.',
    tags: ['OS', 'Process Lifecycle']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is a Thread in operating systems?',
    options: [
      { id: 'A', text: 'A heavy independent address space with private page tables' },
      { id: 'B', text: 'A lightweight unit of execution sharing memory space with peer threads of the same process' },
      { id: 'C', text: 'A hardware interrupt controller' },
      { id: 'D', text: 'A physical processor core' },
    ],
    correctAnswer: 'B',
    explanation: 'Threads within the same process share code, data, and OS resources, maintaining private stack and register states.',
    tags: ['OS', 'Concurrency', 'Threads']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which CPU scheduling algorithm gives CPU time slices sequentially to each process in FIFO order?',
    options: [
      { id: 'A', text: 'Shortest Job First (SJF)' },
      { id: 'B', text: 'Round Robin (RR)' },
      { id: 'C', text: 'Priority Scheduling' },
      { id: 'D', text: 'Multilevel Feedback Queue' },
    ],
    correctAnswer: 'B',
    explanation: 'Round Robin assigns fixed time slices (quanta) in circular FIFO order to achieve preemptive fairness.',
    tags: ['OS', 'Scheduling']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is Virtual Memory?',
    options: [
      { id: 'A', text: 'RAM located in cloud data centers' },
      { id: 'B', text: 'A memory abstraction mapping isolated virtual address spaces to physical RAM and secondary swap storage' },
      { id: 'C', text: 'Cache memory on GPU graphics cards' },
      { id: 'D', text: 'Read-only BIOS firmware' },
    ],
    correctAnswer: 'B',
    explanation: 'Virtual memory isolates process address spaces and expands apparent capacity using secondary backing storage.',
    tags: ['OS', 'Memory Management']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is a Page Fault?',
    options: [
      { id: 'A', text: 'A hardware electrical failure in the memory bus' },
      { id: 'B', text: 'An interrupt raised when a program accesses a virtual page that is currently not resident in physical RAM' },
      { id: 'C', text: 'An illegal instruction in user space code' },
      { id: 'D', text: 'A syntax error in database pagination' },
    ],
    correctAnswer: 'B',
    explanation: 'When an address resolves to a non-resident page, the MMU triggers a page fault to swap the page from disk into RAM.',
    tags: ['OS', 'Paging', 'Memory']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which system call in UNIX creates a new process by duplicating the calling process?',
    options: [
      { id: 'A', text: 'fork()' },
      { id: 'B', text: 'exec()' },
      { id: 'C', text: 'pthread_create()' },
      { id: 'D', text: 'spawn()' },
    ],
    correctAnswer: 'A',
    explanation: 'fork() clones the calling process, creating a child with an identical copy of the virtual address space (via Copy-On-Write).',
    tags: ['OS', 'System Calls']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is Thrashing in an operating system?',
    options: [
      { id: 'A', text: 'When the CPU is 100% busy running user calculations' },
      { id: 'B', text: 'When the system spends more time swapping pages in and out of disk than executing instructions' },
      { id: 'C', text: 'When network packets collide in Ethernet switch hubs' },
      { id: 'D', text: 'When hard drive magnetic heads overheat' },
    ],
    correctAnswer: 'B',
    explanation: 'Thrashing occurs when the collective working sets of processes exceed physical memory, causing constant page fault cascades.',
    tags: ['OS', 'Paging', 'Performance']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which register points to the next machine instruction to be fetched and executed by the CPU?',
    options: [
      { id: 'A', text: 'Stack Pointer (SP)' },
      { id: 'B', text: 'Program Counter (PC)' },
      { id: 'C', text: 'Memory Data Register (MDR)' },
      { id: 'D', text: 'Base Pointer (BP)' },
    ],
    correctAnswer: 'B',
    explanation: 'The Program Counter (Instruction Pointer) contains the memory address of the next executable instruction.',
    tags: ['OS', 'CPU Architecture']
  },
  {
    topic: 'OS', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is a Semaphore in concurrent programming?',
    options: [
      { id: 'A', text: 'A synchronization variable used to manage concurrent access to common finite resources' },
      { id: 'B', text: 'A compiler tool that converts C code to WebAssembly' },
      { id: 'C', text: 'A secure socket protocol' },
      { id: 'D', text: 'A disk defragmentation utility' },
    ],
    correctAnswer: 'A',
    explanation: 'A Semaphore maintains an integer counter with atomic wait() (P) and signal() (V) operations to control concurrent resource access.',
    tags: ['OS', 'Synchronization', 'Concurrency']
  },

  // ===================== OS MEDIUM (10) =====================
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which of the following is NOT one of Coffman’s four necessary conditions for deadlock?',
    options: [
      { id: 'A', text: 'Mutual Exclusion' },
      { id: 'B', text: 'Hold and Wait' },
      { id: 'C', text: 'Preemptive Resource Allocation' },
      { id: 'D', text: 'Circular Wait' },
    ],
    correctAnswer: 'C',
    explanation: 'The required condition is "No Preemption". If preemptive allocation is allowed, deadlocks can be systematically broken.',
    tags: ['OS', 'Deadlock']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
    options: [
      { id: 'A', text: 'A fast hardware associative cache that stores recent virtual-to-physical page frame translations' },
      { id: 'B', text: 'A disk buffer for write-behind caching' },
      { id: 'C', text: 'A CPU register containing process return addresses' },
      { id: 'D', text: 'A table tracking socket connections' },
    ],
    correctAnswer: 'A',
    explanation: 'The TLB prevents traversing multi-level page tables in main RAM on every instruction by caching translation mappings.',
    tags: ['OS', 'Virtual Memory', 'TLB']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What happens during a Context Switch between two user processes?',
    options: [
      { id: 'A', text: 'The kernel reboots the machine into single-user mode' },
      { id: 'B', text: 'CPU registers, program counter, and stack pointer of the active process are saved in its PCB, and the new process state is restored' },
      { id: 'C', text: 'All files on disk are flushed and closed' },
      { id: 'D', text: 'The garbage collector halts all threads' },
    ],
    correctAnswer: 'B',
    explanation: 'A context switch saves process state into the Process Control Block (PCB) and restores the state of the scheduled process.',
    tags: ['OS', 'Process Control', 'Context Switch']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which algorithm is used in Bankers Algorithm for deadlock management?',
    options: [
      { id: 'A', text: 'Deadlock Detection' },
      { id: 'B', text: 'Deadlock Avoidance using Safe State analysis' },
      { id: 'C', text: 'Deadlock Recovery by killing all processes' },
      { id: 'D', text: 'Deadlock Ignorance (Ostrich Algorithm)' },
    ],
    correctAnswer: 'B',
    explanation: 'Banker’s algorithm simulates resource allocation by checking if a safe execution sequence exists before granting resources.',
    tags: ['OS', 'Deadlock', 'Algorithms']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is a Zombie Process in Unix systems?',
    options: [
      { id: 'A', text: 'A malicious virus executing background shell commands' },
      { id: 'B', text: 'A process that has completed execution but retains an entry in the process table until its parent reads its exit status' },
      { id: 'C', text: 'A process whose parent has terminated' },
      { id: 'D', text: 'A thread sleeping on an event loop' },
    ],
    correctAnswer: 'B',
    explanation: 'A zombie process has exited, but remains in the process table so the parent can inspect its termination status via wait().',
    tags: ['OS', 'Process Management']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In memory management, what distinguishes Internal Fragmentation from External Fragmentation?',
    options: [
      { id: 'A', text: 'Internal occurs when allocated memory exceeds process demand; External occurs when total free memory is fragmented into unusable small chunks' },
      { id: 'B', text: 'Internal fragmentation only occurs on SSD drives' },
      { id: 'C', text: 'External fragmentation happens exclusively in fixed partition schemes' },
      { id: 'D', text: 'Internal fragmentation is resolved by virtual memory page tables' },
    ],
    correctAnswer: 'A',
    explanation: 'Internal fragmentation is wasted space inside an allocated block (e.g. 4KB page). External is scattered free gaps between blocks.',
    tags: ['OS', 'Memory Fragmentation']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the Critical Section Problem in concurrency?',
    options: [
      { id: 'A', text: 'Designing a protocol ensuring only one process executes shared data modifications at any given time' },
      { id: 'B', text: 'Handling memory leaks in long-running servers' },
      { id: 'C', text: 'Avoiding stack overflows in recursive functions' },
      { id: 'D', text: 'Securing kernel mode from unauthorized BIOS updates' },
    ],
    correctAnswer: 'A',
    explanation: 'The critical section problem requires mutual exclusion, progress, and bounded waiting when multiple threads share state.',
    tags: ['OS', 'Concurrency', 'Critical Section']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'How does Copy-on-Write (COW) optimize fork() performance?',
    options: [
      { id: 'A', text: 'It creates no child process until write occurs' },
      { id: 'B', text: 'Parent and child share physical pages marked read-only; duplication only happens when either process attempts to write' },
      { id: 'C', text: 'It writes memory directly to NVMe SSD without RAM allocation' },
      { id: 'D', text: 'It encrypts shared pages with AES-256' },
    ],
    correctAnswer: 'B',
    explanation: 'COW avoids duplicating entire memory spaces during fork(), duplicating individual pages only upon modification.',
    tags: ['OS', 'Virtual Memory', 'Copy On Write']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is Priority Inversion in real-time operating systems?',
    options: [
      { id: 'A', text: 'When a low-priority process holds a lock needed by a high-priority process, and an intermediate process delays the lower one' },
      { id: 'B', text: 'When user processes receive higher priority than kernel interrupts' },
      { id: 'C', text: 'When short jobs are postponed indefinitely' },
      { id: 'D', text: 'When priorities are reversed alphabetically' },
    ],
    correctAnswer: 'A',
    explanation: 'Priority inversion was famous on Mars Pathfinder: resolved using Priority Inheritance protocols.',
    tags: ['OS', 'Real Time', 'Priority']
  },
  {
    topic: 'OS', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Which page replacement algorithm suffers from Belady’s Anomaly?',
    options: [
      { id: 'A', text: 'FIFO (First-In-First-Out)' },
      { id: 'B', text: 'LRU (Least Recently Used)' },
      { id: 'C', text: 'Optimal (OPT)' },
      { id: 'D', text: 'LFU (Least Frequently Used)' },
    ],
    correctAnswer: 'A',
    explanation: 'Belady’s Anomaly is a counter-intuitive phenomenon where increasing page frames causes MORE page faults under FIFO.',
    tags: ['OS', 'Paging', 'Belady Anomaly']
  },

  // ===================== OS HARD (10) =====================
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'Why is Peterson’s Algorithm for mutual exclusion not guaranteed to work correctly on modern multi-core x86/ARM processors without memory barriers?',
    options: [
      { id: 'A', text: 'Modern out-of-order CPUs and compilers can reorder store-load memory operations, violating sequential consistency' },
      { id: 'B', text: 'Peterson’s algorithm requires 64-bit integer registers' },
      { id: 'C', text: 'Peterson’s algorithm cannot run on non-preemptive kernels' },
      { id: 'D', text: 'ARM architectures prohibit boolean flags in L1 cache' },
    ],
    correctAnswer: 'A',
    explanation: 'Weak memory models permit instruction reordering and store buffers. Memory barriers or atomic CAS instructions are required.',
    tags: ['OS', 'Memory Models', 'Concurrency', 'Advanced']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In multi-level paging with a 4-level page table on x86-64, what is the maximum number of memory accesses required for a single virtual address lookup in the worst-case (TLB miss)?',
    options: [
      { id: 'A', text: '1 memory access' },
      { id: 'B', text: '4 memory accesses' },
      { id: 'C', text: '5 memory accesses (4 for page tables + 1 for actual data)' },
      { id: 'D', text: '16 memory accesses' },
    ],
    correctAnswer: 'C',
    explanation: 'Traversing PML4, PDPT, PD, and PT takes 4 lookups to find the physical frame, plus 1 access to read/write the target data byte.',
    tags: ['OS', 'Virtual Memory', 'Paging', 'x86']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the primary architectural difference between Monolithic Kernels (Linux) and Microkernels (Mach, seL4)?',
    options: [
      { id: 'A', text: 'Microkernels execute OS services (file systems, drivers, network stacks) in user space processes, communicating via IPC' },
      { id: 'B', text: 'Monolithic kernels lack support for device drivers' },
      { id: 'C', text: 'Microkernels execute entirely inside CPU hardware ROM' },
      { id: 'D', text: 'Monolithic kernels prohibit multi-threading' },
    ],
    correctAnswer: 'A',
    explanation: 'Microkernels keep only minimal IPC, memory management, and scheduling in kernel mode, boosting fault isolation at IPC cost.',
    tags: ['OS', 'Kernel Architecture', 'Microkernel']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In the Linux Completely Fair Scheduler (CFS), what data structure is used to track tasks based on virtual runtime (vruntime)?',
    options: [
      { id: 'A', text: 'Doubly Linked List' },
      { id: 'B', text: 'Red-Black Tree' },
      { id: 'C', text: 'Fibonacci Heap' },
      { id: 'D', text: 'Bloom Filter' },
    ],
    correctAnswer: 'B',
    explanation: 'CFS orders runnable processes in a Red-Black Tree keyed by vruntime, picking the leftmost node in O(1) cached time.',
    tags: ['OS', 'Linux', 'CFS', 'Scheduling']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What hardware mechanism allows an I/O device to transfer data directly to/from main system memory without CPU intervention?',
    options: [
      { id: 'A', text: 'Direct Memory Access (DMA)' },
      { id: 'B', text: 'Polling IO' },
      { id: 'C', text: 'Programmed IO (PIO)' },
      { id: 'D', text: 'Software Trap Interrupt' },
    ],
    correctAnswer: 'A',
    explanation: 'DMA controllers take over the system bus to stream blocks between devices and RAM, firing an interrupt only upon completion.',
    tags: ['OS', 'Hardware', 'DMA', 'Architecture']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is False Sharing in multi-threaded SMP architectures?',
    options: [
      { id: 'A', text: 'Independent variables accessed by different CPU cores reside on the same cache line, triggering unnecessary cache invalidations' },
      { id: 'B', text: 'Threads reading corrupted data from uncommitted database transactions' },
      { id: 'C', text: 'Process communication across unauthenticated Unix sockets' },
      { id: 'D', text: 'Virtual addresses pointing to unallocated swap space' },
    ],
    correctAnswer: 'A',
    explanation: 'When cores modify distinct variables on the same 64-byte cache line, the MESI cache coherence protocol repeatedly invalidates cache lines.',
    tags: ['OS', 'Cache Coherence', 'SMP', 'Concurrency']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In Linux memory management, what is the role of the OOM (Out Of Memory) Killer?',
    options: [
      { id: 'A', text: 'Selects and terminates non-critical high-memory consumer processes via heuristic badness scores when RAM and swap are exhausted' },
      { id: 'B', text: 'Automatically restarts the physical computer' },
      { id: 'C', text: 'Clears user cache files from /tmp directory' },
      { id: 'D', text: 'Compresses executable ELF files in place' },
    ],
    correctAnswer: 'A',
    explanation: 'When page allocation fails and reclaiming/swapping is impossible, the OOM killer scores processes and terminates the sacrificial process.',
    tags: ['OS', 'Linux', 'Memory', 'OOM']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the purpose of an Inode in Unix file systems (e.g. ext4)?',
    options: [
      { id: 'A', text: 'Stores file metadata (permissions, ownership, timestamps, block pointers) distinct from the filename which resides in directory entries' },
      { id: 'B', text: 'Stores only the visual file icon on desktop systems' },
      { id: 'C', text: 'An encryption hash table used by SSH keys' },
      { id: 'D', text: 'The master boot record of the partition' },
    ],
    correctAnswer: 'A',
    explanation: 'An inode contains all file metadata and data block pointers; directory entries map string filenames to inode numbers.',
    tags: ['OS', 'File Systems', 'Inodes']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What distinguishes epoll (Linux) and kqueue (BSD) from traditional select() / poll() system calls for network event handling?',
    options: [
      { id: 'A', text: 'epoll/kqueue register file descriptors with the kernel once and deliver active events in O(1) or O(active) time, avoiding O(n) descriptor scanning' },
      { id: 'B', text: 'select() uses multi-threading whereas epoll uses multi-processing' },
      { id: 'C', text: 'epoll is limited to 1024 total sockets' },
      { id: 'D', text: 'kqueue runs in user-space without kernel system calls' },
    ],
    correctAnswer: 'A',
    explanation: 'epoll eliminates linear scanning of thousands of idle descriptors by maintaining an internal red-black tree and ready-list.',
    tags: ['OS', 'Network IO', 'epoll', 'System Calls']
  },
  {
    topic: 'OS', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What security feature uses hardware-enforced NX (No-eXecute) / XD bits to prevent buffer overflow exploits?',
    options: [
      { id: 'A', text: 'Data Execution Prevention (DEP) / W^X (Write XOR Execute)' },
      { id: 'B', text: 'Address Space Layout Randomization (ASLR)' },
      { id: 'C', text: 'Stack Canaries' },
      { id: 'D', text: 'Shadow Call Stacks' },
    ],
    correctAnswer: 'A',
    explanation: 'DEP marks data pages (stack, heap) as non-executable, preventing injected shellcode from being executed by the instruction pointer.',
    tags: ['OS', 'Security', 'DEP', 'Buffer Overflow']
  },

  // ===================== COMPUTER NETWORKS EASY (10) =====================
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'How many layers are in the standard OSI Reference Model?',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '7' },
      { id: 'D', text: '9' },
    ],
    correctAnswer: 'C',
    explanation: 'OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application (7 layers).',
    tags: ['Computer Networks', 'OSI Model', 'Basics']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which protocol is responsible for translating human-readable domain names (e.g. zelis.com) into numerical IP addresses?',
    options: [
      { id: 'A', text: 'DHCP' },
      { id: 'B', text: 'DNS' },
      { id: 'C', text: 'ARP' },
      { id: 'D', text: 'BGP' },
    ],
    correctAnswer: 'B',
    explanation: 'Domain Name System (DNS) resolves alphanumeric domain hostnames to IP addresses.',
    tags: ['Computer Networks', 'DNS', 'Protocols']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the default TCP port for HTTPS secure web traffic?',
    options: [
      { id: 'A', text: '80' },
      { id: 'B', text: '443' },
      { id: 'C', text: '8080' },
      { id: 'D', text: '22' },
    ],
    correctAnswer: 'B',
    explanation: 'Port 443 is assigned by IANA for HTTP traffic over TLS/SSL (HTTPS). Port 80 is unencrypted HTTP.',
    tags: ['Computer Networks', 'Ports', 'HTTP']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which transport layer protocol provides connection-oriented, reliable, and ordered delivery of byte streams?',
    options: [
      { id: 'A', text: 'UDP' },
      { id: 'B', text: 'TCP' },
      { id: 'C', text: 'ICMP' },
      { id: 'D', text: 'IP' },
    ],
    correctAnswer: 'B',
    explanation: 'Transmission Control Protocol (TCP) ensures reliable delivery with acknowledgments, retransmissions, and ordering.',
    tags: ['Computer Networks', 'TCP', 'Transport']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What is the size of an IPv4 address in bits?',
    options: [
      { id: 'A', text: '16 bits' },
      { id: 'B', text: '32 bits' },
      { id: 'C', text: '64 bits' },
      { id: 'D', text: '128 bits' },
    ],
    correctAnswer: 'B',
    explanation: 'IPv4 addresses are 32 bits long (4 octets), whereas IPv6 addresses are 128 bits.',
    tags: ['Computer Networks', 'IPv4', 'Addressing']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What protocol is used by the ping utility to test network reachability?',
    options: [
      { id: 'A', text: 'SNMP' },
      { id: 'B', text: 'ICMP' },
      { id: 'C', text: 'IGMP' },
      { id: 'D', text: 'FTP' },
    ],
    correctAnswer: 'B',
    explanation: 'Ping transmits ICMP Echo Request packets and listens for ICMP Echo Reply responses.',
    tags: ['Computer Networks', 'ICMP', 'Diagnostics']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which device operates primarily at Layer 2 (Data Link layer) to forward frames based on MAC addresses?',
    options: [
      { id: 'A', text: 'Repeater' },
      { id: 'B', text: 'Network Switch' },
      { id: 'C', text: 'Router' },
      { id: 'D', text: 'Application Gateway' },
    ],
    correctAnswer: 'B',
    explanation: 'A Layer 2 Ethernet Switch inspects MAC header frames and maintains a MAC address forwarding table.',
    tags: ['Computer Networks', 'Switches', 'Hardware']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What does DHCP stand for in network configuration?',
    options: [
      { id: 'A', text: 'Dynamic Host Configuration Protocol' },
      { id: 'B', text: 'Direct Host Routing Protocol' },
      { id: 'C', text: 'Data Hashing Control Packet' },
      { id: 'D', text: 'Distributed Hub Connection Protocol' },
    ],
    correctAnswer: 'A',
    explanation: 'DHCP dynamically assigns IP addresses, subnet masks, default gateways, and DNS servers to client devices.',
    tags: ['Computer Networks', 'DHCP']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'What protocol maps an IPv4 address to its associated physical hardware MAC address on a local link?',
    options: [
      { id: 'A', text: 'ARP (Address Resolution Protocol)' },
      { id: 'B', text: 'DNS' },
      { id: 'C', text: 'NAT' },
      { id: 'D', text: 'RIP' },
    ],
    correctAnswer: 'A',
    explanation: 'ARP broadcasts requests over the local link layer to discover the Ethernet MAC address matching a destination IP.',
    tags: ['Computer Networks', 'ARP', 'Layer 2']
  },
  {
    topic: 'Computer Networks', difficulty: 'easy', marks: 1, type: 'mcq',
    questionText: 'Which HTTP method is specifically defined as idempotent and used to retrieve representation of resources without side effects?',
    options: [
      { id: 'A', text: 'POST' },
      { id: 'B', text: 'GET' },
      { id: 'C', text: 'PATCH' },
      { id: 'D', text: 'CONNECT' },
    ],
    correctAnswer: 'B',
    explanation: 'GET is safe and idempotent; repeating GET requests produces identical results without altering server state.',
    tags: ['Computer Networks', 'HTTP', 'Web']
  },

  // ===================== COMPUTER NETWORKS MEDIUM (10) =====================
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the correct sequence of messages during the standard TCP Three-Way Handshake?',
    options: [
      { id: 'A', text: 'SYN -> SYN-ACK -> ACK' },
      { id: 'B', text: 'ACK -> SYN -> ACK' },
      { id: 'C', text: 'SYN -> ACK -> DATA' },
      { id: 'D', text: 'RST -> SYN -> ACK' },
    ],
    correctAnswer: 'A',
    explanation: 'Client sends SYN, server responds with SYN-ACK, client returns final ACK establishing connection.',
    tags: ['Computer Networks', 'TCP', 'Handshake']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'How many usable host IP addresses are available in a /28 IPv4 subnet?',
    options: [
      { id: 'A', text: '14' },
      { id: 'B', text: '16' },
      { id: 'C', text: '30' },
      { id: 'D', text: '62' },
    ],
    correctAnswer: 'A',
    explanation: 'A /28 subnet has 32 - 28 = 4 host bits (2^4 = 16 total). Subtracting network and broadcast addresses leaves 14 usable hosts.',
    tags: ['Computer Networks', 'Subnetting', 'CIDR']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the purpose of NAT (Network Address Translation)?',
    options: [
      { id: 'A', text: 'Allows multiple devices on a private local network to share one or more public IP addresses' },
      { id: 'B', text: 'Translates TCP packets into UDP frames' },
      { id: 'C', text: 'Encrypts wireless radio frequencies in Wi-Fi' },
      { id: 'D', text: 'Compresses HTML text in web proxies' },
    ],
    correctAnswer: 'A',
    explanation: 'NAT maps private RFC 1918 IP addresses to public routable IP addresses, conserving public IPv4 space.',
    tags: ['Computer Networks', 'NAT', 'Routing']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'In TCP congestion control, what happens during the Slow Start phase?',
    options: [
      { id: 'A', text: 'The congestion window (cwnd) doubles every Round Trip Time (RTT) until reaching ssthresh' },
      { id: 'B', text: 'Transmission rate decreases by half every second' },
      { id: 'C', text: 'Packets are delayed intentionally to save router buffer space' },
      { id: 'D', text: 'cwnd increases linearly by 1 MSS per RTT' },
    ],
    correctAnswer: 'A',
    explanation: 'Slow Start grows cwnd exponentially (by 1 MSS for every received ACK) to rapidly probe available bandwidth.',
    tags: ['Computer Networks', 'TCP', 'Congestion Control']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is Head-of-Line (HoL) Blocking in HTTP/1.1 with pipelining?',
    options: [
      { id: 'A', text: 'A slow or stalled response to the first request blocks the delivery of all subsequent responses over that TCP connection' },
      { id: 'B', text: 'Network switches dropping large packet payloads' },
      { id: 'C', text: 'DNS lookup caching failure' },
      { id: 'D', text: 'SSL handshake timeout' },
    ],
    correctAnswer: 'A',
    explanation: 'HTTP/1.1 pipelining mandates responses be returned in strictly the same order as requested, causing pipeline stalls.',
    tags: ['Computer Networks', 'HTTP', 'Performance']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What routing protocol is the standard Exterior Gateway Protocol (EGP) powering inter-domain routing across the global Internet?',
    options: [
      { id: 'A', text: 'BGP (Border Gateway Protocol)' },
      { id: 'B', text: 'OSPF (Open Shortest Path First)' },
      { id: 'C', text: 'RIP (Routing Information Protocol)' },
      { id: 'D', text: 'IS-IS' },
    ],
    correctAnswer: 'A',
    explanation: 'BGP-4 is a path-vector protocol that routes traffic between autonomous systems (ASes) globally.',
    tags: ['Computer Networks', 'BGP', 'Routing']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the function of the TTL (Time To Live) field in an IPv4 packet header?',
    options: [
      { id: 'A', text: 'Prevents packets from looping endlessly in routing loops by decrementing at every hop and discarding at 0' },
      { id: 'B', text: 'Measures total millisecond latency across links' },
      { id: 'C', text: 'Sets the expiration timestamp for web cookies' },
      { id: 'D', text: 'Limits TCP session duration to 24 hours' },
    ],
    correctAnswer: 'A',
    explanation: 'Each router decrements TTL by 1. When TTL reaches 0, the packet is discarded and an ICMP Time Exceeded is returned.',
    tags: ['Computer Networks', 'IPv4', 'Routing']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'Why was HTTP/2 introduced with binary framing instead of plain text like HTTP/1.1?',
    options: [
      { id: 'A', text: 'To enable full bidirectional multiplexing of streams over a single TCP connection without serialization ambiguity' },
      { id: 'B', text: 'To encrypt all web traffic without TLS certificates' },
      { id: 'C', text: 'To prevent cross-site scripting vulnerabilities' },
      { id: 'D', text: 'To increase maximum header size to 1MB' },
    ],
    correctAnswer: 'A',
    explanation: 'Binary framing splits messages into typed frames interleaved across streams on a single TCP connection.',
    tags: ['Computer Networks', 'HTTP/2', 'Protocols']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is the purpose of the TLS SNI (Server Name Indication) extension during the TLS handshake?',
    options: [
      { id: 'A', text: 'Allows the client to specify the target hostname during the initial ClientHello so the server can present the correct SSL certificate on virtual hosts' },
      { id: 'B', text: 'Generates private RSA cryptographic keys' },
      { id: 'C', text: 'Compresses TLS certificate chains' },
      { id: 'D', text: 'Prevents DNS spoofing attacks' },
    ],
    correctAnswer: 'A',
    explanation: 'SNI solves the multi-tenant hosting problem where multiple HTTPS domains share a single public IP address.',
    tags: ['Computer Networks', 'TLS', 'Security', 'SNI']
  },
  {
    topic: 'Computer Networks', difficulty: 'medium', marks: 2, type: 'mcq',
    questionText: 'What is Anycast routing?',
    options: [
      { id: 'A', text: 'Multiple physical servers across global regions share the identical IP address, with routers steering traffic to the topologically closest node' },
      { id: 'B', text: 'Sending packets simultaneously to every host on a subnet' },
      { id: 'C', text: 'Transmitting wireless radio broadcasts' },
      { id: 'D', text: 'Tunneling IPv6 packets through IPv4' },
    ],
    correctAnswer: 'A',
    explanation: 'Anycast routes traffic to the nearest instance using BGP metrics, commonly utilized by CDNs (Cloudflare) and Root DNS.',
    tags: ['Computer Networks', 'Anycast', 'CDN', 'Routing']
  },

  // ===================== COMPUTER NETWORKS HARD (10) =====================
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What foundational problem led to the development of HTTP/3 and QUIC over UDP instead of TCP?',
    options: [
      { id: 'A', text: 'TCP Head-of-Line blocking: packet loss on one stream stalls all other multiplexed streams because the TCP transport layer guarantees in-order byte delivery' },
      { id: 'B', text: 'TCP is restricted to 32-bit port numbers' },
      { id: 'C', text: 'UDP eliminates the need for congestion control algorithms' },
      { id: 'D', text: 'Middleboxes prohibit TLS 1.3 over TCP connections' },
    ],
    correctAnswer: 'A',
    explanation: 'In HTTP/2 over TCP, a single dropped packet stalls ALL streams until TCP retransmits. QUIC operates over UDP with independent stream delivery.',
    tags: ['Computer Networks', 'QUIC', 'HTTP/3', 'Advanced']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is BBR (Bottleneck Bandwidth and RTT) congestion control, and how does it differ fundamentally from loss-based algorithms like CUBIC and Reno?',
    options: [
      { id: 'A', text: 'BBR continuously estimates bandwidth and minimum RTT without treating packet loss as an immediate signal of congestion, preventing bufferbloat' },
      { id: 'B', text: 'BBR sets a fixed static transmission rate determined by DNS' },
      { id: 'C', text: 'BBR requires specialized router hardware support at every Internet exchange' },
      { id: 'D', text: 'BBR drops congestion windows to 1 upon any single delay variation' },
    ],
    correctAnswer: 'A',
    explanation: 'Developed by Google, BBR models the physical pipe rather than interpreting random packet drops or bloated buffers as congestion.',
    tags: ['Computer Networks', 'Congestion Control', 'BBR', 'TCP']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the purpose of the TCP TIME_WAIT state and why does it persist for 2 * MSL (Maximum Segment Lifetime)?',
    options: [
      { id: 'A', text: 'Ensures the final ACK is acknowledged and prevents delayed duplicate segments from a past connection from corrupting a new connection on the same socket tuple' },
      { id: 'B', text: 'Allows the server to garbage-collect TCP buffers' },
      { id: 'C', text: 'Enables NAT routers to flush translation tables' },
      { id: 'D', text: 'Permits cryptographic TLS session resumption' },
    ],
    correctAnswer: 'A',
    explanation: '2*MSL ensures any stray packets in flight have drained from the network before the port combination can be safely reused.',
    tags: ['Computer Networks', 'TCP', 'TIME_WAIT', 'Architecture']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is BGP Hijacking, and what cryptographic framework protects Autonomous Systems against it?',
    options: [
      { id: 'A', text: 'An attacker illegitimately announces an IP prefix via BGP; protected by RPKI (Resource Public Key Infrastructure) Route Origin Authorization' },
      { id: 'B', text: 'A brute force password attack on Cisco router Telnet ports; protected by SSH' },
      { id: 'C', text: 'A DNS cache poisoning exploit; protected by HTTPS' },
      { id: 'D', text: 'A physical fiber optic cable tap' },
    ],
    correctAnswer: 'A',
    explanation: 'RPKI ROAs cryptographically bind IP address blocks to authorized AS numbers, validating BGP announcements.',
    tags: ['Computer Networks', 'Security', 'BGP', 'RPKI']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What happens during a TLS 1.3 0-RTT (Zero Round Trip Time) early data connection resumption, and what is its primary security vulnerability?',
    options: [
      { id: 'A', text: 'Client sends encrypted application data in the first flight using cached session keys; vulnerable to Replay Attacks' },
      { id: 'B', text: 'Client connects without TLS encryption; vulnerable to eavesdropping' },
      { id: 'C', text: 'Server uses MD5 hash verification; vulnerable to collisions' },
      { id: 'D', text: 'Client bypasses authentication; vulnerable to privilege escalation' },
    ],
    correctAnswer: 'A',
    explanation: '0-RTT achieves instant data transfer on resumption, but an adversary capturing the first flight can replay it against the server.',
    tags: ['Computer Networks', 'TLS 1.3', 'Security', 'Cryptography']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'How does Path MTU Discovery (PMTUD) determine the maximum IP packet size without causing IP fragmentation?',
    options: [
      { id: 'A', text: 'Sends packets with the DF (Don’t Fragment) flag set; routers that cannot forward without fragmenting return ICMP Fragmentation Needed with their MTU' },
      { id: 'B', text: 'Queries DNS for router MTU records' },
      { id: 'C', text: 'Assumes a static maximum payload of 9000 bytes across all links' },
      { id: 'D', text: 'Uses ARP request frame lengths' },
    ],
    correctAnswer: 'A',
    explanation: 'PMTUD probes with DF=1; if an MTU is too small, the router drops the packet and reports its MTU via ICMP Type 3 Code 4.',
    tags: ['Computer Networks', 'MTU', 'IP', 'Fragmentation']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What problem does ECN (Explicit Congestion Notification) solve in IP and TCP headers?',
    options: [
      { id: 'A', text: 'Enables intermediate routers to signal impending buffer congestion by marking bits in the IP header instead of dropping packets' },
      { id: 'B', text: 'Encrypts payload headers in user mode' },
      { id: 'C', text: 'Enables multi-homed network card failover' },
      { id: 'D', text: 'Compresses TCP checksum computations' },
    ],
    correctAnswer: 'A',
    explanation: 'ECN marks the CE (Congestion Experienced) bits in the IP header, prompting the receiver to notify the sender via TCP ECE flags without packet drops.',
    tags: ['Computer Networks', 'ECN', 'Congestion']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the purpose of Spanning Tree Protocol (STP / IEEE 802.1D) in switched Ethernet LANs?',
    options: [
      { id: 'A', text: 'Prevents bridge loops and broadcast storms by creating a loop-free logical tree topology across redundant links' },
      { id: 'B', text: 'Encrypts Ethernet frames with WPA3 enterprise' },
      { id: 'C', text: 'Assigns IP addresses dynamically over fiber optic cables' },
      { id: 'D', text: 'Distributes web traffic across server clusters' },
    ],
    correctAnswer: 'A',
    explanation: 'STP elects a root bridge and selectively blocks redundant physical ports to stop broadcast frames from infinitely multiplying.',
    tags: ['Computer Networks', 'STP', 'Layer 2', 'Ethernet']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'In DNSSEC, what is the role of the DS (Delegation Signer) record?',
    options: [
      { id: 'A', text: 'Contains a cryptographic hash of the child zone’s KSK (Key Signing Key) placed in the parent zone to establish a chain of trust' },
      { id: 'B', text: 'Directs mail traffic to secondary MX servers' },
      { id: 'C', text: 'Maps IPv6 addresses to hostnames' },
      { id: 'D', text: 'Defines DNS server timeout values' },
    ],
    correctAnswer: 'A',
    explanation: 'The DS record in the parent zone signs and authenticates the child zone’s public DNSKEY, linking the trust chain to root anchors.',
    tags: ['Computer Networks', 'DNSSEC', 'Security', 'Trust Chain']
  },
  {
    topic: 'Computer Networks', difficulty: 'hard', marks: 3, type: 'mcq',
    questionText: 'What is the key difference between Link-State routing protocols (OSPF) and Distance-Vector protocols (RIP)?',
    options: [
      { id: 'A', text: 'Link-state routers maintain complete global network topology maps and run Dijkstra’s algorithm, whereas Distance-Vector routers only know distance and direction from immediate neighbors (Bellman-Ford)' },
      { id: 'B', text: 'Distance-vector protocols have faster convergence than link-state' },
      { id: 'C', text: 'OSPF can only route within a single local area network without subnets' },
      { id: 'D', text: 'Distance-vector protocols eliminate count-to-infinity problems without split horizon' },
    ],
    correctAnswer: 'A',
    explanation: 'OSPF floods Link State Advertisements (LSAs) so every router computes the shortest path tree independently via Dijkstra.',
    tags: ['Computer Networks', 'Routing Protocols', 'OSPF', 'Dijkstra']
  },
];

module.exports = { osAndNetworksQuestions };
