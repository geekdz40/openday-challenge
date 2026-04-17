const { useEffect, useMemo, useState } = React;

function normalizeCode(value) {
  return value.replace(/\s+/g, '').replace(/;+$/g, '').trim();
}

function App() {
  const [allQuestions] = useState([
    {
      title: 'صحح دالة جمع رقمين',
      prompt: 'الكود التالي فيه خطأ. اكتب النسخة الصحيحة للدالة:',
      starter: 'function sum(a, b) {\n  return a - b;\n}',
      expected: 'function sum(a, b) {\n  return a + b;\n}'
    },
    {
      title: 'اكتب دالة زوجي/فردي',
      prompt: 'اكتب دالة JavaScript تُرجع true إذا كان الرقم زوجي، و false إذا كان فردي:',
      starter: 'function isEven(n) {\n  // اكتب الحل\n}',
      expected: 'function isEven(n) {\n  return n % 2 === 0;\n}'
    },
    {
      title: 'تصحيح شرط المقارنة',
      prompt: 'صحح الشرط حتى تُرجع الدالة القيمة الأكبر:',
      starter: 'function max2(a, b) {\n  if (a < b) return a;\n  return b;\n}',
      expected: 'function max2(a, b) {\n  if (a > b) return a;\n  return b;\n}'
    },
    {
      title: 'حساب مجموع مصفوفة',
      prompt: 'اكتب دالة ترجع مجموع عناصر مصفوفة numbers:',
      starter: 'function arraySum(numbers) {\n  // اكتب الحل\n}',
      expected: 'function arraySum(numbers) {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}'
    },
    {
      title: 'عكس نص',
      prompt: 'اكتب دالة ترجع النص بالعكس:',
      starter: 'function reverseText(text) {\n  // اكتب الحل\n}',
      expected: "function reverseText(text) {\n  return text.split('').reverse().join('');\n}"
    },
    {
      title: 'تصحيح حلقة التكرار',
      prompt: 'صحح الحلقة لتطبع الأرقام من 1 إلى 5:',
      starter: 'for (let i = 1; i >= 5; i++) {\n  console.log(i);\n}',
      expected: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}'
    },
    {
      title: 'التحقق من وجود عنصر',
      prompt: 'اكتب دالة تعيد true إذا كان value موجودًا داخل arr:',
      starter: 'function contains(arr, value) {\n  // اكتب الحل\n}',
      expected: 'function contains(arr, value) {\n  return arr.includes(value);\n}'
    },
    {
      title: 'تصحيح دالة الطول',
      prompt: 'صحح الدالة بحيث تُرجع طول النص بشكل صحيح:',
      starter: 'function getLength(str) {\n  return str.length();\n}',
      expected: 'function getLength(str) {\n  return str.length;\n}'
    },
    {
      title: 'تحويل الحروف لكابتل',
      prompt: 'اكتب دالة تحول النص إلى أحرف كبيرة:',
      starter: 'function toUpper(text) {\n  // اكتب الحل\n}',
      expected: 'function toUpper(text) {\n  return text.toUpperCase();\n}'
    },
    {
      title: 'تصحيح المقارنة الصارمة',
      prompt: 'صحح السطر ليستخدم مقارنة صارمة:',
      starter: 'if (x == 10) {\n  return true;\n}',
      expected: 'if (x === 10) {\n  return true;\n}'
    },
    {
      title: 'العدد الأكبر في مصفوفة',
      prompt: 'اكتب دالة ترجع أكبر رقم في مصفوفة nums:',
      starter: 'function maxInArray(nums) {\n  // اكتب الحل\n}',
      expected: 'function maxInArray(nums) {\n  return Math.max(...nums);\n}'
    },
    {
      title: 'تصحيح دالة الطرح',
      prompt: 'صحح الدالة لتطرح b من a:',
      starter: 'function sub(a, b) {\n  return b - a;\n}',
      expected: 'function sub(a, b) {\n  return a - b;\n}'
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
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    setPickedQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setAnswerInput(selected[0]?.starter || '');
    setFeedback('');
    setGameState('Playing');
  }

  function checkAnswer() {
    if (!currentQuestion) {
      return;
    }

    const isCorrect = normalizeCode(answerInput) === normalizeCode(currentQuestion.expected);

    if (!isCorrect) {
      setFeedback('الإجابة غير صحيحة. انتهت المحاولة.');
      setGameState('Lost');
      return;
    }

    const nextScore = score + 1;
    setScore(nextScore);
    setFeedback('إجابة صحيحة!');

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
      // في حال قيود المتصفح على تشغيل الصوت.
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
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rhRed/40 text-rhRed bg-rhRed/10 text-sm">
                <i className="bx bx-code-alt text-lg" /> تحدي Problem Solving
              </p>

              <h1 className="text-3xl md:text-4xl font-extrabold leading-relaxed">
                أصلح الكود أو اكتب الحل الصحيح واربح
              </h1>

              <p className="text-zinc-300 leading-8">
                سيتم اختيار 3 تحديات عشوائية. كل تحدي يتطلب كتابة كود JavaScript صحيح. إذا أخطأت في أي تحدي
                تخسر مباشرة، وإذا أجبت 3/3 صحيح تربح.
              </p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                ابدأ التحدي <i className="bx bx-play-circle text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Playing' && currentQuestion && (
            <div className="space-y-6">
              <header className="flex items-center justify-between text-sm text-zinc-300">
                <div className="font-semibold">التحدي {currentIndex + 1} من 3</div>
                <div className="px-3 py-1 rounded-lg bg-darkC border border-zinc-800">النقاط: {score}</div>
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
                تحقق من الحل <i className="bx bx-check-circle text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Lost' && (
            <div className="space-y-6 text-center">
              <i className="bx bx-x-circle text-7xl text-rhRed" />
              <h2 className="text-3xl font-extrabold">للأسف، الحل غير صحيح</h2>
              <p className="text-zinc-300 leading-8">حاول مرة أخرى. يجب أن تكون إجاباتك الثلاثة صحيحة للفوز.</p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                إعادة المحاولة <i className="bx bx-refresh text-xl" />
              </button>
            </div>
          )}

          {gameState === 'Won' && (
            <div className="space-y-6 text-center">
              <i className="bx bx-trophy text-7xl text-rhRed" />
              <h2 className="text-3xl md:text-4xl font-extrabold leading-relaxed text-white">
                ممتاز! جميع الحلول صحيحة. لقد ربحت التحدي.
              </h2>

              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
                <i className="bx bx-check-circle text-xl" /> 3/3 حلول صحيحة
              </p>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-rhRed hover:bg-rose-700 transition-colors px-6 py-3 rounded-xl font-bold"
              >
                لعب جولة جديدة <i className="bx bx-refresh text-xl" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
