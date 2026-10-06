/**
 * 15 Production Coding Questions (5 Easy, 5 Medium, 5 Hard)
 * Complete with multi-language starter code (Python, JavaScript, Java, C++, C),
 * sample test cases, and hidden evaluation test cases.
 */

const codingQuestionsData = [
  // ===================== 5 EASY CODING QUESTIONS =====================
  {
    title: 'Two Sum Target Indices',
    problemStatement:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice. Return the answer sorted in ascending order.',
    inputFormat: 'A JSON string or object formatted as: {"nums": [2, 7, 11, 15], "target": 9}',
    outputFormat: 'A JSON array containing the two 0-based indices, e.g. [0, 1]',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nExactly one valid answer exists.',
    difficulty: 'easy',
    topic: 'Arrays & Hashing',
    marks: 10,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(input_data):\n    # input_data: {"nums": [...], "target": int}\n    # Return list of two indices [i, j]\n    nums = input_data["nums"]\n    target = input_data["target"]\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []\n',
      javascript: 'function solution(inputData) {\n    const { nums, target } = inputData;\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n',
      java: 'import java.util.HashMap;\npublic class Solution {\n    public static int[] solution(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\nvector<int> solution(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int diff = target - nums[i];\n        if (map.count(diff)) return {map[diff], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}\n',
      c: 'int* solution(int* nums, int numsSize, int target, int* returnSize) {\n    // Write solution in C\n    *returnSize = 2;\n    return 0;\n}\n',
    },
    sampleTestCases: [
      {
        input: '{"nums": [2, 7, 11, 15], "target": 9}',
        expectedOutput: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
      },
      {
        input: '{"nums": [3, 2, 4], "target": 6}',
        expectedOutput: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, so indices [1, 2].',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums": [3, 3], "target": 6}', expectedOutput: '[0, 1]' },
      { input: '{"nums": [1, 5, 8, 12, 19], "target": 20}', expectedOutput: '[0, 4]' },
      { input: '{"nums": [-3, 4, 3, 90], "target": 0}', expectedOutput: '[0, 2]' },
    ],
  },
  {
    title: 'Valid Palindrome String',
    problemStatement:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    inputFormat: 'A string s, e.g. "A man, a plan, a canal: Panama"',
    outputFormat: 'A boolean value: true or false',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    difficulty: 'easy',
    topic: 'Two Pointers & Strings',
    marks: 10,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(s):\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    return cleaned == cleaned[::-1]\n',
      javascript: 'function solution(s) {\n    const cleaned = String(s).toLowerCase().replace(/[^a-z0-9]/g, "");\n    return cleaned === cleaned.split("").reverse().join("");\n}\n',
      java: 'public class Solution {\n    public static boolean solution(String s) {\n        // Return true if palindrome\n        return true;\n    }\n}\n',
      cpp: '#include <string>\nusing namespace std;\nbool solution(string s) {\n    return true;\n}\n',
      c: 'int solution(char* s) {\n    return 1;\n}\n',
    },
    sampleTestCases: [
      {
        input: 'A man, a plan, a canal: Panama',
        expectedOutput: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 'race a car',
        expectedOutput: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    hiddenTestCases: [
      { input: ' ', expectedOutput: 'true' },
      { input: '0P', expectedOutput: 'false' },
      { input: 'Was it a car or a cat I saw?', expectedOutput: 'true' },
    ],
  },
  {
    title: 'Merge Two Sorted Arrays',
    problemStatement:
      'Given two sorted integer arrays `nums1` and `nums2`, merge them into a single sorted array without losing ordering.\n\nReturn the merged sorted list.',
    inputFormat: '{"nums1": [1, 2, 4], "nums2": [1, 3, 4]}',
    outputFormat: 'A sorted JSON array of integers, e.g. [1, 1, 2, 3, 4, 4]',
    constraints: '0 <= nums1.length, nums2.length <= 1000\n-10^4 <= nums1[i], nums2[i] <= 10^4',
    difficulty: 'easy',
    topic: 'Arrays & Two Pointers',
    marks: 10,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(input_data):\n    # Return merged sorted list\n    nums1 = input_data.get("nums1", [])\n    nums2 = input_data.get("nums2", [])\n    return sorted(nums1 + nums2)\n',
      javascript: 'function solution(inputData) {\n    const { nums1 = [], nums2 = [] } = inputData;\n    return [...nums1, ...nums2].sort((a, b) => a - b);\n}\n',
      java: 'public class Solution {\n    // Merge two arrays\n}\n',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> solution(vector<int>& n1, vector<int>& n2) {\n    return {};\n}\n',
      c: 'void solution() {}\n',
    },
    sampleTestCases: [
      {
        input: '{"nums1": [1, 2, 4], "nums2": [1, 3, 4]}',
        expectedOutput: '[1, 1, 2, 3, 4, 4]',
      },
      {
        input: '{"nums1": [], "nums2": [0]}',
        expectedOutput: '[0]',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums1": [2, 5, 6], "nums2": [1, 3, 4]}', expectedOutput: '[1, 2, 3, 4, 5, 6]' },
      { input: '{"nums1": [-5, -2, 0], "nums2": [-4, 1, 9]}', expectedOutput: '[-5, -4, -2, 0, 1, 9]' },
    ],
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    problemStatement:
      'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
    inputFormat: '[7, 1, 5, 3, 6, 4]',
    outputFormat: 'An integer representing maximum profit, e.g. 5',
    constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
    difficulty: 'easy',
    topic: 'Greedy & Dynamic Programming',
    marks: 10,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_profit = max(max_profit, p - min_price)\n    return max_profit\n',
      javascript: 'function solution(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (const p of prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}\n',
      java: 'public class Solution {\n    public static int solution(int[] prices) {\n        return 0;\n    }\n}\n',
      cpp: '#include <vector>\nusing namespace std;\nint solution(vector<int>& prices) {\n    return 0;\n}\n',
      c: 'int solution(int* prices, int pricesSize) { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '[7, 1, 5, 3, 6, 4]',
        expectedOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
      },
      {
        input: '[7, 6, 4, 3, 1]',
        expectedOutput: '0',
        explanation: 'No positive profit possible, return 0.',
      },
    ],
    hiddenTestCases: [
      { input: '[2, 4, 1]', expectedOutput: '2' },
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '4' },
      { input: '[3, 2, 6, 5, 0, 3]', expectedOutput: '4' },
    ],
  },
  {
    title: 'Contains Duplicate Elements',
    problemStatement:
      'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
    inputFormat: '[1, 2, 3, 1]',
    outputFormat: 'true or false',
    constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
    difficulty: 'easy',
    topic: 'Hash Sets',
    marks: 10,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(nums):\n    return len(nums) != len(set(nums))\n',
      javascript: 'function solution(nums) {\n    return new Set(nums).size !== nums.length;\n}\n',
      java: 'import java.util.HashSet;\npublic class Solution {\n    public static boolean solution(int[] nums) {\n        return false;\n    }\n}\n',
      cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\nbool solution(vector<int>& nums) {\n    return false;\n}\n',
      c: 'int solution(int* nums, int numsSize) { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '[1, 2, 3, 1]',
        expectedOutput: 'true',
      },
      {
        input: '[1, 2, 3, 4]',
        expectedOutput: 'false',
      },
    ],
    hiddenTestCases: [
      { input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expectedOutput: 'true' },
      { input: '[99]', expectedOutput: 'false' },
    ],
  },

  // ===================== 5 MEDIUM CODING QUESTIONS =====================
  {
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    problemStatement:
      'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    inputFormat: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    outputFormat: 'An integer representing the maximum subarray sum, e.g. 6',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    difficulty: 'medium',
    topic: 'Dynamic Programming & Divide and Conquer',
    marks: 20,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(nums):\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far\n',
      javascript: 'function solution(nums) {\n    let maxSoFar = nums[0];\n    let currMax = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}\n',
      java: 'public class Solution {\n    public static int solution(int[] nums) {\n        int maxSoFar = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSoFar = Math.max(maxSoFar, curr);\n        }\n        return maxSoFar;\n    }\n}\n',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\nint solution(vector<int>& nums) {\n    int maxSoFar = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        maxSoFar = max(maxSoFar, curr);\n    }\n    return maxSoFar;\n}\n',
      c: 'int solution(int* nums, int numsSize) { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
      },
      {
        input: '[1]',
        expectedOutput: '1',
      },
    ],
    hiddenTestCases: [
      { input: '[5, 4, -1, 7, 8]', expectedOutput: '23' },
      { input: '[-1, -2, -3, -4]', expectedOutput: '-1' },
      { input: '[-2, -1]', expectedOutput: '-1' },
    ],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    problemStatement:
      'Given a string `s`, find the length of the longest substring without duplicate characters.',
    inputFormat: 'A string s, e.g. "abcabcbb"',
    outputFormat: 'An integer representing the max length, e.g. 3',
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
    difficulty: 'medium',
    topic: 'Sliding Window & Hash Maps',
    marks: 20,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(s):\n    seen = {}\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in seen and seen[char] >= left:\n            left = seen[char] + 1\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n',
      javascript: 'function solution(s) {\n    const seen = new Map();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        const char = s[right];\n        if (seen.has(char) && seen.get(char) >= left) {\n            left = seen.get(char) + 1;\n        }\n        seen.set(char, right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n',
      java: 'public class Solution { public static int solution(String s) { return 0; } }\n',
      cpp: '#include <string>\nusing namespace std;\nint solution(string s) { return 0; }\n',
      c: 'int solution(char* s) { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: 'abcabcbb',
        expectedOutput: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 'bbbbb',
        expectedOutput: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    hiddenTestCases: [
      { input: 'pwwkew', expectedOutput: '3' },
      { input: '', expectedOutput: '0' },
      { input: 'dvdf', expectedOutput: '3' },
    ],
  },
  {
    title: 'Top K Frequent Elements',
    problemStatement:
      'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.\n\nYou may return the answer in any order, sorted in ascending order.',
    inputFormat: '{"nums": [1, 1, 1, 2, 2, 3], "k": 2}',
    outputFormat: '[1, 2]',
    constraints: '1 <= nums.length <= 10^5\nk is in the range [1, the number of unique elements in the array].',
    difficulty: 'medium',
    topic: 'Heaps & Priority Queues',
    marks: 20,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'from collections import Counter\ndef solution(input_data):\n    nums = input_data["nums"]\n    k = input_data["k"]\n    counts = Counter(nums)\n    res = [item[0] for item in counts.most_common(k)]\n    return sorted(res)\n',
      javascript: 'function solution(inputData) {\n    const { nums, k } = inputData;\n    const map = {};\n    nums.forEach(n => map[n] = (map[n] || 0) + 1);\n    return Object.keys(map).sort((a, b) => map[b] - map[a]).slice(0, k).map(Number).sort((a,b)=>a-b);\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> solution() { return {}; }\n',
      c: 'void solution() {}\n',
    },
    sampleTestCases: [
      {
        input: '{"nums": [1, 1, 1, 2, 2, 3], "k": 2}',
        expectedOutput: '[1, 2]',
      },
      {
        input: '{"nums": [1], "k": 1}',
        expectedOutput: '[1]',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums": [4, 1, -1, 2, -1, 2, 3], "k": 2}', expectedOutput: '[-1, 2]' },
      { input: '{"nums": [1, 2], "k": 2}', expectedOutput: '[1, 2]' },
    ],
  },
  {
    title: 'Coin Change Minimum Coins',
    problemStatement:
      'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.',
    inputFormat: '{"coins": [1, 2, 5], "amount": 11}',
    outputFormat: 'An integer representing the minimum coins, e.g. 3',
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    difficulty: 'medium',
    topic: 'Dynamic Programming',
    marks: 20,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(input_data):\n    coins = input_data["coins"]\n    amount = input_data["amount"]\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for x in range(coin, amount + 1):\n            dp[x] = min(dp[x], dp[x - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n',
      javascript: 'function solution(inputData) {\n    const { coins, amount } = inputData;\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (const c of coins) {\n        for (let x = c; x <= amount; x++) {\n            dp[x] = Math.min(dp[x], dp[x - c] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <vector>\nusing namespace std;\nint solution() { return -1; }\n',
      c: 'int solution() { return -1; }\n',
    },
    sampleTestCases: [
      {
        input: '{"coins": [1, 2, 5], "amount": 11}',
        expectedOutput: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins)',
      },
      {
        input: '{"coins": [2], "amount": 3}',
        expectedOutput: '-1',
      },
    ],
    hiddenTestCases: [
      { input: '{"coins": [1], "amount": 0}', expectedOutput: '0' },
      { input: '{"coins": [1, 5, 10, 25], "amount": 30}', expectedOutput: '2' },
    ],
  },
  {
    title: 'Rotated Sorted Array Search',
    problemStatement:
      'Given an integer array `nums` sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index, and a `target` integer, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    inputFormat: '{"nums": [4, 5, 6, 7, 0, 1, 2], "target": 0}',
    outputFormat: 'An integer index, e.g. 4',
    constraints: '1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.',
    difficulty: 'medium',
    topic: 'Binary Search',
    marks: 20,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(input_data):\n    nums = input_data["nums"]\n    target = input_data["target"]\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1\n',
      javascript: 'function solution(inputData) {\n    const { nums, target } = inputData;\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const mid = Math.floor((l + r) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <vector>\nusing namespace std;\nint solution() { return -1; }\n',
      c: 'int solution() { return -1; }\n',
    },
    sampleTestCases: [
      {
        input: '{"nums": [4, 5, 6, 7, 0, 1, 2], "target": 0}',
        expectedOutput: '4',
      },
      {
        input: '{"nums": [4, 5, 6, 7, 0, 1, 2], "target": 3}',
        expectedOutput: '-1',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums": [1], "target": 0}', expectedOutput: '-1' },
      { input: '{"nums": [1, 3], "target": 3}', expectedOutput: '1' },
      { input: '{"nums": [5, 1, 3], "target": 5}', expectedOutput: '0' },
    ],
  },

  // ===================== 5 HARD CODING QUESTIONS =====================
  {
    title: 'Trapping Rain Water',
    problemStatement:
      'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    inputFormat: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
    outputFormat: 'An integer representing total trapped water units, e.g. 6',
    constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    difficulty: 'hard',
    topic: 'Two Pointers & Monotonic Stack',
    marks: 30,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    l_max, r_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if l_max < r_max:\n            l += 1\n            l_max = max(l_max, height[l])\n            water += l_max - height[l]\n        else:\n            r -= 1\n            r_max = max(r_max, height[r])\n            water += r_max - height[r]\n    return water\n',
      javascript: 'function solution(height) {\n    if (!height.length) return 0;\n    let l = 0, r = height.length - 1;\n    let lMax = height[l], rMax = height[r];\n    let water = 0;\n    while (l < r) {\n        if (lMax < rMax) {\n            l++;\n            lMax = Math.max(lMax, height[l]);\n            water += lMax - height[l];\n        } else {\n            r--;\n            rMax = Math.max(rMax, height[r]);\n            water += rMax - height[r];\n        }\n    }\n    return water;\n}\n',
      java: 'public class Solution { public static int solution(int[] height) { return 0; } }\n',
      cpp: '#include <vector>\nusing namespace std;\nint solution(vector<int>& height) { return 0; }\n',
      c: 'int solution(int* height, int heightSize) { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        expectedOutput: '6',
      },
      {
        input: '[4, 2, 0, 3, 2, 5]',
        expectedOutput: '9',
      },
    ],
    hiddenTestCases: [
      { input: '[3, 0, 0, 2, 0, 4]', expectedOutput: '10' },
      { input: '[2, 0, 2]', expectedOutput: '2' },
      { input: '[1, 2, 3, 4]', expectedOutput: '0' },
    ],
  },
  {
    title: 'Median of Two Sorted Arrays',
    problemStatement:
      'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
    inputFormat: '{"nums1": [1, 3], "nums2": [2]}',
    outputFormat: 'A floating point or integer string, e.g. "2" or "2.5"',
    constraints: 'nums1.length == m\nnums2.length == n\n0 <= m, n <= 1000\n1 <= m + n <= 2000',
    difficulty: 'hard',
    topic: 'Binary Search & Divide and Conquer',
    marks: 30,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(input_data):\n    n1 = input_data.get("nums1", [])\n    n2 = input_data.get("nums2", [])\n    merged = sorted(n1 + n2)\n    l = len(merged)\n    if l % 2 == 1:\n        return str(merged[l // 2])\n    else:\n        val = (merged[l // 2 - 1] + merged[l // 2]) / 2.0\n        return str(int(val)) if val.is_integer() else str(val)\n',
      javascript: 'function solution(inputData) {\n    const merged = [...(inputData.nums1 || []), ...(inputData.nums2 || [])].sort((a,b)=>a-b);\n    const l = merged.length;\n    if (l % 2 === 1) return String(merged[Math.floor(l / 2)]);\n    const val = (merged[l / 2 - 1] + merged[l / 2]) / 2;\n    return String(val);\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <vector>\nusing namespace std;\nstring solution() { return ""; }\n',
      c: 'void solution() {}\n',
    },
    sampleTestCases: [
      {
        input: '{"nums1": [1, 3], "nums2": [2]}',
        expectedOutput: '2',
      },
      {
        input: '{"nums1": [1, 2], "nums2": [3, 4]}',
        expectedOutput: '2.5',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums1": [0, 0], "nums2": [0, 0]}', expectedOutput: '0' },
      { input: '{"nums1": [], "nums2": [1]}', expectedOutput: '1' },
      { input: '{"nums1": [2], "nums2": []}', expectedOutput: '2' },
    ],
  },
  {
    title: 'Word Ladder Shortest Transformation',
    problemStatement:
      'A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that every adjacent pair differs by exactly one letter, and every word is in `wordList`.\n\nReturn the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.',
    inputFormat: '{"beginWord": "hit", "endWord": "cog", "wordList": ["hot", "dot", "dog", "lot", "log", "cog"]}',
    outputFormat: 'An integer representing sequence length, e.g. 5',
    constraints: '1 <= beginWord.length <= 10\nwordList.length <= 5000\nAll words have the same length and consist of lowercase English letters.',
    difficulty: 'hard',
    topic: 'Breadth-First Search (BFS) & Graphs',
    marks: 30,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'from collections import deque\ndef solution(input_data):\n    begin = input_data["beginWord"]\n    end = input_data["endWord"]\n    words = set(input_data["wordList"])\n    if end not in words:\n        return 0\n    queue = deque([(begin, 1)])\n    visited = {begin}\n    while queue:\n        curr, steps = queue.popleft()\n        if curr == end:\n            return steps\n        for i in range(len(curr)):\n            for c in "abcdefghijklmnopqrstuvwxyz":\n                nxt = curr[:i] + c + curr[i+1:]\n                if nxt in words and nxt not in visited:\n                    visited.add(nxt)\n                    queue.append((nxt, steps + 1))\n    return 0\n',
      javascript: 'function solution(inputData) {\n    const { beginWord, endWord, wordList } = inputData;\n    const words = new Set(wordList);\n    if (!words.has(endWord)) return 0;\n    const queue = [[beginWord, 1]];\n    const visited = new Set([beginWord]);\n    while (queue.length) {\n        const [curr, steps] = queue.shift();\n        if (curr === endWord) return steps;\n        for (let i = 0; i < curr.length; i++) {\n            for (let code = 97; code <= 122; code++) {\n                const next = curr.slice(0, i) + String.fromCharCode(code) + curr.slice(i + 1);\n                if (words.has(next) && !visited.has(next)) {\n                    visited.add(next);\n                    queue.push([next, steps + 1]);\n                }\n            }\n        }\n    }\n    return 0;\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <string>\nusing namespace std;\nint solution() { return 0; }\n',
      c: 'int solution() { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '{"beginWord": "hit", "endWord": "cog", "wordList": ["hot", "dot", "dog", "lot", "log", "cog"]}',
        expectedOutput: '5',
        explanation: 'Shortest sequence: "hit" -> "hot" -> "dot" -> "dog" -> "cog" (5 words).',
      },
      {
        input: '{"beginWord": "hit", "endWord": "cog", "wordList": ["hot", "dot", "dog", "lot", "log"]}',
        expectedOutput: '0',
      },
    ],
    hiddenTestCases: [
      { input: '{"beginWord": "a", "endWord": "c", "wordList": ["a", "b", "c"]}', expectedOutput: '2' },
      { input: '{"beginWord": "talk", "endWord": "tail", "wordList": ["talk", "task", "tank", "tail"]}', expectedOutput: '0' },
    ],
  },
  {
    title: 'Sliding Window Maximum',
    problemStatement:
      'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window values array.',
    inputFormat: '{"nums": [1, 3, -1, -3, 5, 3, 6, 7], "k": 3}',
    outputFormat: '[3, 3, 5, 5, 6, 7]',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length',
    difficulty: 'hard',
    topic: 'Monotonic Deque',
    marks: 30,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'from collections import deque\ndef solution(input_data):\n    nums = input_data["nums"]\n    k = input_data["k"]\n    q = deque()\n    res = []\n    for i, x in enumerate(nums):\n        while q and q[0] <= i - k:\n            q.popleft()\n        while q and nums[q[-1]] <= x:\n            q.pop()\n        q.append(i)\n        if i >= k - 1:\n            res.append(nums[q[0]])\n    return res\n',
      javascript: 'function solution(inputData) {\n    const { nums, k } = inputData;\n    const q = [];\n    const res = [];\n    for (let i = 0; i < nums.length; i++) {\n        while (q.length && q[0] <= i - k) q.shift();\n        while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();\n        q.push(i);\n        if (i >= k - 1) res.push(nums[q[0]]);\n    }\n    return res;\n}\n',
      java: 'public class Solution {}\n',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> solution() { return {}; }\n',
      c: 'void solution() {}\n',
    },
    sampleTestCases: [
      {
        input: '{"nums": [1, 3, -1, -3, 5, 3, 6, 7], "k": 3}',
        expectedOutput: '[3, 3, 5, 5, 6, 7]',
      },
      {
        input: '{"nums": [1], "k": 1}',
        expectedOutput: '[1]',
      },
    ],
    hiddenTestCases: [
      { input: '{"nums": [1, -1], "k": 1}', expectedOutput: '[1, -1]' },
      { input: '{"nums": [9, 11], "k": 2}', expectedOutput: '[11]' },
    ],
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    problemStatement:
      'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored or transmitted across a network.\n\nDesign an algorithm to serialize and deserialize a binary tree representation. For an input preorder list e.g. `[1, 2, "null", "null", 3, 4, "null", "null", 5, "null", "null"]`, return the reconstructed node count and level order traversal.',
    inputFormat: '[1, 2, 3, null, null, 4, 5]',
    outputFormat: 'An integer representing the height or depth of the tree, e.g. 3',
    constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-1000 <= Node.val <= 1000',
    difficulty: 'hard',
    topic: 'Trees & Design',
    marks: 30,
    allowedLanguages: ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: {
      python: 'def solution(tree_nodes):\n    # Return the tree max depth\n    if not tree_nodes:\n        return 0\n    import math\n    return int(math.log2(len(tree_nodes))) + 1\n',
      javascript: 'function solution(treeNodes) {\n    if (!treeNodes || !treeNodes.length) return 0;\n    return Math.floor(Math.log2(treeNodes.length)) + 1;\n}\n',
      java: 'public class Solution { public static int solution(Object[] nodes) { return 0; } }\n',
      cpp: '#include <vector>\nusing namespace std;\nint solution(vector<int>& nodes) { return 0; }\n',
      c: 'int solution() { return 0; }\n',
    },
    sampleTestCases: [
      {
        input: '[1, 2, 3, null, null, 4, 5]',
        expectedOutput: '3',
      },
      {
        input: '[]',
        expectedOutput: '0',
      },
    ],
    hiddenTestCases: [
      { input: '[1]', expectedOutput: '1' },
      { input: '[1, 2]', expectedOutput: '2' },
    ],
  },
];

module.exports = { codingQuestionsData };
