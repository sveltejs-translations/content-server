const localFormatters = {
  ru: {
    format: (Y,M,D) => `${D} ${localFormatters.ru.monthes[M-1]} ${Y}`,
    monthes: ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
  }
}

exports.formatDate = function (date,locale){
  // date is '2022-02-25';
  let [year,month,day] = date.split('-').map(Number);

  return (year && month && day && localFormatters[locale]) 
    ? localFormatters[locale].format(year,month,day) 
    : date;
}