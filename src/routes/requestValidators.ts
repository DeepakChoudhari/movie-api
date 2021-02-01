import { Validator } from 'express-json-validator-middleware';
import { JSONSchema7TypeName, JSONSchema7 } from 'json-schema';

const validator = new Validator({ allErrors: true });

export const validatorFn = validator.validate;

export const createMovieRequestSchema: JSONSchema7 = {
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
        },
        'info': {
            type: 'object' as JSONSchema7TypeName,
            required: [],
            properties: {
                'directors': {
                    type: 'array' as JSONSchema7TypeName,
                    minItems: 1
                },
                'rating': {
                    type: 'number' as JSONSchema7TypeName,
                    minimum: 1,
                    maximum: 5
                }
            }
        }
    }
};
