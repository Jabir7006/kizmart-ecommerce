
import { z } from 'zod'
import catchAsync from '../utils/catchAsync.js'

const validate = (schema: z.ZodType) => {
    return catchAsync(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        return next();
    })
}

export default validate