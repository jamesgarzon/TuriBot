'use strict';

import mongoose from 'mongoose';

var PersonalitySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Personality', PersonalitySchema);
