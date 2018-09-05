const methods = require('./methods');
const predicates = require('./predicates');
const { not, and, or, alwaysTrue, alwaysFalse } = require('./logic');
const { log, info, warn, error, createLogger } = require('./logger');
const { isValidTemplate, compileTemplate } = require('./utils');

const allMethods = methods.common
  .concat(methods.messenger)
  .concat(methods.line)
  .concat(methods.slack)
  .concat(methods.telegram)
  .concat(methods.viber)
  .concat(methods.fb);

allMethods.forEach(({ method, length, allowOptions }) => {
  if (!exports[method]) {
    exports[method] = (...args) => {
      const fn = (context, ...otherArgs) => {
        const options = args[length - 1];

        if (fn._options) {
          // eslint-disable-next-line no-param-reassign
          args[length - 1] = {
            ...options,
            ...fn._options, // provided by attachOption
          };
        }

        return context[method](
          ...args.map(arg => {
            if (typeof arg === 'function') {
              return arg(context, ...otherArgs);
            }
            if (typeof arg === 'string' && isValidTemplate(arg)) {
              return compileTemplate(arg)(context);
            }
            return arg;
          })
        );
      };

      fn.argsLength = length;
      fn.allowOptions = allowOptions;

      return fn;
    };
  }
});

const allPredicates = predicates.messenger
  .concat(predicates.line)
  .concat(predicates.slack)
  .concat(predicates.telegram)
  .concat(predicates.viber)
  .concat(predicates.fb);

allPredicates.forEach(predicate => {
  if (!exports[predicate]) {
    exports[predicate] = () => context => context.event[predicate];
  }
});

exports._ = require('./_');
exports.branch = require('./branch');
exports.condition = require('./condition');
exports.match = require('./match');
exports.parallel = require('./parallel');
exports.platform = require('./platform');
exports.random = require('./random');
exports.series = require('./series');
exports.tryCatch = require('./tryCatch');
exports.weight = require('./weight');
exports.doNothing = require('./doNothing');
exports.repeat = require('./repeat');
exports.delay = require('./delay');
exports.setDisplayName = require('./setDisplayName');
exports.effect = require('./effect');
exports.attachOptions = require('./attachOptions');

/* Predicate */
exports.isTextMatch = predicates.isTextMatch;
exports.isPayloadMatch = predicates.isPayloadMatch;
exports.hasStateEqual = predicates.hasStateEqual;

/* Logic */
exports.not = not;
exports.and = and;
exports.or = or;
exports.alwaysTrue = alwaysTrue;
exports.alwaysFalse = alwaysFalse;

/* Logger */
exports.log = log;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.createLogger = createLogger;
