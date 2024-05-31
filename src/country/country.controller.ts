import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CountryService } from './country.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRols } from 'src/users/enums/user-rol.enum';

@ApiExcludeController()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll() {
    return this.countryService.getCountries();
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('methods/:idCountry')
  findMethods(@Param('idCountry', ParseIntPipe) idCountry: number) {
    return this.countryService.getMethods(idCountry);
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('countries-by-payout')
  findCountriesByPayout() {
    return this.countryService.getCocuntriesByPayout();
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('documents-allowed/:idCountry')
  findDocumentsAllowedByMehtod(
    @Param('idCountry', ParseIntPipe) idCountry: number,
  ) {
    return this.countryService.findDocumentsAllowed(idCountry);
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('type-accounts/:idMethod')
  findTypeAccountAllowedByMethod(
    @Param('idMethod', ParseIntPipe) idMethod: number,
  ) {
    return this.countryService.getTypeAccountsByMethodId(idMethod);
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('banks/:idCountry')
  findBanksByCountry(@Param('idCountry', ParseIntPipe) idCountry: number) {
    return this.countryService.getBanksByCountry(idCountry);
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get('regions/:idCountry')
  findRegionsByCountry(@Param('idCountry', ParseIntPipe) idCountry: number) {
    return this.countryService.getRegionsByCountry(idCountry);
  }

  @Auth(UserRols.ADMIN, UserRols.CLIENT)
  @Get(':countryCode')
  findCurrencyByCode(@Param('countryCode') countryCode: string) {
    return this.countryService.findCurrencys(countryCode);
  }

  // @Post('update-flags')
  // updateFlags() {
  //   return this.countryService.updateFlags();
  // }

  // @Post('currency')
  // findCurrency(@Body() currency: { code: string }) {
  //   return this.countryService.getCurrencyValue(currency);
  // }
}
