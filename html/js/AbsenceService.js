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

    getStudentDataMap()
    {
        return AbsenceService.selectFile().then(
            (objFile) => { return AbsenceService.loadFileToString( objFile ); }
        ).then(
            ( strCSV ) => {
                let aLine = strCSV.split("\n");
                // console.log( aLine );
                let mapStudentData = new Map();
                
                aLine.forEach( strLine => {
                    let aData = strLine.split("\t" )
                    // aCSVData.push( strLine.split("\t" ) );
                    if ( undefined != aData[2] && aData[2] != "" && aData[2] != "ID" && aData[2].includes("@" ) )
                    {
                        let student = mapStudentData.get( aData[2] );
                        
                        if ( undefined === student )
                        {
                            student = new Student( aData[2], aData[0], aData[1], aData[3] ); // mail, surename, forname, class
    
                            mapStudentData.set( aData[2], student );
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
                });
                    
                // console.table(aCSVDat)a;
                // console.log( mapStudentData );

                return mapStudentData;
            }
        );
    }
}
