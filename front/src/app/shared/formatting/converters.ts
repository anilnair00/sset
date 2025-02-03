import { CurrencyMaskConfig } from 'ngx-currency';
import * as moment from 'moment';

export class Converters {
  static FromAmountToDecimal(
    amount: string,
    lang: string = 'en'
  ): number | null {
    if (!amount || amount === '') {
      return null;
    }
    amount = String(amount).replace(/[^?\-0-9,.]+/g, '');

    if (amount.indexOf('.') > amount.indexOf(',') && amount.indexOf(',') > 0) {
      amount.replace('.', '');
      amount.replace(',', '.');
    }

    return parseFloat(amount);
  }

  static GetCurrencyMaskConfigOptions(
    lang: string,
    decimals: number,
    currency?: string
  ): CurrencyMaskConfig {
    let currencySymbol: string;

    if (!currency || currency === 'CAD') {
      currencySymbol = '$';
    }

    const currencyMaskConfig: CurrencyMaskConfig = {
      align: 'left',
      allowNegative: false,
      allowZero: true,
      decimal: '.',
      precision: decimals,
      prefix: currencySymbol,
      suffix: '',
      thousands: ',',
      nullable: true
    };

    if (lang === 'fr') {
      currencyMaskConfig.decimal = ',';
      currencyMaskConfig.prefix = '';
      currencyMaskConfig.suffix = ' ' + currencySymbol;
      currencyMaskConfig.thousands = ' ';
    }

    return currencyMaskConfig;
  }

  public static getTimeCellContent(dDateTime, aDateTime): string {
    const dayOffset = Converters.getDayOffset(dDateTime, aDateTime);
    const offsetStr =
      dayOffset !== 0
        ? `&nbsp;&nbsp;${dayOffset > 0 ? '+' : ''}${dayOffset}`
        : '';

    return (
      moment(dDateTime).utc(true).format('HH:mm') +
      '&nbsp;-&nbsp;' +
      moment(aDateTime).utc(true).format('HH:mm') +
      offsetStr
    );
  }

  public static getDayOffset(
    departureMoment: moment.Moment,
    arrivalMoment: moment.Moment
  ): number {
    if (moment.isMoment(departureMoment) && moment.isMoment(arrivalMoment)) {
      const isDiffDate = departureMoment.date() !== arrivalMoment.date();

      if (!isDiffDate) {
        return 0;
      }

      const depMomentDiff = departureMoment.clone().utc(true).startOf('day');
      const arrMomentDiff = arrivalMoment.clone().utc(true).startOf('day');

      const diffDate = arrMomentDiff.diff(depMomentDiff, 'days', true);
      return diffDate;
    }

    return 0;
  }
}
