import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import corser from 'corser';
import {db} from './mongoose';
import record from "./routes/record";

const app = express();

db
  .once('open', () => {
    app
      .use(logger('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use(corser.create({methods: corser.simpleMethods.concat(["PUT", "DELETE"])}))

      .use('/api/records', record)

      .use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      })

      .use((err, req, res) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
      });
  })
  .on('error', console.error.bind(console, 'connection error:'));

export default app;