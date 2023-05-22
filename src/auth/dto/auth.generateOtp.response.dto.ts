export class generateOtpResponseDto {
  secretKey: string;
  url: string;
  qrCode: any;

  static response(secretKey: string, url: string, qrCode: any) {
    return {
      secretKey: secretKey,
      url: url,
      qrCode: qrCode,
    };
  }
}
