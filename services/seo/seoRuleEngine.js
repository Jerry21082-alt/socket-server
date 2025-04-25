const { getSuggestion } = require("../../utils/getSuggestions");
const { evaluateCheck } = require("../../utils/evaluateCheck");

function runSeoChecks(data, checks) {
  const result = {};

  for (const category in checks) {
    result[category] = checks[category].map((check) => {
      const passed = evaluateCheck(check, data);
      const suggestion = passed ? "" : getSuggestion(category, check);
      return {
        check,
        pass: passed,
        suggestion,
        category,
      };
    });
  }

  return result;
}

module.exports = { runSeoChecks };
