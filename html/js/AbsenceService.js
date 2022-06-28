class Absence
{
    constructor
        (  
            strDate,       // Datum
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
        )
    {
        this.strDate       = undefined === strDate ? "" : strDate;
        this.strStartDate  = undefined === strStartDate ? "" : strStartDate;
        this.strStartTime  = undefined === strStartTime ? "" : strStartTime;
        this.strEndDate    = undefined === strEndDate ? "" : strEndDate;
        this.strEndTime    = undefined === strEndTime ? "" : strEndTime;
        this.strInterrups  = undefined === strInterrups ? "" : strInterrups;
        this.strReason     = undefined === strReason ? "" : strReason;
        this.strReasonInfo = undefined === strReasonInfo ? "" : strReasonInfo;
        this.strId         = undefined === strId ? "" : strId;
        this.strStatus     = undefined === strStatus ? "" : strStatus;
        this.strText       = undefined === strText ? "" : strText;
        this.strReportedByStudent  = undefined === strReportedByStudent ? "" : strReportedByStudent;
    }
}

class Student
{
    constructor( strMail, strSureName, strForeName, strClass )
    {
        this.strMail     = strMail;
        this.strSureName = strSureName;
        this.strForeName = strForeName;
        this.strClass    = strClass;
        
        this.mapAbsence = new Map();
    }
    
    add( absence )
    {
        this.mapAbsence.set( absence.strDate, absence );
    }
}

class AbsenceService
{
    static htmlFileInput = undefined;
    static objFile       = undefined;

    constructor()
    {
        if ( undefined === AbsenceService.htmlFileInput )
        {
            AbsenceService.htmlFileInput = document.createElement( "input" );
            AbsenceService.htmlFileInput.type   = "file";
            AbsenceService.htmlFileInput.hidden = true;
            AbsenceService.htmlFileInput.id     = "idFileDialog";
            document.body.appendChild( AbsenceService.htmlFileInput );
        }

        function fileDialogEventListener( _event )
        {
            AbsenceService.objFile = _event.target.files[ 0 ];
        }

        AbsenceService.htmlFileInput.addEventListener( "change", fileDialogEventListener );
    }           


    static loadFileToString( file )
    {
        return new Promise( (resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText( file );
        });
    }
    
    static selectFile()
    {
        AbsenceService.objFile = undefined;

        return new Promise( (resolve, reject) => {
                function focusEventListener() {
                    window.setTimeout( () => {
                        if ( undefined !== AbsenceService.objFile )
                        {
                            resolve( AbsenceService.objFile );
                        }
                        else
                        {
                            reject( "Canceled by user" );
                        }
        
                        window.removeEventListener( "focus", focusEventListener );
                    }, 1000 );
                }

                window.addEventListener( "focus", focusEventListener );

                AbsenceService.htmlFileInput.click();
            }
        );
    }

    static toISOString( strDate ) // dd.mm.yyyy --> yyyy-mm-dd
    {
        return strDate.split(".").reverse().join( "-" );
    }

    // Langname\tVorname\tID\tKlasse\tBeginndatum\tBeginnzeit\tEnddatum\tEndzeit\tUnterbrechungen\tAbwesenheitsgrund\tText/Grund\tEntschuldigungsnummer\tStatus\tEntschuldigungstext\tgemeldet von Schüler*in\n
    // Familienname\tVorname\tfamilienname.vorname-fs11d@schueler.fosbos-rosenheim.de\tFS11d\t26.10.2021\t08:00\t26.10.2021\t09:30\t\tfehlt unangekündigt\t\t21157\tentsch.\t\tfalse\n
    
    
    /*
     * 
     *let regexp = /(\t(true|false)(\n|\r))/mg;

let str="Hello\t\n\nworld\n\ttrue\nIts amazing\tfalse\nXXX\t\t\n\ttrue\n";
let result;
let iStart = 0;
while ( result = regexp.exec(str) )
{
    let iEnd   = result.index + result[0].length -1;
    console.log( '"' + str.substring( iStart, iEnd ).split( "\t" ) + '"' );
	iStart = iEnd;
}
*/
    normalizeString( str )
    {
        if ( undefined == str )
        {
            return "";
        }
        else
        {
            return str.trim();
        }
    }
    
