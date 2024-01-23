const colours = {
  type: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
  },

  main: {
    red: "\x1b[1;38;5;196m",
    green: "\x1b[1;38;5;47m",
    blue: "\x1b[1;38;5;45m",
    yellow: "\x1b[1;38;5;226m",
    violet: "\x1b[1;38;5;165m",
    orange: "\x1b[1;38;5;202m",
    white: "\x1b[1;38;5;256m",
  },

  http: {
    GET: "\x1b[1;38;5;47m",
    POST: "\x1b[1;38;5;226m",
    PATCH: "\x1b[1;38;5;202m",
    DELETE: "\x1b[1;38;5;196m",
    OPTIONS: "\x1b[1;38;5;165m",
  },

  code: code => {
    if ([200, 201, 202, 204].includes(+code))
      return "\x1b[1;38;5;47m";
    else if ([400, 401, 403, 404, 500, 502].includes(+code))
      return "\x1b[1;38;5;196m";
    else return "\x1b[1;38;5;45m";
  }
};

const symbols = {
  info: 'ℹ',
  warn: '⚠',
  error: '✖',
  success: '✔',
  fatal: '☢',
  debug: '⛏',
  http: '✉'
}

const datestring = date =>
  ("0" + date.getDate()).slice(-2)
  + "-" + ("0" + (date.getMonth() + 1)).slice(-2)
  + "-" + (`${date.getFullYear()}`.slice(2))
  + " " + ("0" + date.getHours()).slice(-2)
  + ":" + ("0" + date.getMinutes()).slice(-2)
  + ":" + ("0" + date.getSeconds()).slice(-2);

const log = (color, symbol, message, type = colours.bright) =>
  console.log(`${colours.type.bright}${datestring(new Date())}|\x1b[0m ${colours.main[color]}${symbols[symbol]} ${type ? type : ''}${message}\x1b[0m`);

const info = text => log('blue', 'info', text);
const warn = text => log('yellow', 'warn', text, colours.type.italic);
const error = text => log('red', 'error', text);
const success = text => log('green', 'success', text);
const debug = text => log('orange', 'debug', text);
const fatal = text => log('violet', 'fatal', text);

const http = message => {
  const {
    method,
    url,
    status,
    content_length,
    response_time
  } = JSON.parse(message);

  log(
    'white',
    'http',
    `${colours.http[method]}${method}\x1b[0m \x1b[4m${url}\x1b[0m ${colours.code(status)}${status}\x1b[0m ${content_length} - \x1b[1;38;5;226m${response_time}\x1b[0m ⏲ ms`
  );
}

module.exports = { colours, error, warn, success, info, fatal, http, debug };
