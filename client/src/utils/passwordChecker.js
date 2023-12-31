
/**
 * Scores a password's strength.
 *
 * It scores a password according to several factors like character variation,
 * repetition and length. The passwords are scored in a numeric point scale that
 * varies from less than 0 to 100 and more. A safe password score should be
 * considered as 49 points or more.
 *
 * @param {String} pwd The password string to score.
 *
 * @returns {Number} The password score.
 *
 * @see https://stackoverflow.com/questions/948172/password-strength-meter/11268104#11268104
 */
function scorePassword(pwd) {
  let check, ltr, i, l;
  let variation = 0;
  let letters = {};
  let score = 0;

  if (!pwd) {
    return score;
  }

  /* Score character variation */
  let variations = {
    lower: /[a-z]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    nonWords: /\W/.test(pwd),
    digits: /\d/.test(pwd)
  };

  for (check in variations) {
    variation += variations[check] ? 1 : 0;
  }

  score += (variation - 1) * 10;

  /* Score unique letters until 5 repetitions */
  for (i = 0, l = pwd.length; i < l; i++) {
    ltr = letters[pwd[i]] = (letters[pwd[i]] || 0) + 1;
    score += 5 / ltr;
  }

  /* Score length (about 8 chars for a safe password) */
  score -= 16 - (pwd.length / 16);

  return parseInt(score);
}

export default function passwordChecker(password) {
  let score = scorePassword(password);
  if (score > 80)
    return "strong";
  if (score > 60)
    return "good";
  if (score >= 30)
    return "weak";

  return "weak";
}