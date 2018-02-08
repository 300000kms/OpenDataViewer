
//var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search';
var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?rows=50'
var urlcsv = 'http://opendata-ajuntament.barcelona.cat/data/cataleg.csv?public=true'
var csv ='data/data.csv'


function getData(){

    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?callback=jQuery112006745389475568797_1510911664869&_=1510911664870
    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_show?id=trams&callback=lamevafuncio

    $.ajaxSetup({'cache':true});

    $.ajax({
        url: urljson,
        dataType: "jsonp",
        jsonpCallback:'parseData',
        success: function( data ) {
            doTable(data)
        }
    }); 
}
    

function parseData(data){
    console.log('/')
}

function format(c, v){return v}

function doTable(data){
    console.log(data)
    
    da = data.result.results
    cols = Object.keys(data.result.results[0])
    
    cols = ['title', 'author', 'department', 'notes', ]
    
    html = '';
    $('body').append('<div class="tab"></div>');
    
    html += '<table id="tab" class="display" cellspacing="0" width="100%">'
    
    html += '<thead><tr>'
    html += '<th>id</th>'
    for(c in cols){ html += '<th>'+cols[c]+'</th>' }
    html += '<th>area</th>'
    html += '<th>year</th>'
    html += '<th>link</th>'
    html += '<th>view</th>'
    html += '<th>get it!</th>'
    html += '</tr></thead>'
    
    /*
    html += '<tfoot><tr>'
    html += '<th>id</th>'
    for(c in cols){ html += '<th>'+cols[c]+'</th>' }
    html += '<th>area</th>'
    html += '<th>link</th>'
    html += '<th>view</th>'
    html += '<th>get it!</th>'
    html += '</tr></tfoot>'
    */
    regex= /\d{4}/
    html+='<tbody>'
    for(d in da){
        for (r in da[d].resources){
            year = regex.exec(da[d].resources[r].name);
            if (year != null){year= year[0]}else{year=''}
            downs = da[d].resources[r].downloads_absolute;
            if (downs=='None'){downs=''}
            html += '<tr>'
            html += '<td>'+d+'</td>'
            for (c in cols){html += '<td><div class="cell">'+format(c, da[d][cols[c]])+'</div></td>'}
            html += '<td><div class="cell">'+da[d].organization.description_translated.en+'</div></td>'
            //html += '<td>'+da[d].resources[r].name+'</td>'
            html += '<td>'+year+'</td>'
            html += '<td><div class="format '+da[d].resources[r].format.toLowerCase()+'">'+da[d].resources[r].format.toLowerCase()+'</div>'
            html += '<a href="'+da[d].resources[r].url+'"><i class="fa fa-arrow-down" aria-hidden="true"></i></a>'

            html += '</td>' //link
            if( ('CSV').indexOf(da[d].resources[r].format) != -1){
                html += '<td><a href="'+da[d].resources[r].url+'">RAW</a></td>' //view
            }else{
                html += '<td></td>'
            }
            html += '<td>'+downs+'</td>'
            html += '</tr>'

        }
    }
    
    html += '</tbody>'
    html += '</table>'
    
    //console.log(html)
    
    $('.tab').append(html)
    $('#tab').DataTable({
        bFilter: false,
        bPaginate: false,
        bLengthChange: false,
        bInfo: false,
        bAutoWidth: true,
        scrollY: $("body").height()-150,
        //pageLength: 10,
        //paging: false,
        "deferRender": true,
        "searching": true,
        rowGroup: {
            dataSrc: 1
        },
        responsive: {
            details: true
        },
        //columns: [null, null, null, null, null, null, {width: "100%" }]
    });
    
    //popups
    popups()
}

function popups(){
    $('body').append('<div id="popup"></div>');
    
    $('.cell').hover(function(event){
        //console.log(event)
        $('#popup').html($(this).text());  
        $('#popup').css('top', event.pageY)
        $('#popup').css('left', event.pageX)
        $('#popup').fadeIn();
    }, function(){
        //$('#popup').fadeOut();
    })
    

}

///https://datatables.net/examples/plug-ins/range_filtering.html
//https://stackoverflow.com/questions/26973570/setting-a-max-character-length-in-css
getData()