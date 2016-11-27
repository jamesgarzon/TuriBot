/**
 * Personality model events
 */

'use strict';

import {EventEmitter} from 'events';
import Personality from './personality.model';
var PersonalityEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PersonalityEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Personality.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PersonalityEvents.emit(event + ':' + doc._id, doc);
    PersonalityEvents.emit(event, doc);
  };
}

export default PersonalityEvents;
