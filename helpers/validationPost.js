import validator from 'validator'

export const validationPostPut = (parameters) => {
  const validatedMaker = !validator.isEmpty(parameters.maker) &&
        validator.isLength(parameters.maker, { min: 2, max: undefined })
  const validatedBrand = !validator.isEmpty(parameters.brand)
  const validatedModel = !validator.isEmpty(parameters.model)

  const validated = !(!validatedMaker || !validatedBrand || !validatedModel)
  if (!validated) {
    throw new Error('Validation Error')
  }
}
