import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const validateRequestParam = async <T extends object> (cls: ClassConstructor<T>, object: any) => {
  const param = plainToClass(cls, object);
  await validateOrReject(param).catch((e) => { throw new Error(e.toString()) });
  return param;
};