import express from 'express';
import Record from '../schema/record';

const router = express.Router();

router
  .get('/', (req, res) =>
    Record.find((err, records) =>
      res.json(records)))

  .put('/', (req, res) =>
    new Record(req.body)
      .save((err, _record) => res.json(_record)))

  .get('/:id', (req, res) =>
    Record.findById(req.params.id, (err, record) =>
      res.json(record)))

  .delete('/:id', (req, res) =>
    Record.remove({_id: req.params.id}, err =>
      err
        ? res.json(err)
        : res.json(true)))

  .post('/:id', (req, res) =>
    Record.findByIdAndUpdate(req.params.id, req.body, (err, _record) =>
      res.json(_record)));

export default router;
