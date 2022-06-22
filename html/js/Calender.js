class Calender
{
    static astrMonth       = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];
    static aiMonthDayCount = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    static astrWeekDay     = [ "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag" ];
  
    static getMonthName( iMonth, iMaxLen = -1 )
    {
        return iMaxLen <= 0 ? Calender.astrMonth[ iMonth -1] : Calender.astrMonth[ iMonth -1].substring( 0, iMaxLen );
    }

    static getWeekDayName( iWeekDay, iMaxLen = -1 )
    {
        return iMaxLen <= 0 ? Calender.astrWeekDay[ iWeekDay -1] : Calender.astrWeekDay[ iWeekDay -1].substring( 0, iMaxLen );
    }

    static getMaxDaysOfMonth( iMonth, iYear )
    {
        if ( iMonth === 2 )
        {
            if      ( iYear % 400 == 0 ) { return 29; }
            else if ( iYear % 100 == 0 ) { return 28; }
            else if ( iYear %   4 == 0 ) { return 29; }
            else                         { return 28; }
        }
        else
        {
            return Calender.aiMonthDayCount[ iMonth -1 ];
        }
    }
    
    static getWeekDayOfDate( iYear, iMonth, iDay )
    {
        return (new Date( iYear, iMonth-1, iDay ).getDay() + 6 ) % 7 +1;
    }
    

    static getPrecedingOrSelfDayOfWeek( iYear, iMonth, iDay, iWeekDayNew )
    {
        let date        = new Date( iYear, iMonth -1, iDay );
        let iWeekDayCur = (date.getDay() + 6) % 7 +1;
        
        if (iWeekDayCur !== iWeekDayNew )
        {
            date.setDate( date.getDate() - ((iWeekDayCur - iWeekDayNew + 7) % 7 ) );
        }
        
        return date;
    }

    static getFollowingOrSelfDayOfWeek(iYear, iMonth, iDay, iWeekDayNew)
    {
        let date        = new Date( iYear, iMonth -1, iDay );
        let iWeekDayCur = (date.getDay() + 6) % 7 +1;
        
        if (iWeekDayCur !== iWeekDayNew )
        {
            date.setDate( date.getDate() + ((iWeekDayNew - iWeekDayCur + 7) % 7 ) );
        }
        
        return date;
    }
}
