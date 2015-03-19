var EventEmitter = require("events").EventEmitter;
var DomainEvent = require("./DomainEvent");

/**
 * A abstract actor class.
 * @class AbstractActor
 */
export default class AbstractActor extends EventEmitter {

    constructor() {
        super();
        /**
         * Only system calls.
         *
         * uncommitted domain'events.
         *
         * @member AbstractActor#$$uncommittedEvents
         * @type {Array}
         */
        this.$$uncommittedEvents = [];
    }

    /**
     * @member AbstractActor#type
     * @type {String}
     */
    get type() {
        return this.constructor.type;
    }

    /**
     * @member AbstractActor#id
     * @type {String}
     */
    get id() {
        throw new Error("no implements");
    }

    /**
     * Only system calls.
     *
     * load domain'events.
     *
     * @method $$loadEvents
     * @memberof AbstractActor.prototype
     * @param events {Array}
     */
    $$loadEvents(events) {
        events.forEach(event => {
            this._when(event);
        });
        this.loadEvents = null;
    }

    /**
     * Only system calls, and must sync.
     * actor's data can only be changed by it.
     * it is a abstract method , need rewrite.
     * @method _when
     * @memberof AbstractActor.prototype
     * @see AbstractActor#$$loadEvents
     * @param event {DomainEvent}
     * @virtual
     * @protected
     */
    _when(event) {

    }

    /**
     *
     * @method _apply
     * @memberof AbstractActor.prototype
     * @param name {String} event name
     * @param data {json} event'data
     * @param contextId {String} context's id
     *
     * @fires AbstractActor#apply
     *
     * @protected
     */
    _apply(name, data, contextId) {

        var event = new DomainEvent(name, this, data, contextId);
        this._when(event);
        this.$$uncommittedEvents = this.$$uncommittedEvents || [];
        this.$$uncommittedEvents.push(event);
        /**
         * apply event.
         *
         * @event AbstractActor#apply
         */
        this.emit("apply", this);
    }

    /**
     * listen a domain'event.
     *
     * @method _listen
     * @memberof AbstractActor.prototype
     * @param eventName {String}
     * @param handle {String} it's handle method name.
     * @param contextId {String}
     * @fires AbstractActor#listen
     * @protected
     */
    _listen(eventName, handle, contextId) {

        /**
         * @event AbstractActor#listen
         */
        this.emit('listen', {eventName, handle, contextId});
    }


    /**
     * @method remove
     * @memberof AbstractActor.prototype
     * @fires AbstractActor#remove
     */
    remove() {

        /**
         * remove event
         * @event AbstractActor#remove
         */
        this.apply("remove");
    }

    /**
     * @member type
     * @memberof AbstractActor
     * @type {String}
     * @static
     * @abstract
     */
    static get type() {
        throw new Error("please implements it");
    }

    /**
     * parse json data to actor object.
     * @function parse
     * @memberof AbstractActor
     * @static
     */
    static parse(json) {

    }

    /**
     * parse actor object to json data.
     * @function toJSON
     * @memberof AbstractActor
     * @static
     */
    static toJSON(actor) {

    }
}

