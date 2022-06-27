document.addEventListener(
    'DOMContentLoaded',
    function() { new AbsenceApp(); },
    false
);


class AbsenceApp
{
    constructor()
    {
        let iYearFirst  = 2021;
        let iMonthFirst =    9;
        let iDayFirst   =   14;
        let iYearLast   = 2022;
        let iMonthLast  =    7;
        let iDayLast    =   31;
        
        let absenceService = new AbsenceService();

        let objThis = this;

        document.getElementById( "idLoadFileBtn" ).addEventListener( "click", 
            ()=>{ 
                absenceService.getClassStudentDataMap().then(
                    ( mapClassStudentData ) => {
                        const [strFirstClass] = mapClassStudentData.keys();

                        objThis.createTables( mapClassStudentData, strFirstClass, iYearFirst, iMonthFirst, iDayFirst, iYearLast, iMonthLast, iDayLast );
                    }
                ).catch(
                   ( error ) => { console.log( "ERROR when geting classStudentDataMap: " + error ); }
                );
            }
        );
    }

    createTables( mapClassStudentData, strVisibleClass, iYearFirst, iMonthFirst, iDayFirst, iYearLast, iMonthLast, iDayLast )
    {
        let htmlDivTable = document.getElementById( "idDivTable" );

        htmlDivTable.innerHTML = "";

        let objThis = this;

        if ( mapClassStudentData.size > 0 )
        {
            let htmlDivClassesToShow = document.createElement( "div" );
            htmlDivClassesToShow.className = "classesToShow";

            for ( const strClass of mapClassStudentData.keys() )
            {
                // htmlDivClass.innerHTML = '<span class="className">' + strClass + '</span>';

                if ( strVisibleClass != strClass )
                {
                    let htmlBtnShowClass = document.createElement( "button" );
                    htmlBtnShowClass.setAttribute( "type", "button" );
                    htmlBtnShowClass.className = "btnShowClass";
                    htmlBtnShowClass.innerHTML = strClass; // "Show...";
                    

                    htmlBtnShowClass.addEventListener( "click", 
                        ()=>{ 
                            objThis.createTables( mapClassStudentData, strClass, iYearFirst, iMonthFirst, iDayFirst, iYearLast, iMonthLast, iDayLast );
                        }
                    );

                    htmlDivClassesToShow.appendChild( htmlBtnShowClass );
                }
            }

            htmlDivTable.appendChild( htmlDivClassesToShow );
        }

        let htmlDivVisibleClass = document.createElement( "div" );
        htmlDivVisibleClass.className = "visibleClass";

        for ( const studentData of mapClassStudentData.get( strVisibleClass ).values() )
        {
            try
            {
                this.createTable( htmlDivVisibleClass, studentData, iYearFirst, iMonthFirst, iDayFirst, iYearLast, iMonthLast, iDayLast );
            }
            catch ( e )
            {
                console.error( e );
            }
        }

        htmlDivTable.appendChild( htmlDivVisibleClass );
    }

/*
        strMail
        strSureName
        strForeName
        strClass
        
        this.aAbsence = [];
            strStartDate,  // Beginndatum
            strStartTime,  // Beginnzeit
            strEndDate,    // Enddatum
            strEndTime,    // Endzeit
            strInterrups,  // Unterbrechungen
            strReason,     // Abwesenheitsgrund
            strReasonInfo, // Text/Grund
            strId,         // Entschuldigungsnummer
            strStatus,     // Status
            strText,       // Entschuldigungstext
            strReportedByStudent // gemeldet von Schüler*in
*/

    
    
    
    createDayTable( aTime, absence, strClassDayTab )
    {
        const mapReason = new Map([
            [ "Befreit",              "teacher"    ],
            [ "Beurlaubung",          "chief"      ],
            [ "fehlt unangekündigt",  "none"       ],
            [ "Ich melde mich krank", "self"       ],
            [ "Quarantäne",           "quarantine" ],
            [ "Verspätung",           "late"       ]
        ]);

        //const mapStatus = new Map([
        //    [ "entsch.", "excused"     ],
        //    [ "Attest",  "certificate" ]
        //]);
        

        let strTitle = absence.strReason;

        if ( strTitle.length === 0 ) { strTitle = "Unbekannt"; }

        if ( absence.strReasonInfo.length > 0 ) { strTitle += ", "; strTitle += absence.strReasonInfo; }
        if ( absence.strStatus.length     > 0 ) { strTitle += ", "; strTitle += absence.strStatus;     }
        if ( absence.strText.length       > 0 ) { strTitle += ", "; strTitle += absence.strText;       }


        let strTable = '<table class="' + strClassDayTab + '">';
        
        for ( let iIndex = 1; iIndex < aTime.length; iIndex++ )
        {
            // console.log( absence.strDate + " " + absence.strStartTime + " " + absence.strEndTime + " [" + aTime[ iIndex -1 ] + " - " + aTime[ iIndex ] + "]" );

            if ( absence.strStartTime < aTime[ iIndex ] && absence.strEndTime >= aTime[ iIndex -1 ] )
            {
                let strReasonClass = mapReason.get( absence.strReason );

                if ( undefined === strReasonClass ) { strReasonClass = "unknown"; }

                if ( strReasonClass === "late" )
                {
                    strTitle += ", " + (( parseInt( absence.strEndTime.substring(0, 2) ) * 60 + parseInt( absence.strEndTime.substring(3, 5) ) ) - ( parseInt( absence.strStartTime.substring(0, 2) ) * 60 + parseInt( absence.strStartTime.substring(3, 5) ) )) + " min";
                }

                if ( absence.strStatus === "Attest" )
                {
                    strReasonClass = "certificate";
                }
                else if ( absence.strStatus === "entsch." )
                {
                }
                else // if ( absence.strStatus === "" )
                {
                    if ( strReasonClass === "unknown" )
                    {
                        strReasonClass = "none";
                    }
                }

                strTable += '<tr class="absence"><td class="' + strReasonClass + '" title="' + strTitle + '"></td></tr>';
            }
            else
            {
                strTable += '<tr><td></td></tr>';
            }
        }

        strTable +="</table>";

        return strTable;
    }

