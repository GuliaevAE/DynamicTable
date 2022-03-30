import mongoose from "../mongoose";

const _record = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed
});

const record = mongoose.model('Record', _record);

export default record;