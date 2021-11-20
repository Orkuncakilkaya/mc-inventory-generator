import joi from 'joi';
import downloadImages from './download';

const itemSchema = joi.object().keys({
  id: joi.string().required(),
  stack: joi.number().required(),
});

const schema = joi.object().keys({
  items: joi.array()
    .items(itemSchema)
    .min(1)
    .max(54)
    .required(),
});

const validateRequest = async (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { error } = schema.validate(req.body, options);

  if (error) {
    return res.status(422).json({ message: 'Format is invalid', code: 3, detail: error });
  }

  const { items } = req.body;

  const itemIdList = items.reduce(
    (acc, item) => (
      acc.includes(item.id) ? acc : [...acc, item.id]
    ),
    [],
  );

  const incorrectItemIdList = await downloadImages(itemIdList);
  if (incorrectItemIdList.length > 0) {
    return res.status(400).json({
      message: 'Incorrect item id',
      code: 4,
      detail: incorrectItemIdList,
    });
  }

  return next();
};

export default validateRequest;
