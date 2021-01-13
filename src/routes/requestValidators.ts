import { Validator } from 'express-json-validator-middleware';
import { JSONSchema7TypeName } from 'json-schema';

const validator = new Validator({ allErrors: true });

export const validatorFn = validator.validate;

export const createMovieRequestSchema = {
    type: 'object' as JSONSchema7TypeName,
    required: ['year', 'title'],
    properties: {
        'year': {
            type: 'number' as JSONSchema7TypeName,
            minimum: 1900
        },
        'title': {
            type: 'string' as JSONSchema7TypeName,
            minLength: 3,
            maxLength: 100
        }
    }
};
