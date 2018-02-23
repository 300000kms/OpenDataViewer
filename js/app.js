
//var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search';
//var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?rows=150'
//var urlcsv = 'http://opendata-ajuntament.barcelona.cat/data/cataleg.csv?public=true'
//var csv ='data/data.csv'


function getData(urljson){
    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?callback=jQuery112006745389475568797_1510911664869&_=1510911664870
    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_show?id=trams&callback=lamevafuncio
    console.log(urljson)
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
    da = data.result.results
    
    html = '';
    $('body').append('<div class="tab"></div>');
    
    html += '<table id="tab" class="display" cellspacing="0" width="100%">'
    
    html += '<thead><tr>'
    html += '<th>id</th>'
    html += '<th>title</th>'
    html += '<th>author</th>'
    html += '<th>depatment</th>'
    html += '<th>notes</th>'
    html += '<th>description</th>'
    html += '<th>downloads</th>'
    html += '<th>year</th>'
    html += '<th>publication</th>'
    html += '<th>link</th>'
    html += '<th>view</th>'

    html += '</tr></thead>'
    
    dic = []
    for(d in da){
        for (r in da[d].resources){
            year = da[d].resources[r].name.split('.')[0];
            publication = da[d].resources[r].created.split("T")[0]
            downs = da[d].resources[r].downloads_absolute;
            if (downs=='None'){downs=''}
            
            dict={}
            dict['i']=d
            dict['title']=da[d]['title']
            dict['author']=da[d]['author']
            dict['department']=da[d]['department']
            dict['notes']=da[d]['notes']
            dict['descr']=da[d].organization.description_translated.en
            dict['year']=year
            dict['publication']=publication
            dict['url']=da[d].resources[r].url
            dict['downs']=downs
            dic.push(dict)
        }
    }
    
    var res = alasql('SELECT i, title, author, department, notes, descr, year, publication, SUM(url) as url, SUM(CAST(downs AS NUMBER)) as downs FROM ? GROUP BY i, title, author, department, notes, descr, year, publication',[dic]);       
    
    html+='<tbody>'
    for(r in res){
        html += '<tr>'
        html += '<td>'+res[r].i+'</td>'
        html += '<td><div class="cell">'+res[r].title+'</div></td>'
        html += '<td><div class="cell">'+res[r].author+'</div></td>'
        html += '<td><div class="cell">'+res[r].department+'</div></td>'
        html += '<td><div class="cell">'+res[r].notes+'</div></td>'
        html += '<td><div class="cell">'+res[r].descr+'</div></td>'
        html += '<td>'+res[r].downs+'</td>'
        html += '<td>'+res[r].year+'</td>'
        html += '<td>'+res[r].publication+'</td>'
        
        if (res[r].url != undefined){
            urls =res[r].url.split('http')
            html += '<td>'
            for (u in urls){
                console.log(urls[u])
                if ( ['', undefined].indexOf(urls[u])==-1){
                    format = urls[u].split('.')[urls[u].split('.').length-1].toLowerCase()
                    html += '<a href="'+'http'+urls[u]+'" class="format '+format+'">'+format+'</a>'
                }
            }
            html += '</td>'
        }else{html+='<td></td>'}
        
        if (res[r].url != undefined){
            urls =res[r].url.split('http')
            html += '<td>'
            for (u in urls){
                if ( ['', undefined].indexOf(urls[u])==-1){
                    if(urls[u].split('.')[urls[u].split('.').length-1].toLowerCase()== 'csv'){html += '<i class="far fa-chart-bar"></i>'}
                }
            }
            html += '</td>'
        }else{html+='<td></td>'}
        
        html += '</tr>' 
    }
    html += '</tbody>'
    html += '</table>'
    
    
    $('.tab').append(html)
    $('#tab').DataTable({
        bFilter: false,
        bPaginate: false,
        bLengthChange: false,
        bInfo: false,
        bAutoWidth: true,
        //scrollY: $("body").height()-150,
        pageLength: 50,
        paging: true,
        "deferRender": true,
        "searching": true,
        rowGroup: { dataSrc: 1 },
        responsive: {
            details: true
        },
        //columns: [null, null, null, null, null, null, {width: "100%" }]
    });
    
    $('#tab_filter label input').attr('placeholder', 'Search')
    placeholder(dic)
    popups()
    spinOff()
}

function popups(){
    $('body').append('<div id="popup"></div>');
    $('.cell').hover(function(event){
        $('#popup').html($(this).text());  
        $('#popup').css('top', event.pageY)
        $('#popup').css('left', event.pageX)
        $('#popup').fadeIn();
    }, function(){
        //$('#popup').fadeOut();
    })
}

function noscroll() {
  window.scrollTo( 0, 0 );
}

function conf(data){
    $('body').append('<div id="main"><div id="city"></div></div>');
    $('#city').html(data.name)
}

function spinOn(){
    $('body').append('<div id="spin"><div class="spinner"></div></div>');
    //anular scroll
    window.addEventListener('scroll', noscroll);
}

function spinOff(){
    $('#spin').remove();
    window.removeEventListener('scroll', noscroll);
}

function placeholder(dic){

    setInterval(function(){
        r = parseInt(Math.random()*dic.length);
        $('#tab_filter label input').attr('placeholder', dic[r]['notes'])
    }, 1000);
}
$(document).ready(function () {
    spinOn()
    city = location.hash;
    if(city==''){city = 'barcelona'}
    console.log(city)
    $.getJSON( "cities/"+city+".json", function( data ) {
        console.log(data)
        getData(data.url)
        conf(data)
    })
})
