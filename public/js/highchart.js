
// Container für Highcharts
function updateHighchart() {
    let aa = 0;
    let ab = 0;
    let ac = 0;
    let ad = 0;
    let ae = 0;
    
    let ba = 0;
    let bb = 0;
    let bc = 0;
    let bd = 0;
    let be = 0;

    let ca = 0;
    let cb = 0;
    let cc = 0;
    let cd = 0;
    let ce = 0;

    let da = 0;
    let db = 0;
    let dc = 0;
    let dd = 0;
    let de = 0;

    let ea = 0;
    let eb = 0;
    let ec = 0;
    let ed = 0;
    let ee = 0;
    
    let hc_data = [];
    
    
    let poiList = cardPoiList; console.log("[updateHighchart] :" + cardPoiList[0]["id"] + "|" + cardPoiList[1]["type"]);
    for(const poi of poiList) {
       
         if(poi.type=='bar') {
            for(const poi of poiList) {
                if(poi.breakfast==true) {
                    aa+=1;
                }else if(poi.happyhour==true) {
                    ab+=1;
                }else if(poi.events==true) {
                    ac+=1;
                }else if(poi.outside==true) {
                    ad+=1;
                }else if(poi.lgbtq==true) {
                    ae+=1;  
                }                             
            }
        } else if(poi.type =='cafe') {
            for(const poi of poiList) {
                if(poi.breakfast==true) {
                    ba+=1;
                }else if(poi.happyhour==true) {
                    bb+=1;
                }else if(poi.events==true) {
                    bc+=1;
                }else if(poi.outside==true) {
                    bd+=1;
                }else if(poi.lgbtq==true) {
                    be+=1;  
                }                
            }

        } else if(poi.type =='lounge') {
            for(const poi of poiList) {
                if(poi.breakfast==true) {
                    ca+=1;
                }else if(poi.happyhour==true) {
                    cb+=1;
                }else if(poi.events==true) {
                    cc+=1;
                }else if(poi.outside==true) {
                    cd+=1;
                }else if(poi.lgbtq==true) {
                    ce+=1;  
                }                 
            }
        } else if(poi.type =='kneipe') {
            for(const poi of poiList) {
                if(poi.breakfast==true) {
                    da+=1;
                }else if(poi.happyhour==true) {
                    db+=1;
                }else if(poi.events==true) {
                    dc+=1;
                }else if(poi.outside==true) {
                    dd+=1;
                }else if(poi.lgbtq==true) {
                    de+=1;  
                }                
            }
        } else if(poi.type =='cocktailbar') {
            for(const poi of poiList) {
                if(poi.breakfast==true) {
                    ea+=1;
                }else if(poi.happyhour==true) {
                    eb+=1;
                }else if(poi.events==true) {
                    ec+=1;
                }else if(poi.outside==true) {
                    ed+=1;
                }else if(poi.lgbtq==true) {
                    ee+=1;  
                }                
            }
        }
    }
  
  
   
    
    hc_data = [aa,ab,ac,ad,ae,ba,bb,bc,bd,be,ca,cb,cc,cd,ce,da,db,dc,dd,de,ea,eb,ec,ed,ee];
    console.log("hc_data: "+ hc_data);

    //let hc_data = updateHighchart();
    aa = hc_data[0];
    ab = hc_data[1];
    ac = hc_data[2];
    ad = hc_data[3];
    ae = hc_data[4];

    ba = hc_data[5];
    bb = hc_data[6];
    bc = hc_data[7];
    bd = hc_data[8];
    be = hc_data[9];

    ca = hc_data[10];
    cb = hc_data[11];
    cc = hc_data[12];
    cd = hc_data[13];
    ce = hc_data[14];

    da = hc_data[15];
    db = hc_data[16];
    dc = hc_data[17];
    dd = hc_data[18];
    de = hc_data[19];

    ea = hc_data[20];
    eb = hc_data[21];
    ec = hc_data[22];
    ed = hc_data[23];
    ee = hc_data[24];
    //console.log(aa,ab,ac,ba,bb,bc,ca,cb,cc);
    const chart = Highcharts.chart('hc_container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Highlights in Mainz'
        },
        xAxis: {
            categories: ['Events', 'Breakfast', 'Happy Hour', 'Außengastro', 'LGBTQ']
        },
        yAxis: {
            title: {
                text: 'Was ist alles los?'
            }
        },
        series: [{
            name: 'Cafes',
            data: [aa, ab, ac, ad, ae]
        }, {
            name: 'Bars',
            data: [ba, bb, bc, bd, be]
        }, {
            name: 'Lounges',
            data: [ca, cb, cc, cd, ce]
        }, {
            name: 'Kneipen',
            data: [da, db, dc, dd, de]
        }, {
            name: 'Cocktailbars',
            data: [ea, eb, ec, ed, ee]
        }]
    }); 
    return chart;
   
}

document.getElementById("chart_button").addEventListener("click", function (e) {
  updateHighchart();
});

export function hello() {
    return "Hello Highchart";
}
