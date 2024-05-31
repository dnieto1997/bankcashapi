import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IToppayPaying } from '../interfaces/toppay-paying.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { IToppayPayingResponse } from '../interfaces/toppay-paying-response';

@Injectable()
export class ToppayService {
  private readonly urlColombia: string =
    'https://production.toppaylatam.com/api';
  private readonly tokenColombia: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudCI6OTIsImlhdCI6MTY5MjEzMTg2Nn0.t7uBX72cyoZsJUJXYhTUEQYO00MjabM9dwiOsOteM8o';

  private readonly urlPeru: string =
    'https://productionperu.toppaylatam.com/api';
  private readonly tokenPeru: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudCI6OTMsImlhdCI6MTY5MjQwMDA3NH0.X_A9Q2VqcybpcmpzEeCzCN6V_r2n4RhDXuUgqdYIxi8';

  constructor(private readonly httpService: HttpService) {}

  async sendPayColombia(payingBody: IToppayPaying) {
    return await firstValueFrom(
      this.httpService
        .post<IToppayPayingResponse>(
          `${this.urlColombia}/transactions`,
          payingBody,
          {
            headers: {
              Authorization: this.tokenColombia,
            },
          },
        )
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new Error(
              'Ocurrio un error al enviar el paying a toppay colombia',
            );
          }),
        ),
    );
  }
  async sendPayPeru(payingBody: IToppayPaying) {
    return await firstValueFrom(
      this.httpService
        .post<IToppayPayingResponse>(
          `${this.urlPeru}/transactions`,
          payingBody,
          {
            headers: {
              Authorization: this.tokenPeru,
            },
          },
        )
        .pipe(
          catchError(() => {
            throw new Error(
              'Ocurrio un error al enviar el paying a toppay peru',
            );
          }),
        ),
    );
  }
}
