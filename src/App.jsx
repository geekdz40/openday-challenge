import { useEffect, useMemo, useState } from 'react';

function executeCode(code, funcName, testCases) {
  try {
    const func = new Function(code + `; return ${funcName};`)();
    const results = testCases.map(args => {
      try {
        return { result: func(...args), expected: args[args.length - 1], args: args.slice(0, -1) };
      } catch (e) {
        return { error: e.message, args: args.slice(0, -1) };
      }
    });
    return results;
  } catch (e) {
    return { syntaxError: e.message };
  }
}

function allTestsPass(results) {
  if (results.syntaxError) return false;
  return results.every(r => !r.error && JSON.stringify(r.result) === JSON.stringify(r.expected));
}

function App() {
  const [allQuestions] = useState([
    // 🔧 برمجة - تصحيح الأخطاء
    {
      title: 'Fix The Sum Function',
      prompt: 'The following function contains a bug. Write the corrected version:',
      starter: 'function sum(a, b) {\n  return a - b;\n}',
      funcName: 'sum',
      testCases: [[2, 3, 5], [0, 0, 0], [10, 5, 15], [-1, 1, 0]],
      category: 'programming'
    },
    {
      title: 'Fix Subtraction Function',
      prompt: 'Fix the function so it subtracts b from a:',
      starter: 'function sub(a, b) {\n  return b - a;\n}',
      funcName: 'sub',
      testCases: [[10, 3, 7], [5, 5, 0], [0, 5, -5], [100, 1, 99]],
      category: 'programming'
    },
    {
      title: 'Fix Comparison Logic',
      prompt: 'Fix the condition so the function returns the larger value:',
      starter: 'function max2(a, b) {\n  if (a < b) return a;\n  return b;\n}',
      funcName: 'max2',
      testCases: [[5, 10, 10], [20, 5, 20], [7, 7, 7], [-1, -2, -1]],
      category: 'programming'
    },
    {
      title: 'Fix String Length',
      prompt: 'Fix the function so it correctly returns string length:',
      starter: 'function getLength(str) {\n  return str.length();\n}',
      funcName: 'getLength',
      testCases: [['hello', 5], ['', 0], ['test', 4], ['ab', 2]],
      category: 'programming'
    },
    {
      title: 'Fix The Loop',
      prompt: 'Fix the loop so it prints numbers from 1 to 5:',
      starter: 'let output = [];\nfor (let i = 1; i >= 5; i++) {\n  output.push(i);\n}\nfunction getLoop() { return output; }',
      funcName: 'getLoop',
      testCases: [[[], [1, 2, 3, 4, 5]]],
      category: 'programming'
    },
    {
      title: 'Strict Equality Check',
      prompt: 'Fix the line to use strict equality:',
      starter: 'function checkStrict(x) {\n  if (x == 10) {\n    return true;\n  }\n  return false;\n}',
      funcName: 'checkStrict',
      testCases: [[10, true], ['10', false], [9, false], [10.0, true]],
      category: 'programming'
    },

    // 📝 برمجة - كتابة دوال
    {
      title: 'Write Even/Odd Checker',
      prompt: 'Write a JavaScript function that returns true for even numbers and false for odd numbers:',
      starter: 'function isEven(n) {\n  // write your solution\n}',
      funcName: 'isEven',
      testCases: [[2, true], [3, false], [0, true], [100, true], [99, false]],
      category: 'programming'
    },
    {
      title: 'Array Sum',
      prompt: 'Write a function that returns the sum of all elements in numbers:',
      starter: 'function arraySum(numbers) {\n  // write your solution\n}',
      funcName: 'arraySum',
      testCases: [[[1, 2, 3], 6], [[0], 0], [[5, 10, 15, 20], 50], [[-1, 1, -2, 2], 0]],
      category: 'programming'
    },
    {
      title: 'Reverse A String',
      prompt: 'Write a function that returns the reversed text:',
      starter: 'function reverseText(text) {\n  // write your solution\n}',
      funcName: 'reverseText',
      testCases: [['hello', 'olleh'], ['abc', 'cba'], ['a', 'a'], ['test', 'tset']],
      category: 'programming'
    },
    {
      title: 'Check If Value Exists',
      prompt: 'Write a function that returns true if value exists inside arr:',
      starter: 'function contains(arr, value) {\n  // write your solution\n}',
      funcName: 'contains',
      testCases: [[[1, 2, 3], 2, true], [[1, 2, 3], 4, false], [[], 0, false], [["a", "b"], "a", true]],
      category: 'programming'
    },
    {
      title: 'Convert To Uppercase',
      prompt: 'Write a function that converts text to uppercase:',
      starter: 'function toUpper(text) {\n  // write your solution\n}',
      funcName: 'toUpper',
      testCases: [['hello', 'HELLO'], ['test', 'TEST'], ['ABC', 'ABC'], ['a', 'A']],
      category: 'programming'
    },
    {
      title: 'Max In Array',
      prompt: 'Write a function that returns the maximum number in nums:',
      starter: 'function maxInArray(nums) {\n  // write your solution\n}',
      funcName: 'maxInArray',
      testCases: [[[1, 5, 3], 5], [[10, 2, 8], 10], [[0, -1, -5], 0], [[100], 100]],
      category: 'programming'
    },
    {
      title: 'Count Array Elements',
      prompt: 'Write a function that returns the number of elements in arr:',
      starter: 'function countElements(arr) {\n  // write your solution\n}',
      funcName: 'countElements',
      testCases: [[[1, 2, 3], 3], [[], 0], [['a', 'b', 'c', 'd'], 4], [[100, 200], 2]],
      category: 'programming'
    },
    {
      title: 'Check If Palindrome',
      prompt: 'Write a function that returns true if text is a palindrome (reads same forwards and backwards):',
      starter: 'function isPalindrome(text) {\n  // write your solution\n}',
      funcName: 'isPalindrome',
      testCases: [['racecar', true], ['hello', false], ['a', true], ['level', true], ['test', false]],
      category: 'programming'
    },
    {
      title: 'Factorial Calculator',
      prompt: 'Write a function that returns the factorial of n (n!):',
      starter: 'function factorial(n) {\n  // write your solution\n}',
      funcName: 'factorial',
      testCases: [[5, 120], [3, 6], [1, 1], [0, 1], [4, 24]],
      category: 'programming'
    },
    {
      title: 'Filter Even Numbers',
      prompt: 'Write a function that returns only the even numbers from arr:',
      starter: 'function filterEven(arr) {\n  // write your solution\n}',
      funcName: 'filterEven',
      testCases: [[[1, 2, 3, 4, 5], [2, 4]], [[1, 3, 5], []], [[2, 4, 6], [2, 4, 6]], [[10, 11, 12], [10, 12]]],
      category: 'programming'
    },

    // 🔢 رياضيات - معادلات
    {
      title: 'Solve Linear Equation',
      prompt: 'Solve: 2x + 5 = 13. What is x?',
      starter: 'function solveLinear() {\n  // write your solution\n  return x;\n}',
      funcName: 'solveLinear',
      testCases: [[[], 4]],
      category: 'math'
    },
    {
      title: 'Quadratic Equation Solution',
      prompt: 'Solve: x² - 5x + 6 = 0. Return the two solutions as an array:',
      starter: 'function solveQuadratic() {\n  // write your solution\n  return [x1, x2];\n}',
      funcName: 'solveQuadratic',
      testCases: [[[], [2, 3]]],
      category: 'math'
    },
    {
      title: 'System of Equations',
      prompt: 'Solve the system:\n2x + y = 5\nx - y = 1\nReturn [x, y]:',
      starter: 'function solveSystem() {\n  // 2x + y = 5\n  // x - y = 1\n  return [x, y];\n}',
      funcName: 'solveSystem',
      testCases: [[[], [2, 1]]],
      category: 'math'
    },
    {
      title: 'Calculate Perimeter',
      prompt: 'Write a function that calculates the perimeter of a rectangle (P = 2(l + w)):',
      starter: 'function perimeter(length, width) {\n  // write your solution\n}',
      funcName: 'perimeter',
      testCases: [[5, 3, 16], [10, 10, 40], [7, 2, 18], [1, 1, 4]],
      category: 'math'
    },
    {
      title: 'Calculate Area of Circle',
      prompt: 'Write a function that calculates the area of a circle (A = πr²):',
      starter: 'function circleArea(radius) {\n  // write your solution\n}',
      funcName: 'circleArea',
      testCases: [[1, 3.14159265], [2, 12.56637], [5, 78.53981], [10, 314.15926]],
      category: 'math'
    },

    // 📊 رياضيات - متتاليات
    {
      title: 'Arithmetic Sequence (nth term)',
      prompt: 'Find the 10th term of arithmetic sequence: 2, 5, 8, 11, ...\nFormula: an = a₁ + (n-1)d',
      starter: 'function nthTerm(n) {\n  // a1 = 2, d = 3, find term at position n\n  return term;\n}',
      funcName: 'nthTerm',
      testCases: [[10, 29], [1, 2], [5, 14], [3, 8]],
      category: 'sequence'
    },
    {
      title: 'Geometric Sequence',
      prompt: 'Find the 6th term of geometric sequence: 3, 6, 12, 24, ...\nFormula: an = a₁ × r^(n-1)',
      starter: 'function geometricTerm(n) {\n  // a1 = 3, r = 2, find term at position n\n  return term;\n}',
      funcName: 'geometricTerm',
      testCases: [[6, 96], [1, 3], [4, 24], [5, 48]],
      category: 'sequence'
    },
    {
      title: 'Fibonacci Sequence',
      prompt: 'Return the nth Fibonacci number (starts with 1, 1, 2, 3, 5, 8, ...):',
      starter: 'function fibonacci(n) {\n  // write your solution\n}',
      funcName: 'fibonacci',
      testCases: [[6, 8], [1, 1], [5, 5], [7, 13], [8, 21]],
      category: 'sequence'
    },
    {
      title: 'Sum of Arithmetic Series',
      prompt: 'Find the sum of first 5 terms: 2 + 5 + 8 + 11 + 14\nFormula: S = n/2 × (a₁ + an)',
      starter: 'function sumArithmetic(n) {\n  // a1 = 2, d = 3, find sum of first n terms\n  return sum;\n}',
      funcName: 'sumArithmetic',
      testCases: [[5, 40], [1, 2], [3, 12], [4, 26]],
      category: 'sequence'
    },
    {
      title: 'Sum of Geometric Series',
      prompt: 'Find sum of first 4 terms: 1 + 2 + 4 + 8\nFormula: S = a₁ × (1 - r^n) / (1 - r)',
      starter: 'function sumGeometric(n) {\n  // a1 = 1, r = 2, find sum of first n terms\n  return sum;\n}',
      funcName: 'sumGeometric',
      testCases: [[4, 15], [1, 1], [3, 7], [5, 31]],
      category: 'sequence'
    },

    // 🧮 رياضيات - متقدم
    {
      title: 'Power Function',
      prompt: 'Write a function that calculates a to the power of b (a^b):',
      starter: 'function power(a, b) {\n  // write your solution\n}',
      funcName: 'power',
      testCases: [[2, 3, 8], [5, 2, 25], [10, 3, 1000], [2, 0, 1], [3, 3, 27]],
      category: 'math'
    },
    {
      title: 'Greatest Common Divisor (GCD)',
      prompt: 'Write a function that finds the GCD of two numbers:',
      starter: 'function gcd(a, b) {\n  // write your solution\n}',
      funcName: 'gcd',
      testCases: [[12, 8, 4], [21, 14, 7], [100, 50, 50], [17, 19, 1]],
      category: 'math'
    },
    {
      title: 'Prime Number Checker',
      prompt: 'Write a function that returns true if n is a prime number:',
      starter: 'function isPrime(n) {\n  // write your solution\n}',
      funcName: 'isPrime',
      testCases: [[2, true], [3, true], [4, false], [17, true], [20, false], [1, false]],
      category: 'math'
    },
    {
      title: 'Absolute Value',
      prompt: 'Write a function that returns the absolute value of n:',
      starter: 'function abs(n) {\n  // write your solution\n}',
      funcName: 'abs',
      testCases: [[-5, 5], [10, 10], [-100, 100], [0, 0], [3.5, 3.5]],
      category: 'math'
    },
    {
      title: 'Average Calculator',
      prompt: 'Write a function that calculates the average of numbers in an array:',
      starter: 'function average(numbers) {\n  // write your solution\n}',
      funcName: 'average',
      testCases: [[[1, 2, 3, 4, 5], 3], [[10, 20], 15], [[100], 100], [[5, 5, 5], 5]],
      category: 'math'
    }
  ]);

  const [pickedQuestions, setPickedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('Intro');
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentQuestion = useMemo(() => pickedQuestions[currentIndex], [pickedQuestions, currentIndex]);

  function startGame() {
    // تجميع الأسئلة حسب الفئة
    const programmiing = allQuestions.filter(q => q.category === 'programming');
    const math = allQuestions.filter(q => q.category === 'math');
    const sequence = allQuestions.filter(q => q.category === 'sequence');
    
    // اختيار سؤال عشوائي من كل فئة
    const selected = [];
    if (programmiing.length > 0) selected.push(programmiing[Math.floor(Math.random() * programmiing.length)]);
    if (math.length > 0) selected.push(math[Math.floor(Math.random() * math.length)]);
    if (sequence.length > 0) selected.push(sequence[Math.floor(Math.random() * sequence.length)]);
    
    // خلط الأسئلة المختارة
    const shuffled = selected.sort(() => Math.random() - 0.5);

    setPickedQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswerInput(shuffled[0]?.starter || '');
    setFeedback('');
    setGameState('Playing');
  }

  function checkAnswer() {
    if (!currentQuestion) {
      return;
    }

    const results = executeCode(answerInput, currentQuestion.funcName, currentQuestion.testCases);
    const isCorrect = allTestsPass(results);

    if (!isCorrect) {
      if (results.syntaxError) {
        setFeedback(`Syntax Error: ${results.syntaxError}`);
      } else {
        const failedTest = results.find(r => r.error || JSON.stringify(r.result) !== JSON.stringify(r.expected));
        if (failedTest) {
          setFeedback(`Test failed: got ${JSON.stringify(failedTest.result)}, expected ${JSON.stringify(failedTest.expected)}`);
        } else {
          setFeedback('Wrong solution. Attempt ended.');
        }
      }
      setGameState('Lost');
      return;
    }

    const nextScore = score + 1;
    setScore(nextScore);
    setFeedback('All tests passed! Correct solution!');

    if (nextScore === 3) {
      setGameState('Won');
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswerInput(pickedQuestions[nextIndex]?.starter || '');
  }

  useEffect(() => {
    if (gameState !== 'Won') {
      return;
    }

    const applause = new Audio('https://www.soundjay.com/human_c2026/applause-2.mp3');
    applause.autoplay = true;
    applause.play().catch(() => {
      // Some browsers may block autoplay without prior interaction.
    });

    return () => {
      applause.pause();
      applause.currentTime = 0;
    };
  }, [gameState]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-4xl rounded-3xl border border-zinc-800/80 bg-darkB/90 backdrop-blur-xl shadow-glow overflow-hidden">
        <div className="h-1.5 bg-gradient-to-l from-rhRed via-red-500 to-transparent" />

        <div className="p-6 md:p-10">
          {gameState === 'Intro' && (
            <div className="space-y-6 text-center">
              <img src="/logo.png" alt="Coding Challenge" className="mx-auto h-24 object-contain mb-4" />
              
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rhRed/40 text-rhRed bg-rhRed/10 text-sm">
                <i className="bx bx-code-alt text-lg" /> Problem Solving Challenge
              </p>

              <h1 className="text-3xl md:text-4xl font-extrabold leading-relaxed">
                Fix Code Or Write The Correct Solution To Win
              </h1>

              <p className="text-zinc-300 leading-8">
                3 random coding challenges will be selected. Each challenge requires a correct JavaScript
                solution. One wrong answer means you lose immediately. Solve 3 out of 3 to win.
              </p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                Start Challenge <i className="bx bx-play-circle text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Playing' && currentQuestion && (
            <div className="space-y-6">
              <header className="flex items-center justify-between text-sm text-zinc-300">
                <div className="font-semibold">Challenge {currentIndex + 1} of 3</div>
                <div className="px-3 py-1 rounded-lg bg-darkC border border-zinc-800">Score: {score}</div>
              </header>

              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-rhRed transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / 3) * 100}%` }}
                />
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-darkC p-4">
                <h2 className="text-xl font-bold mb-2">{currentQuestion.title}</h2>
                <p className="text-zinc-300 mb-4 leading-7">{currentQuestion.prompt}</p>

                <textarea
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="w-full min-h-56 rounded-xl border border-zinc-700 bg-zinc-950/80 p-4 font-mono text-sm leading-7 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rhRed"
                  spellCheck={false}
                />
              </div>

              {feedback && (
                <p className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                  {feedback}
                </p>
              )}

              <button
                onClick={checkAnswer}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                Check Solution <i className="bx bx-check-circle text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Lost' && (
            <div className="space-y-6 text-center">
              <i className="bx bx-x-circle text-9xl text-rhRed" />
              <h2 className="text-3xl font-extrabold">Incorrect Solution</h2>
              <p className="text-zinc-300 leading-8">Try again. You need 3 correct answers in a row to win.</p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                Retry <i className="bx bx-refresh text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Won' && (
            <div className="space-y-6 text-center">
              <i className="bx bx-trophy text-9xl text-rhRed" />
              
              <img 
                src="/Logo-Red_Hat-Academy-A-Standard-RGB.png" 
                alt="Red Hat Academy" 
                className="mx-auto h-20 object-contain"
              />

              <h2 className="text-3xl md:text-4xl font-extrabold leading-relaxed text-white">
                Congratulations! All solutions are correct.
              </h2>

              <p className="text-lg text-emerald-300">
                You've earned a free subscription to Red Hat Academy!
              </p>

              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
                <i className="bx bx-check-circle text-xl" /> 3/3 Correct Solutions
              </p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                Play Again <i className="bx bx-refresh text-xl" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