    createDayTables( date, mapAbsence, strClassDayTab )
    {
        const aaTime = [
            [ "08:00", "08:45", "09:30", "10:15" ],
            [ "10:25", "11:20", "12:05", "13:00" ],
            [ "13:30", "14:15", "15:00", "15:45", "16:30" ]
        ];

        let bIsAbsence = false;

        let strISODate = HolidayService.toISOString( date );

        let absence = mapAbsence.get( strISODate );
                    
        if ( undefined === absence )
        {
            return "<table class='" + strClassDayTab + "'><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><table class='" + strClassDayTab + "'><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><table class='" + strClassDayTab + "'><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>";
        }
        else
        {
            let strDayTable = "";

            aaTime.forEach( (aTime) => {
                strDayTable += this.createDayTable( aTime, absence, strClassDayTab );
            });
            
            return strDayTable;
        }
    }


    createTable( htmlDivClass, studentData, iYearFirst, iMonthFirst, iDayFirst, iYearLast, iMonthLast, iDayLast)
    {
        let htmlDivStudentData = document.createElement( "div" );
        htmlDivStudentData.className = "student";

        let htmlDivStudentInfo = document.createElement( "div" );
        htmlDivStudentInfo.className = "info";
        let strInfo = '<a href="mailto:' + studentData.strMail + '" title="' + studentData.strMail + '">' + studentData.strSureName + " " + studentData.strForeName + ", " + studentData.strClass + '</a>';
        strInfo += '\
            <span class="key certificate"><span class="certificate">&#x25FC;</span> Attest</span>\
            <span class="key chief"><span class="chief">&#x25FC;</span> Beurlaubung</span>\
            <span class="key quarantine"><span class="quarantine">&#x25FC;</span> Quarantäne</span>\
            <span class="key teacher"><span class="teacher">&#x25FC;</span> Befreit</span>\
            <span class="key self"><span class="self">&#x25FC;</span> Ich melde mich krank</span>\
            <span class="key late"><span class="late">&#x25FC;</span> Verspätung</span>\
            <span class="key none"><span class="none">&#x25FC;</span> Fehlt unangekündigt</span>\
            <span class="key unknown"><span class="unknown">&#x25FC;</span> Unbekannt</span>';
        
        // &#x2B1B; Large Black Square
        // &#x25FC; Medium Black Square
        // &#x25A0; Black Square
        // &#x25AA; Small Black Square

        htmlDivStudentInfo.innerHTML = strInfo;

        htmlDivStudentData.appendChild( htmlDivStudentInfo );

        if ( Calender.getWeekDayOfDate( iYearFirst, iMonthFirst, iDayFirst ) >= 6 )
        {
            iDayFirst += 7;
        }
        
        let dateBegin = Calender.getPrecedingOrSelfDayOfWeek(iYearFirst, iMonthFirst, iDayFirst, 1);
        let dateFirst = new Date(iYearFirst, iMonthFirst-1, iDayFirst);
        let dateLast  = new Date(iYearLast,  iMonthLast-1,  iDayLast);
        let dateEnd   = Calender.getFollowingOrSelfDayOfWeek( iYearLast,  iMonthLast,  iDayLast,  7 );

        let htmlTable = document.createElement( "table" );

        htmlTable.setAttribute( "id", "idTable" );

        let ahtmlTr = new Array(5);

        let htmlTrMonth = htmlTable.insertRow(-1);
        htmlTrMonth.insertCell(-1).className = "none";

        for (let iIndex = 0; iIndex < 5; iIndex++)
        {
            ahtmlTr[iIndex] = htmlTable.insertRow(-1);

            let htmlTd = ahtmlTr[iIndex].insertCell(-1);
            
            htmlTd.innerHTML = Calender.getWeekDayName(iIndex + 1, 2);
            htmlTd.className = "weekDay";
        }

        
        let iWeekCount = 0;
        let iLastMonth = dateBegin.getMonth();

        for (let dateCur = new Date(dateBegin); dateCur <= dateEnd; dateCur.setDate(dateCur.getDate() + 1) )
        {
            let iWeekDay = (dateCur.getDay() + 6) % 7;
            
            if (iWeekDay < 5)
            {
                let iDayOfMonth = dateCur.getDate();
                
                let htmlTd = ahtmlTr[iWeekDay].insertCell(-1);
                
                let strTitle = "";
                let strClassDayNum = "dayNum";
                let strClassDayTab = "dayTab";
                
                if ( dateFirst <= dateCur && dateCur <= dateLast )
                {
                    let strHoliday = HolidayService.getHoliday( dateCur );
                    
                    if ( undefined !== strHoliday )
                    {
                        // console.log( dateCur.toISOString().substring( 0, 10 ) + " iDayOfMonth " + iDayOfMonth + " iWeekDay " + iWeekDay + " dateCur " + dateCur );
                        strClassDayNum += " holiday";
                        strClassDayTab += " holiday";
                        strTitle = strHoliday;
                    }
                }
                else
                {
                    strClassDayNum += " outOfRange";
                    strClassDayTab += " outOfRange";
                }

                htmlTd.innerHTML = "<div class='" + strClassDayNum + "' title='" + strTitle + "'>" + iDayOfMonth + "</div>" + this.createDayTables( dateCur, studentData.mapAbsence, strClassDayTab );

                
                if (iDayOfMonth <= 7)
                {
                    htmlTd.className = "new" + (iDayOfMonth == 1 && iWeekDay > 0 ? " top" : "" );
                }
                
                if ( iWeekDay === 0 && iLastMonth != dateCur.getMonth() )
                {
                    let htmlTdMonth = htmlTrMonth.insertCell(-1);
                    htmlTdMonth.setAttribute( "colspan", iWeekCount );
                    htmlTdMonth.className = "month";
                    htmlTdMonth.innerHTML = Calender.getMonthName( iLastMonth + 1, 3 );
                    iWeekCount = 0;
                    iLastMonth = dateCur.getMonth();
                }
                
            }
            else if (iWeekDay === 6)
            {
                ++iWeekCount;
            }
        }

        let htmlTdMonth = htmlTrMonth.insertCell(-1);
        htmlTdMonth.setAttribute( "colspan", iWeekCount +1 );
        htmlTdMonth.className = "month";
        htmlTdMonth.innerHTML = Calender.getMonthName( iLastMonth + 1, 3 );
        
        htmlDivStudentData.appendChild( htmlTable );

        htmlDivClass.appendChild( htmlDivStudentData );
    }
}
