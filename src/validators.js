import joi from 'joi';

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

  return next();
};

export default validateRequest;
