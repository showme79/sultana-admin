/* eslint-disable class-methods-use-this, no-console */
import { isArray, isObject } from 'lodash-es';

/**
 * A simple object which contains the module supported, available log levels.
 */
export const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

const DEFAULT_LOG_LEVEL = LogLevel.INFO;

const DEFAULT_FLUSH_INTERVAL = 60000;

const DEFAULT_FLUSH_LIMIT = 100;

const DEFAULT_VERSION = `v${process.env.REACT_APP_VERSION}`;

const DEFAULT_TRANSFORM = (message /* , idx, messages, logger */) => {
  // eslint-disable-line no-unused-vars
  if (isArray(message) || isObject(message)) {
    return JSON.stringify(message, null, 2);
  }
  return message;
};
const DEFAULT_TRANSPORT = (/* messages, logger */) => {}; // eslint-disable-line no-unused-vars

/**
 * A logger class which collects log entries, transforms them and flushes them periodically on a transport interface.
 * Flush conditions are the following:
 *   - periodically: when a given amount of time is elapsed
 *   - message limit exceeded: when a number of messages reached an upper limit
 *   - error: in case of `error` method is called (eg. exceptions).
 *
 * @param  {Object} options                 Configuration object for first parameter.
 * @param  {Function} options.transport     A transport function which is called when the log queue is flushed.
 * @param  {String} options.defaultLevel    The default log level when simple `log` function is called.
 * @param  {Function} options.transform     A transformer function which is called before a message is added to the log queue.
 * @param  {Number} options.flushInterval   The interval in milliseconds in which the log queue is flushed. If set to 0, no periodical flush will happen.
 * @param  {Number} options.flushLimit      The number of messages after the entries will be transferred. If set to 0, no message limit will be available.
 * @param  {String} options.version         Version information to add to each log entry. If it is not set, the default version from package.json will be used.
 * @param  {Boolean} options.useConsole     Wether log everything onto console together with server-side enqueing mechanism.
 * @param  {Object} origConsole             The original console which functionality should expanded (default is window.console).
 */
function ServerLogger(
  {
    transport = DEFAULT_TRANSPORT,
    defaultLevel = DEFAULT_LOG_LEVEL,
    transform = DEFAULT_TRANSFORM,
    flushInterval = DEFAULT_FLUSH_INTERVAL,
    flushLimit = DEFAULT_FLUSH_LIMIT,
    version = DEFAULT_VERSION,
    useConsole = false,
  },
  origConsole = (global || window).console,
) {
  /**
   * Each messages contains an unique auto-incrementing id. This variable stores the counter of the last sent message.
   * @type {Number}
   */
  let id = 0;

  /**
   * An array of strings which stores the transformed messages.
   * @type {Array}
   */
  let entries = [];

  /**
   * In case of grouping, this variable contains the group index (number of groups expanded).
   * @type {Number}
   */
  let groups = 0;

  /**
   * In case of grouping, this variable contains the prefix part of the group. Used for caching purpose (not to calculate it on every log call).
   * @type {String}
   */
  let groupPrefix = '';

  /**
   * A timer (setTimeout) identifier which is used to start / stop periodical log activities.
   * @type {Number}
   */
  let timerId = null;

  /**
   * Stops flush timer if it was already enabled.
   * @private
   */
  const stopTimer = () => {
    if (!timerId) {
      return;
    }

    clearTimeout(timerId);
    timerId = null;
  };

  /**
   * Flush log queue via transport layer.
   * @private
   */
  const flush = () => {
    stopTimer();

    if (transport && entries && entries.length) {
      transport(entries, this).then(startTimer).catch(startTimer); // eslint-disable-line @typescript-eslint/no-use-before-define
    }

    entries = [];
  };

  /**
   * Starts flush timer for logging.
   * @private
   */
  const startTimer = () => {
    stopTimer();

    if (flushInterval) {
      timerId = setTimeout(flush, flushInterval);
    }
  };

  /**
   * Adds one or more new log item into the log queue, but calls the `transform` config function if it is set.
   * @param  {String}    level    The log entry level.
   * @param  {...Object} messages Objects or strings as messages which must be added to the queue.
   */
  const enqueue = (level, ...messages) => {
    const timestamp = Date.now();

    const transformedMessages = messages.map((message, idx) => {
      const msg = groupPrefix + (transform ? transform(message, idx, messages, this) : message);

      id += 1;

      return {
        id,
        message: msg,
        level: level || defaultLevel,
        version,
        timestamp,
      };
    });

    entries.push(...transformedMessages);

    if (flushLimit && entries.length >= flushLimit) {
      flush();
    }
  };

  /**
   * Supplementary method wihc creates a new console group.
   * @private
   */
  const createGroup = (...args) => {
    enqueue(LogLevel.INFO, `├─ ${args.join(' ')}`);
    groups += 1;
    groupPrefix = new Array(groups + 1).join('│ ');
  };

  /**
   * Default js `console` interface to log standard message.
   */
  const wrappedFns = {
    log: (...args) => {
      enqueue(defaultLevel, ...args);
    },

    /**
     * Default js `console` interface to log info message.
     */
    info: (...args) => {
      enqueue(LogLevel.INFO, ...args);
    },

    /**
     * Default js `console` interface to log warning messages
     */
    warn: (...args) => {
      enqueue(LogLevel.WARNING, ...args);
    },

    /**
     * Default js `console` interface to log error. It automatically flushes log queue.
     */
    error: (...args) => {
      enqueue(LogLevel.ERROR, ...args);
      flush();
    },

    /**
     * Default js `console` interface to create a new group.
     */
    group: (...args) => {
      createGroup(...args);
    },

    /**
     * Default js `console` interface to create a new collapsed groupd. In server logger there is no diff btw `group` and `groupCollapsed` call.
     */
    groupCollapsed: (...args) => {
      createGroup(...args);
    },

    /**
     * Default js `console` interface to close an already created group.
     */
    groupEnd: () => {
      if (!groups) {
        return;
      }

      groups -= 1;
      groupPrefix = new Array(groups + 1).join('│ ');
      enqueue(LogLevel.INFO, '└────');
    },
  };

  const wrap =
    (fnName) =>
    (...args) => {
      const result = useConsole ? origConsole[fnName](...args) : undefined;
      wrappedFns[fnName](...args);
      return result;
    };

  startTimer();

  return {
    ...origConsole,
    log: wrap('log'),
    info: wrap('info'),
    warn: wrap('warn'),
    error: wrap('error'),
    group: wrap('group'),
    groupCollapsed: wrap('groupCollapsed'),
  };
}

export default ServerLogger;
