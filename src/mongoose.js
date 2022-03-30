import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost/crud');

export const db = mongoose
  .connection
  .on('error', console.error.bind(console, 'connection error:'));

export default mongoose;