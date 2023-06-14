import { registerDecorator, ValidationOptions } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

export function FixedArraySize(
  size: number | string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'fixedArraySize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: (number | null)[]) {
          if (!Array.isArray(value)) {
            return false;
          }
          return value.length === +size;
        },
        defaultMessage() {
          return `Array size must be exactly ${size}.`;
        },
      },
    });
  };
}

export function CheckArrayValueNumberOrNull(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'checkArrayValueNumberOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: (number | null)[]) {
          if (!Array.isArray(value)) {
            return false;
          }
          return value.every(
            (v) => (typeof v === 'number' && v > 0) || v === null,
          );
        },
        defaultMessage() {
          return `Array value must be number or null.`;
        },
      },
    });
  };
}
