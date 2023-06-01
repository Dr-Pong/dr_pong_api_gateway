import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function FixedArraySize(
  size: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'fixedArraySize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          return value.length === +size;
        },
        defaultMessage(args: ValidationArguments) {
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
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          return value.every(
            (v) => (typeof v === 'number' && v > 0) || v === null,
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Array value must be number or null.`;
        },
      },
    });
  };
}
