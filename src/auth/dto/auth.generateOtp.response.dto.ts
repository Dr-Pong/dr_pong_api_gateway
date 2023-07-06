export class generateOtpDto {
  secretKey: string;
  redirectionUrl: string;
  qrCode: any;

  static response(secretKey: string, url: string, qrCode: any) {
    return {
      secretKey: secretKey,
      redirectionUrl: url,
      qrCode: qrCode,
    };
  }

  constructor(input: generateOtpDto) {
    this.secretKey = input.secretKey;
    this.redirectionUrl = input.redirectionUrl;
    this.qrCode = input.qrCode;
  }
}
