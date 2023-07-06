export class JwtDto {
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
