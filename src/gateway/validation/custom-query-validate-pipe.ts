import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class QueryValidatePipe implements PipeTransform {
  constructor(private defaultValue: number, private maxValue?: number) {}
  private readonly logger: Logger = new Logger(QueryValidatePipe.name);

  // 인자로 ArugmentMetadata 를 받아서 쿼리인지, 쿼리 안의 인자 키값인지 확인 가능하다.
  transform(value: any) {
    value = this.handleDefault(value);
    this.checkValidateNumericInput(value);
    const parsedValue = parseInt(value, 10);
    this.validate(parsedValue);
    return parsedValue;
  }
  private checkValidateNumericInput(value: any) {
    if (isNaN(value))
      throw new BadRequestException('Rank Get Query must be numeric');
  }
  private validate(value: number): void {
    if (value > this.maxValue) {
      throw new BadRequestException(
        `input must be less than or equal to ${this.maxValue}.`,
      );
    }
    if (value < 0) {
      throw new BadRequestException('input must be greater than 0.');
    }
  }
  private handleDefault(value: any): any {
    if (value === undefined) {
      return this.defaultValue;
    }
    return value;
  }
}
