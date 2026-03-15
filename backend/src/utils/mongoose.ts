import { Schema } from 'mongoose';

/**
 * Removes internal Mongoose versioning (__v) from the output
 */
export const applyGlobalTransform = (schema: Schema): void => {
  const transform = (_doc: any, ret: any) => {
    delete ret.__v;
    return ret;
  };

  schema.set('toJSON', { transform });
  schema.set('toObject', { transform });
};