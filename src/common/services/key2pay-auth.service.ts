import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  IKey2PayPayingResponse,
  IKeypayPayingBody,
} from 'src/transactions/interfaces';
import { IKey2PayAuthResponse } from '../interfaces/key2pa-auth.-response.interface';
import { ConfigService } from '@nestjs/config';
import { IKey2PayPaymentMethods } from '../interfaces/key2pay-payment-methods-response.interface';
import { Ikey2PayPayoutBody } from '../interfaces/key2pay-payout-body.interface';
import { Ikey2PayPayoutResponse } from '../interfaces/key2pay-payout-response.interface';

@Injectable()
export class Key2payAuthService {
  private readonly logger = new Logger(Key2payAuthService.name);
  private readonly key2payUrl: string =
    this.configService.get<string>('KEY2PAY_URL');
  private readonly username: string =
    this.configService.get<string>('KEY2PAY_USERNAME');
  private readonly password: string =
    this.configService.get<string>('KEY2PAY_PASSWORD');
  public token: string;
  public expirationDate: Date;

  // Codificar las credenciales en formato Base64
  private readonly credentials = Buffer.from(
    `${this.username}:${this.password}`,
  ).toString('base64');

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // getToken(): Observable<string> {
  //   return this.httpService
  //     .post(
  //       `${this.key2payUrl}/auth/token`,
  //       {
  //         grant_type: 'client_credentials',
  //       },
  //       {
  //         headers: {
  //           Authorization: `Basic ${this.credentials}`,
  //         },
  //       },
  //     )
  //     .pipe(
  //       catchError((err) => {
  //         console.log(err);
  //         throw new Error('ocurrio un error');
  //       }),
  //       // tap((resp) => this.logger.log(resp)),
  //       map((response) => {
  //         console.log(JSON.stringify(response));
  //         const token = response.data.token;
  //         const expiresIn = response.data.expiresIn;

  //         const expirationDate = new Date();
  //         expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

  //         this.token;
  //         this.expirationDate = expirationDate;

  //         return token;
  //       }),
  //     );
  // }
  async getToken(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.post<IKey2PayAuthResponse>(
        `${this.key2payUrl}/auth/token`,
        {
          grant_type: 'client_credentials',
        },
        {
          headers: {
            Authorization: `Basic ${this.credentials}`,
          },
        },
      ),
    );
    const token = data.accessToken;
    const expiresIn = data.expiresIn;

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

    this.token = token;
    this.expirationDate = expirationDate;
    return token;
  }

  isTokenValid(): boolean {
    if (!this.token || !this.expirationDate) {
      return false;
    }

    if (new Date() < this.expirationDate) {
      return true;
    }

    return false;
  }

  async sendKey2payBody(payingBody: IKeypayPayingBody) {
    let token: string = '';
    if (!this.isTokenValid()) {
      token = await this.getToken();
    } else {
      token = this.token;
    }

    console.log(payingBody);
    const { data } = await firstValueFrom(
      this.httpService
        .post<IKey2PayPayingResponse>(
          `${this.key2payUrl}/checkout-pages`,
          payingBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .pipe(
          catchError((err) => {
            // console.log(err);
            return throwError(() => err);
          }),
        ),
    );

    return data;
  }

  async sendKey2payoutBody(payoutBody: Ikey2PayPayoutBody) {
    let token: string = '';
    if (!this.isTokenValid()) {
      token = await this.getToken();
    } else {
      token = this.token;
    }
    const { data } = await firstValueFrom(
      this.httpService
        .post<Ikey2PayPayoutResponse>(
          `${this.key2payUrl}/payouts`,
          payoutBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .pipe(
          catchError((err) => {
            // console.log({ respo: err.response.data });
            // throw new InternalServerErrorException(err.response.data);
            return throwError(() => err);
          }),
        ),
    );

    return data;
  }

  async paying(payingBody: IKeypayPayingBody) {
    return await firstValueFrom(
      this.httpService
        .post(`${this.key2payUrl}/checkout-pages`, payingBody)
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              'An error occurred during the transaction.',
            );
          }),
        ),
    );
  }

  async getCountries() {
    if (!this.isTokenValid()) {
      await this.getToken();
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get<IKey2PayPaymentMethods[]>(`${this.key2payUrl}/paymentMethods`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException(
              'An error occurred while obtaining the payment methods.',
            );
          }),
        ),
    );

    return data;
  }
}
