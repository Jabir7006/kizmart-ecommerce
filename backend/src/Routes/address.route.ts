import express from 'express';
import { handleCreateAddress, handleDeleteAddress, handleGetAddresses, handleUpdateAddress } from '../controllers/address.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema.js';

const addressRoute = express.Router();

addressRoute.post('/add', validate(createAddressSchema), handleCreateAddress);
addressRoute.get('/', handleGetAddresses);
addressRoute.put('/:id', validate(updateAddressSchema), handleUpdateAddress);
addressRoute.delete('/:id', handleDeleteAddress);

export default addressRoute;
