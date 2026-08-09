(function () {
  const storageKey = 'love-food-quiz-answers';

  // 六种结果分别代表不同的饭搭子倾向。逐题权重反映具体语境，
  // 整体选项占比则用于强化用户在六道题中反复表现出的选择倾向。
  const choiceAffinity = {
    A: [0, 1, 0, 0, 2, 2],
    B: [2, 1, 1, 0, 0, 2],
    C: [0, 0, 3, 0, 0, 0],
    D: [0, 0, 0, 2, 2, 0]
  };

  const scoreMap = {
    1: {
      A: [0, 0, 0, 0, 1, 3],
      B: [1, 2, 1, 0, 0, 0],
      C: [0, 0, 3, 0, 0, 0],
      D: [0, 0, 0, 1, 3, 0]
    },
    2: {
      A: [0, 2, 0, 3, 0, 0],
      B: [3, 0, 0, 0, 0, 1],
      C: [0, 0, 3, 0, 0, 0],
      D: [2, 0, 0, 0, 3, 0]
    },
    3: {
      A: [0, 0, 0, 0, 3, 1],
      B: [0, 0, 3, 0, 0, 0],
      C: [0, 1, 2, 0, 0, 0],
      D: [0, 2, 0, 3, 0, 0]
    },
    4: {
      A: [0, 0, 0, 0, 1, 3],
      B: [2, 0, 0, 0, 0, 1],
      C: [0, 0, 3, 0, 0, 0],
      D: [0, 0, 0, 3, 1, 0]
    },
    5: {
      A: [2, 0, 0, 0, 3, 0],
      B: [0, 3, 1, 0, 0, 0],
      C: [0, 0, 3, 0, 0, 0],
      D: [0, 0, 0, 0, 3, 0]
    },
    6: {
      A: [0, 2, 3, 0, 0, 0],
      B: [1, 0, 0, 0, 0, 3],
      C: [0, 0, 3, 0, 1, 0],
      D: [0, 0, 0, 1, 3, 0]
    }
  };

  function readAnswers() {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey)) || {};
    } catch (_) {
      return {};
    }
  }

  function writeAnswers(answers) {
    sessionStorage.setItem(storageKey, JSON.stringify(answers));
  }

  window.resetQuizAnswers = function () {
    sessionStorage.removeItem(storageKey);
  };

  window.recordQuizAnswer = function (question, choice) {
    if (!scoreMap[question] || !scoreMap[question][choice]) return;
    const answers = readAnswers();
    answers[question] = choice;
    writeAnswers(answers);
  };

  window.getQuizChoiceCounts = function () {
    const answers = readAnswers();
    return Object.values(answers).reduce((counts, choice) => {
      if (Object.prototype.hasOwnProperty.call(counts, choice)) {
        counts[choice] += 1;
      }
      return counts;
    }, { A: 0, B: 0, C: 0, D: 0 });
  };

  window.getQuizResult = function () {
    const answers = readAnswers();
    const scores = [0, 0, 0, 0, 0, 0];

    Object.keys(answers).forEach((question) => {
      const choice = answers[question];
      const weights = scoreMap[question] && scoreMap[question][choice];
      if (!weights) return;
      weights.forEach((weight, index) => {
        scores[index] += weight;
      });
    });

    const choiceCounts = window.getQuizChoiceCounts();
    const answerTotal = Object.values(choiceCounts).reduce((sum, count) => sum + count, 0);

    if (answerTotal > 0) {
      Object.keys(choiceCounts).forEach((choice) => {
        const proportion = choiceCounts[choice] / answerTotal;
        choiceAffinity[choice].forEach((affinity, index) => {
          scores[index] += proportion * affinity * 2;
        });
      });
    }

    const highest = Math.max(...scores);
    const finalists = scores
      .map((score, index) => ({ score, result: index + 1 }))
      .filter((item) => item.score === highest);

    if (finalists.length === 1) return finalists[0].result;

    const lastChoicePreference = { A: 2, B: 6, C: 3, D: 5 };
    const preferredResult = lastChoicePreference[answers[6]];
    const preferredFinalist = finalists.find((item) => item.result === preferredResult);
    return preferredFinalist ? preferredFinalist.result : finalists[0].result;
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get('new') === '1') {
    window.resetQuizAnswers();
  }
})();
