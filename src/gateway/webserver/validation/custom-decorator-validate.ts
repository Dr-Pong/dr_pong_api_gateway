import { registerDecorator, ValidationOptions } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

export function IsIntOrNull(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isIntOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: number | null) {
          if (value === null || value === undefined) {
            return true; // null 또는 undefined는 허용
          }

          if (typeof value !== 'number' || !Number.isInteger(value)) {
            return false; // 숫자가 아닌 경우는 거부
          }

          return true;
        },
        defaultMessage(value: any) {
          return `${value} must be a number or null`;
        },
      },
    });
  };
}
