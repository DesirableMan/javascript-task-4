"use strict";

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = {};

    return {
        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            //    console.info(event, context, handler);
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            // console.info(event, context);
            Object.keys(events)
                .filter((eventName) =>
                    (eventName + ".").startsWith(event + ".")
                )
                .forEach((key) => {
                    events[key] = events[key].filter(
                        (person) => context !== person.context
                    );
                });
            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            console.info(event);
            const loop = event.split(".").length;
            for (let i = 0; i < loop; i++) {
                if (events.hasOwnProperty(event)) {
                    events[event].forEach((person) => {
                        person.handler.call(person.context);
                    });
                }
                event = event.substring(0, event.lastIndexOf("."));
            }
            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            // console.info(event, context, handler, times);
            this.on(event, context, () => {
                if (times > 0) {
                    handler.call(context);
                    times--;
                }
            });
            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            // console.info(event, context, handler, frequency);
            let count = 0;
            this.on(event, context, () => {
                if (count % frequency === 0) {
                    handler.call(context);
                }
                count++;
            });
            return this;
        },
    };
}

module.exports = {
    getEmitter,

    isStar,
};
