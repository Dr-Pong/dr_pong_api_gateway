import { UserMeDto } from 'src/auth/dto/user.me.dto';

export class ResponseLogEntryDto {
  level: string;
  message: string;
  type: string;
  context: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  userInfo: UserMeDto;
  return: any; // 일단 any 여기에 성공한 리턴값이 담길수도 있고, 실패한 리턴값이 담길수도 있음

  constructor(data: Partial<ResponseLogEntryDto>) {
    Object.assign(this, data);
  }
}

export class RequestLogEntryDto {
  level: string;
  message: string;
  type: string;
  context: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  userInfo: UserMeDto;
  originalUrl: string;
  method: string;
  requestInfo: any; // 이것도 dto로 만들어서 형식 다 맞춰도 됨

  constructor(data: Partial<RequestLogEntryDto>) {
    Object.assign(this, data);
  }
}

export class ErrorLogEntryDto {
  level: string;
  message: string;
  type: string;
  context: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  userInfo: UserMeDto;
  errorMessage: string;
  stackTrace: string;
  error: any;

  constructor(data: Partial<ErrorLogEntryDto>) {
    Object.assign(this, data);
  }
}
