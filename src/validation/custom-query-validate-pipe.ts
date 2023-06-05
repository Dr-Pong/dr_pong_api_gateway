import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class QueryValidatePipe implements PipeTransform {
  constructor(private defaultValue: number, private maxValue?: number) {}
  private readonly logger: Logger = new Logger(QueryValidatePipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    // metadata 로 쿼리인지 그 안의 인자 키값인지 확인 가능하지만 밖에서,
    // 내가 넣어주기 때문에 알아서 된다.
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