    getClassStudentDataMap()
    {
        const regexp = /(\t(true|false)(\n|\r))/mg;
        let objThis  = this;
        
        return AbsenceService.selectFile().then(
            (objFile) => { return AbsenceService.loadFileToString( objFile ); }
        ).then(
            ( strCSV ) => {
                let iIndexStart = strCSV.indexOf("\n") + 1;
                let iIndexEnd   = 0;
                
                // console.log( aLine );
                let mapClassStudentData = new Map();
                
                let aResult;
                
                while ( aResult = regexp.exec(strCSV) )
                {
                    iIndexEnd = aResult.index + aResult[0].length -1;
                    
                    let aData = strCSV.substring( iIndexStart, iIndexEnd ).replace( "\n", " " ).replace( "\r", " " ).split( "\t" );

                    // console.log( "[" + iIndexStart + " → " + iIndexEnd + "] " + aData );

                    iIndexStart = iIndexEnd + 1;
                    
                    let strSureName = objThis.normalizeString( aData[ 0 ] );
                    let strForeName = objThis.normalizeString( aData[ 1 ] );
                    let strMail     = objThis.normalizeString( aData[ 2 ] );
                    let strClass    = objThis.normalizeString( aData[ 3 ] );

                    if ( strMail.length === 0 )
                    {
                        if ( strSureName != "" )
                        {
                            strMail = strSureName.toLowerCase() + "." + strForeName.toLowerCase() + "-" + strClass.toLowerCase() + "@schueler.fosbos-rosenheim.de";
                        }
                        else
                        {
                            console.log( "Skip data: " + aData );
                        }
                    }
                    else
                    {
                        if ( ! strMail.includes("@" ) )
                        {
                            strMail += "@schueler.fosbos-rosenheim.de";
                        }
                    }
                    // https://gist.github.com/yeah/1283961
                    
                    try
                    {
                        // Now we have a valid line.

                        let strClass = aData[3];
                        
                        let mapStudentData = mapClassStudentData.get( strClass );

                        if ( undefined === mapStudentData )
                        {
                            mapStudentData = new Map();

                            mapClassStudentData.set( strClass, mapStudentData );
                        }

                        let student = mapStudentData.get( strMail );
                        
                        if ( undefined === student )
                        {
                            student = new Student( strMail, aData[0], aData[1], strClass ); // mail, surename, forname, class

                            mapStudentData.set( strMail, student );
                        }
                        
                        let strISODateStart = AbsenceService.toISOString( aData[4] );
                        let strISODateEnd   = AbsenceService.toISOString( aData[6] );

                        let dateEnd = new Date( strISODateEnd );

                        for ( let dateCur = new Date( strISODateStart ); dateCur <= dateEnd; dateCur.setDate(dateCur.getDate() + 1) )

                        student.add( new Absence( 
                            HolidayService.toISOString( dateCur ), //  Datum
                            strISODateStart, // Beginndatum
                            aData[ 5],       // Beginnzeit
                            strISODateEnd,   // Enddatum
                            aData[ 7],       // Endzeit
                            aData[ 8],       // Unterbrechungen
                            aData[ 9],       // Abwesenheitsgrund
                            aData[10],       // Text/Grund
                            aData[11],       // Entschuldigungsnummer
                            aData[12],       // Status
                            aData[13],       // Entschuldigungstext
                            aData[14]        // gemeldet von Schüler*in
                        ));
                        // CSV-Data:
                        // strEndDate: "20.09.2021"
                        // strEndTime: "20:15"
                        // ​​​​​​strId: "17990"
                        // ​​​​​​strInterrups: ""
                        // ​​​​​​strReason: "Befreit"
                        // ​​​​​​strReasonInfo: ""
                        // ​​​​​​strReportedByStudent: "false"
                        // ​​​​​​strStartDate: "20.09.2021"
                        // ​​​​​​strStartTime: "14:15"
                        // ​​​​​​strStatus: "entsch."
                        // ​​strText: ""
                    }
                    catch( e )
                    {
                        console.log( "ERROR while adding entry to mapStudentData " + e );
                    }
                }

                // console.table(aCSVDat)a;
                // console.log( mapStudentData );
                // console.log( "Loaded!" );

                return mapClassStudentData;
            }
        );
    }
}
