import * as moment from 'moment';

export const getHHMM = (time) => {
  if (!time) return '';
  const timeInHhMm = time.split(':');
  return timeInHhMm[0] + ':' + timeInHhMm[1];
};

export const getMonthDayYear = (date) => {
  if (!date) return '';
  return moment(date.split('T')[0]).format('MMM DD YYYY');
};

export const getMonthDayYearFrench = (date) => {
  if (!date) return '';
  return new Date(date + 'T00:00-0800').toLocaleString('fr-FR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getTwoDigits = (param) => (param < 10 ? '0' + param : param);
