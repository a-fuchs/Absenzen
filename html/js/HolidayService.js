class HolidayService
{   
    static aHoliday = [
        ["2021-01-01","2021-01-02","Neujahr"],
        ["2021-01-06","2021-01-07","Heilige Drei Könige"],
        ["2021-03-29","2021-04-11","Osterferien"],
        ["2021-04-02","2021-04-03","Karfreitag"],
        ["2021-04-05","2021-04-06","Ostermontag"],
        ["2021-05-01","2021-05-02","Tag der Arbeit"],
        ["2021-05-13","2021-05-14","Christi Himmelfahrt"],
        ["2021-05-24","2021-05-25","Pfingstmontag"],
        ["2021-05-25","2021-06-05","Pfingstferien"],
        ["2021-06-03","2021-06-04","Fronleichnam"],
        ["2021-07-30","2021-09-14","Sommerferien"],
        ["2021-08-15","2021-08-16","Mariä Himmelfahrt"],
        ["2021-10-03","2021-10-04","Tag der Deutschen Einheit"],
        ["2021-11-01","2021-11-02","Allerheiligen"],
        ["2021-11-02","2021-11-06","Herbstferien"],
        ["2021-11-17","2021-11-18","Buß und Bettag"],
        ["2021-12-24","2022-01-09","Weihnachtsferien"],
        ["2021-12-25","2021-12-26","1. Weihnachtsfeiertag"],
        ["2021-12-26","2021-12-27","2. Weihnachtsfeiertag"],
        
        ["2022-01-01","2022-01-02","Neujahr"],
        ["2022-01-06","2022-01-07","Heilige Drei Könige"],
        ["2022-02-28","2022-03-05","Winterferien"],
        ["2022-04-11","2022-04-24","Osterferien"],
        ["2022-04-15","2022-04-16","Karfreitag"],
        ["2022-04-18","2022-04-19","Ostermontag"],
        ["2022-05-01","2022-05-02","Tag der Arbeit"],
        ["2022-05-26","2022-05-27","Christi Himmelfahrt"],
        ["2022-06-06","2022-06-07","Pfingstmontag"],
        ["2022-06-07","2022-06-19","Pfingstferien"],
        ["2022-06-16","2022-06-17","Fronleichnam"],
        ["2022-08-01","2022-09-13","Sommerferien"],
        ["2022-08-15","2022-08-16","Mariä Himmelfahrt"],
        ["2022-10-03","2022-10-04","Tag der Deutschen Einheit"],
        ["2022-10-31","2022-11-05","Herbstferien"],
        ["2022-11-01","2022-11-02","Allerheiligen"],
        ["2022-11-16","2022-11-17","Buß und Bettag"],
        ["2022-12-24","2023-01-08","Weihnachtsferien"],
        ["2022-12-25","2022-12-26","1. Weihnachtsfeiertag"],
        ["2022-12-26","2022-12-27","2. Weihnachtsfeiertag"],
        
        ["2023-01-01","2023-01-02","Neujahr"],
        ["2023-01-06","2023-01-07","Heilige Drei Könige"],
        ["2023-02-20","2023-02-25","Winterferien"],
        ["2023-04-03","2023-04-16","Osterferien"],
        ["2023-04-07","2023-04-08","Karfreitag"],
        ["2023-04-10","2023-04-11","Ostermontag"],
        ["2023-05-01","2023-05-02","Tag der Arbeit"],
        ["2023-05-18","2023-05-19","Christi Himmelfahrt"],
        ["2023-05-29","2023-05-30","Pfingstmontag"],
        ["2023-05-30","2023-06-10","Pfingstferien"],
        ["2023-06-08","2023-06-09","Fronleichnam"],
        ["2023-07-31","2023-09-12","Sommerferien"],
        ["2023-08-15","2023-08-16","Mariä Himmelfahrt"],
        ["2023-10-03","2023-10-04","Tag der Deutschen Einheit"],
        ["2023-10-30","2023-11-04","Herbstferien"],
        ["2023-11-01","2023-11-02","Allerheiligen"],
        ["2023-11-22","2023-11-23","Buß und Bettag"],
        ["2023-12-23","2024-01-06","Weihnachtsferien"],
        ["2023-12-25","2023-12-26","1. Weihnachtsfeiertag"],
        ["2023-12-26","2023-12-27","2. Weihnachtsfeiertag"],
        
    ];

    static mapHoliday = new Map();
    
  
    static
    {
        HolidayService.aHoliday.forEach( holiday => {
            let dateCur = new Date( holiday[0] );
            let dateEnd = new Date( holiday[1] );
            
            while ( dateCur < dateEnd )
            {
                HolidayService.mapHoliday.set( HolidayService.toISOString( dateCur ), holiday[2] );
                
                dateCur.setDate( dateCur.getDate() + 1 );
            }
        });
        
        // console.log( HolidayService.mapHoliday );
    }
    

    static toISOString( date )
    {
        let strISO = date.getFullYear() + "-";

        let iMonth = date.getMonth() + 1;
        if ( iMonth <= 9 ) { strISO += "0"; }
        strISO += iMonth;
        strISO += "-";

        let iDay = date.getDate();
        if ( iDay <= 9 ) { strISO += "0"; }
        strISO += iDay;

        return strISO;
    }

    static getHoliday( _date )
    {
        return HolidayService.mapHoliday.get( HolidayService.toISOString( _date ) );
    }
}
