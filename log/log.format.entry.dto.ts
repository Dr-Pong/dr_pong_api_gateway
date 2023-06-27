import { UserMeDto } from 'src/auth/dto/user.me.dto';

export class ResponseLogEntryDto {
  level: string;
  message: string;
  type: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  context: string;
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
  originalUrl: string;
  method: string;
  requestInfo: any; // 이것도 dto로 만들어서 형식 다 맞춰도 됨
  userInfo: UserMeDto;

  constructor(data: Partial<RequestLogEntryDto>) {
    Object.assign(this, data);
  }
}

// const errorLogEntry: LogEntry = {
//     level: 'error',
//     message: 'Error',
//     type: 'Error',
//     context: 'Your Log Context',
//     ip,
//     ClassName,
//     FunctionName,
//     errorMessage,
//     stackTrace,
//     timestamp,
//     error,
//     userInfo,
//   };
export class ErrorLogEntryDto {
  level: string;
  message: string;
  type: string;
  context: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  errorMessage: string;
  stackTrace: string;
  error: any;
  userInfo: UserMeDto;

  constructor(data: Partial<ErrorLogEntryDto>) {
    Object.assign(this, data);
  }
}
