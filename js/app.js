/*
- progress bar     //https://coderwall.com/p/je3uww/get-progress-of-an-ajax-request
- otros portales (london, amsterdam)
- reducir peso de renderizado
- query mas inteligente reduciendo pasos (existe alguna opcion...)
- cgi load csv


https://stackoverflow.com/questions/39874012/get-progress-of-ajax-call-to-get-json-in-rails

*/


//var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search';
//var urljson ='http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?rows=150'
//var urlcsv = 'http://opendata-ajuntament.barcelona.cat/data/cataleg.csv?public=true'
//var csv ='data/data.csv'

/*
barcelona has a od portal with x datasets that have been downloaded x times since date
classified in x groups, the last has been updated x days ago, with x different formats

https://www.getrevue.co/profile/TGIC/issues/6-super-useful-open-data-portals-platforms-56202
https://stackoverflow.com/questions/17416274/ajax-get-size-of-file-before-downloading
*/

cors = 'https://crossorigin.me/';
cors = 'raw/get.cgi?url=';
cors = 'http://www.atnight.ws/od/raw/getcsv.cgi?url=';

function getData(urljson){
    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?callback=jQuery112006745389475568797_1510911664869&_=1510911664870
    //http://opendata-ajuntament.barcelona.cat/data/api/3/action/package_show?id=trams&callback=lamevafuncio
    //https://coderwall.com/p/je3uww/get-progress-of-an-ajax-request
    $.ajax({
        url: urljson.url,
        type: 'GET',
        cache:true,
        //jsonp:'$callback',
        dataType: "jsonp",
        jsonpCallback:'parseData',
        error: function (x, t, r) { console.log(x,t,r); },
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            xhr.onprogress = function e() {
                // For downloads
                console.log(e);
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total);
                }
            };  
            xhr.upload.onprogress = function (e) {
                // For uploads
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total);
                }
        };
        return xhr;
        },
        success: function(data){
            stats = doTable(data)
            stats['name'] = urljson.name;
            conf(stats)
        }
    }); 
}


function parseData(data){
    //console.log(data)
    //return data
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
    html += '<th>file</th>'
    html += '<th>publication</th>'
    html += '<th>link</th>'
    html += '<th>view</th>'

    html += '</tr></thead>'
    
    dic = []
    ndatasources = da.length;
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
    
    //var res = alasql('SELECT i, title, author, department, notes, descr, year, MAX(publication), SUM(url) as url, SUM(CAST(downs AS NUMBER)) as downs FROM ? GROUP BY i, title, author, department, notes, descr, year',[dic]);       
    
    html+='<tbody>'
    for(r in res){
        html += '<tr>'
        html += '<td>'+res[r].i+'</td>'
        html += '<td><div class="cell">'+res[r].title+'</div></td>'
        html += '<td><div class="cell">'+res[r].author+'</div></td>'
        html += '<td><div class="cell">'+res[r].department+'</div></td>'
        html += '<td><div class="cell">'+res[r].notes+'</div></td>'
        html += '<td><div class="cell">'+res[r].descr+'</div></td>'
        html += '<td><div class="cell">'+res[r].downs+'</div></td>'
        html += '<td><div class="cell2">'+res[r].year+'</div></td>'
        html += '<td><div class="cell">'+res[r].publication+'</div></td>'
        
        if (res[r].url != undefined  && typeof(res[r].url) == 'string'){
            urls =res[r].url.split('http')
            html += '<td>'
            for (u in urls){
                //console.log(urls[u])
                if ( ['', undefined].indexOf(urls[u])==-1){
                    format = urls[u].split('.')[urls[u].split('.').length-1].toLowerCase()
                    html += '<a href="'+'http'+urls[u]+'" class="format '+format+'">'+format+'</a>'
                }
            }
            html += '</td>'
        }else{html+='<td></td>'}
        
        if (res[r].url != undefined  && typeof(res[r].url) == 'string'){
            urls =res[r].url.split('http');
            html += '<td>';
            for (u in urls){
                if ( ['', undefined].indexOf(urls[u])==-1){
                    if(urls[u].split('.')[urls[u].split('.').length-1].toLowerCase()== 'csv'){
                        link = "raw/index.html#"+cors+'http'+urls[u]
                        html += '<a href="'+link+'"><i class="far fa-chart-bar"></i></a>'
                    }
                }
            }
            html += '</td>'
        }else{html+='<td></td>'}
        
        html += '</tr>' 
    }
    html += '</tbody>'
    html += '</table>'
    
    $('.tab').append(html);
    
    $('#tab').DataTable({
        bFilter: false,
        bPaginate: false,
        bLengthChange: false,
        bInfo: false,
        bAutoWidth: true,
        //scrollY: $("body").height()-150,
        //pageLength: 50,
        paging: false,
        "deferRender": true,
        "searching": true,
        rowGroup: { dataSrc: 1 },
        responsive: {
            details: true,
        },
        //columns: [null, null, null, null, null, null, {width: "100%" }]
    });
    
    $('#tab_filter label input').attr('placeholder', 'Search')
    
    placeholder(dic);
    
    $('#tab_filter input').click(function() {
        $('html, body').animate({
            scrollTop: $('#tab_filter input').offset().top
        }, 200);
    });
    
    //popups()
    spinOff()
    
    //resum
    var res2 = alasql('SELECT COUNT(i), SUM( DISTINCT author ) as aa,COUNT( DISTINCT author ), SUM(DISTINCT department) dd, notes, descr, year, publication, SUM(url) as url, SUM(CAST(downs AS NUMBER)) as downs FROM ?',[dic])[0]; 
    //console.log(res2)
    
    stats={}
    stats.ndatasources = ndatasources;
    stats.authors = res2.aa;
    stats.departments = res2.dd;
    stats.downloads = res2.downs;
    
    return stats
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
    //console.log(data)
    //http://api.jquery.com/before/
    //$('body').append('<div id="main"><div id="city"></div></div>');
    html = ''
    html += 'the open data portal from '
    html += data.name
    html += ' has '
    html += data.ndatasources
    html += ' datasources with '
    html += data.downloads 
    html += ' downloads '
    html += ''
    
    $('#city').html(html)
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
    n = null;
    c = 0;
    setInterval(function(){
        if (n == null){
            r = parseInt(Math.random()*dic.length); 
            n = dic[r]['notes'];
            n = n.split('. ')[0] 
            n = n.slice(0,100)
            c=0;
            $('#tab_filter label input').attr('placeholder','')
        }
        p=$('#tab_filter label input').attr('placeholder')
        $('#tab_filter label input').attr('placeholder', p+n[c])
        c+=1
        if (n.length==c){n=null}
    }, 40);
}


$(document).ready(function () {
    spinOn()
    city = location.hash;
    if(city==''){city = 'barcelona'}else{city=city.replace('#','')}
    //console.log(city)
    $.getJSON( "cities/"+city+".json", function( data ) {
        getData(data);
    })
})
