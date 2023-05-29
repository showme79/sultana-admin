const logEnabled = process.env.NODE_ENV === 'development';

/**
 * This is a default logger which wraps all the native console interface.
 * It is used to allow easy overriding of the native console behaviour.
 */
function ConsoleLogger(origConsole = (global || window).console) {
  return {
    ...origConsole,
    log: (...args) => (logEnabled ? origConsole.log(...args) : undefined),
    info: (...args) => (logEnabled ? origConsole.info(...args) : undefined),
    warn: (...args) => (logEnabled ? origConsole.warn(...args) : undefined),
    error: (...args) => (logEnabled ? origConsole.error(...args) : undefined),
    group: (...args) => (logEnabled ? origConsole.group(...args) : undefined),
    groupCollapsed: (...args) => (logEnabled ? origConsole.groupCollapsed(...args) : undefined),
  };
}

export default ConsoleLogger;
