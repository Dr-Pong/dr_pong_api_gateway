import { Injectable, NestMiddleware } from '@nestjs/common';
import { Mutex } from 'async-mutex';
export class RequestDataDto {
  req: Request;
  requestTime: Date;

  constructor(req: Request) {
    this.req = req;
    this.requestTime = new Date();
  }
}

export class List<T> {
  data: T;
  next: List<T>;
  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class ApiRequest {
  lastRequestTime: Date;
  requests: List<RequestDataDto>;
  size: number;

  add(req: RequestDataDto): void {
    if (!this.requests) {
      this.requests = new List<RequestDataDto>(req);
      this.requests.next = null;
      this.size++;
      return;
    }
    let tmp = this.requests;
    while (tmp.next) {
      tmp = tmp.next;
    }
    tmp.next = new List<RequestDataDto>(req);
    this.size++;
  }

  delete(): void {
    let tmp = this.requests;
    if (tmp) {
      this.requests = tmp.next;
      this.lastRequestTime = new Date();
      this.size--;
    }
    tmp = null;
  }

  getLast(): List<RequestDataDto> {
    let tmp = this.requests;
    while (tmp?.next) {
      tmp = tmp.next;
    }
    return tmp;
  }

  constructor() {
    this.requests = null;
    this.lastRequestTime = new Date();
    this.size = 0;
  }
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: ApiRequest = new ApiRequest();
  private intervalTime = 1000;
  private mutex = new Mutex();

  async use(req: any, res: any, next: () => void) {
    const release = await this.mutex.acquire();
    try {
      let waitingTime: number;
      if (this.requests.size === 0) {
        waitingTime =
          new Date().getTime() - this.requests.lastRequestTime.getTime();
      } else {
        waitingTime =
          new Date().getTime() -
          this.requests.getLast()?.data?.requestTime.getTime();
      }
      this.requests.add(req);
      if (waitingTime < this.intervalTime) {
        setTimeout(() => this.requests.delete(), waitingTime);
      } else {
        this.requests.delete();
      }
    } finally {
      release();
    }
    next();
  }
}
