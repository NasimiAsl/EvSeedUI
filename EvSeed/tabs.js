 
    
    window.sceneReady = function (eng) {
        /* drawLayerLive({ text: { msg: 'test', font: 'England Signature' } }, 1, 1, 1, 1, 1, function () {
 
         }); */

        first('.Main_Title').innerHTML = location.search.split('~')[1].split('/')[1].replaceAll('%20', ' ');
    }

    var addFleece = function () {

        var par = first('.parItem');

        dyHtml.append(par, {
            col1: ''
        }, 'shopfy', '/EvSeed/Tabs/');

        setTimeout(() => {
            updateFleeceRows();
            getPrice();
        }, 10);

    }

    var continueToCart = function () {
        var c = 0;
        all('.row .indx5', function (at) {
            c += at.value.valueOf() * 1;

        }, function () {
            var res = ` {
                        "form_type": "product",
                        "utf8": "✓",
                        "id":"44627489849562",
                        "quantity": "`+ c + `",
                        "note": " ",
                        "properties":   
        {
            "quantity":"`+ c + `",
            "Design ID":"65656-5655-9898-56565-265"  , 
        "_Order ID":"65ee6-56855-9898-56565-265" ,`;

            var i = 1;
            all('.row.ShopfyRow  ', function (at) {

                res += `"_item` + i + `_size":"`
                    + first('.indx1', null, at).value + /* `",
         "_item`+ i + `_name":"`
                    + first('.indx2', null, at).value +  */ `",
         "_item`+ i + `_initials":"`
                    + first('.indx4', null, at).value + `",
         "_item`+ i + `_qty" :"`
                    + first('.indx5', null, at).value.valueOf() * 1 + `" ,`;

                i++;

            }, function () {

                for (var i in design) {

                    if (!i.startsWith('_item'))

                        res += `"` + (i.replaceAll(_sep_, ' - ')) + `":"`
                            + design[i].split(_sep_)[0] + `" ,`;
                }

                res += '__}}';
                res = res.replace(',__}}', '}}');
                res = JSON.parse(res);

                if (window.parent)

                    window.parent.postMessage({ type: 'add to cart', data: res }, "*");


            })

        })
    }


    var calculatePrice = function () {
        /*var s = 0;
        all('.row .indx5', function (at) {
            s += at.value.valueOf() * 1 * currPrice;

        }, function () { first('.totalPrice').innerHTML = s.toFixed(2); })*/
    }

    var updateFleeceRows = function () {
        var i = 1;
        all('.row .indx', function (at) {
            at.innerHTML = (i++);
        });
    }

    var isMob = first('.ismob').offsetWidth != 0;

    chooseTab = function (sel, pop) {

        all('.tab_item', function (at) {
            at.classList.add('hdn-i');
        }
            , function () {
                first(sel + '.tab_item').classList.remove('hdn-i');


                all('.pop_item', function (at) {
                    at.classList.add('hdn-i');
                });

            });

        all('.root_item', function (at) {
            at.classList.remove('c-b-iblack');
            at.classList.add('c-b-itrans');
            at.classList.remove('cwgray2');

            first('.ttl', null, at).classList.remove('c-t-iblack');
        }
            , function () {
                first(sel + '.root_item').classList.remove('c-b-itrans');
                first(sel + '.root_item').classList.add('cwgray2');
                first(sel + '.root_item').classList.add('c-b-iblack');
                first('.ttl', null, first(sel + '.root_item')).classList.add('c-t-iblack');

            });

    }

    var currTextElement, currFontSize, currTextPosY;

    var showCam = function (item) {
        main3D.selelectMeshes(item.split('~')[0].valueOf() * 1, item.split('~')[1],
            function (ms, idx, map) {

                if (map && map.cam) {
                    cam_tar = map.cam;
                    camMoveW.start = 0;
                    camMoveW.go(1);
                }
            });
    }
    var currTextOP = {};
    var wrap8 = function (msg) {
        if (msg.length > 8) {
            if (msg.indexOf(' ') != -1 && msg.split(' ').length == 2) {
                msg = msg.replaceAll(' ', '\\n');
            } else {
                msg = msg.substr(0, 8) + '-\\n' + msg.substr(8);
            }
        }
        return msg;
    };
    var wrap16 = function (msg) {
        if (msg.length > 16) {
            if (msg.indexOf(' ') != -1 && msg.split(' ').length == 2) {
                msg = msg.replaceAll(' ', '\\n');
            } else {
                msg = msg.substr(0, 8) + '-\\n' + msg.substr(16);
            }
        }
        return msg;
    };

    var wrap25 = function (msg) {
        if (msg.length > 16) {
            if (msg.indexOf(' ') != -1 && msg.split(' ').length == 2) {
                msg = msg.replaceAll(' ', '\\n');
            } else {
                var ms = '';
                var ts = msg.split(' ');
                var setLine = 0;

                for (var i = 0; i < ts.length; i++) {
                    if (setLine == 1 || i < ts.length / 2)
                        ms += ts[i] + ' ';
                    else {
                        setLine = 1;
                        ms += ts[i] + '\\n';
                    }
                }

                msg = ms;

            }
        }
        return msg;
    };
    var cusDesign = {};
    var applyActionUI = function (type, value, ttl, im, prm) {
        var item = currMeshPart;
        if (im) item = im;
        cusDesign[item.split('~')[1] + ` ` + type] = 1;
        saveDesign();
        applyAction(type, value, ttl, im, prm);
    }

    var applyActionDef = function (type, value, ttl, im, prm) {
        var item = currMeshPart;
        if (im) item = im;
        if (!cusDesign[item.split('~')[1] + ` ` + type]) {
            console.log(item.split('~')[1] + ` ` + type);
            applyAction(type, value, ttl, im, prm);
        }
    }

    var applyAction = function (type, value, ttl, im, prm, loadingDesign) {
        var item = currMeshPart;
        if (im) item = im;

        prm = def(prm, {});



        if (design_data && !loadingDesign) {

            design[item.split('~')[1] + ` ` + type] = (type == "font" || type == 'visible' ? value : ttl);
            design_data[item.split('~')[1] + ` ` + type] = { type: type, t: ttl, v: value, ref: item, prm: prm };


            saveDesign();
        } else if (item && item.indexOf('~') != -1) {



        } else return;

        main3D.selelectMeshes(item.split('~')[0].valueOf() * 1, item.split('~')[1],
            function (ms, idx, map) {


                if (type == 'visible') {

                    if (ms.material && ms.material.flagDown) {

                        ms.visibility = value;
                        ms.isPickable = value;

                        if (ms.mirror) {
                            ms.mirror.visibility = value;
                            ms.mirror.isPickable = value;
                        }


                    } else

                        for (var m in ms) {
                            m = ms[m];
                            m.visibility = value;
                            m.isPickable = value;
                            if (m.mirror) {
                                m.mirror.visibility = value;
                                m.mirror.isPickable = value;

                            }
                        }
                }
                else if (type == "text" || type == 'font') {
                    if (type == "font" && currRawPart && currRawPart.parentNode &&
                        first('.midval', null, currRawPart.parentNode))
                        first('.midval', null, currRawPart.parentNode).innerHTML = value;

                    if (loadingDesign
                        && design_data[im.split('~')[1] + ' font']
                        && design_data[im.split('~')[1] + ' text']) {
                        value = design_data[im.split('~')[1] + ' font'].v;
                        ttl = design_data[im.split('~')[1] + ' text'].t;
                    }


                    drawLayerLive({
                        text: {
                            font: value
                            , msg: ttl,
                            size: def(prm.size, 1.),
                        }
                    }, 1024, 128, 0, def(prm.y, 0.), 1, function (dta) {

                        if (ms.material && ms.material.flagDown) {
                            ms.material.setTexture('txtRef_6', new BABYLON.Texture(dta, main3D.scene));
                        } else

                            for (var m in ms) {
                                m = ms[m];

                                if (m.material && m.material.setTexture)
                                    m.material.setTexture('txtRef_6', new BABYLON.Texture(dta, main3D.scene));
                            }

                    }, currTextOP);
                }
                else if (type == "image") {


                    if (ms.material && ms.material.flagDown) {
                        ms.material.setTexture('txtRef_6', new BABYLON.Texture(value, main3D.scene));
                    } else

                        for (var m in ms) {
                            m = ms[m];

                            if (m.material && m.material.setTexture)
                                m.material.setTexture('txtRef_6', new BABYLON.Texture(value, main3D.scene));
                        }


                }
                else if (type == 'color') {

                    if (first('.key_' + item.split('~')[1].replaceAll(' ', '_') + ' .val_color')) {
                        first('.key_' + item.split('~')[1].replaceAll(' ', '_') + ' .val_color').style.backgroundColor = value;
                        first('.key_' + item.split('~')[1].replaceAll(' ', '_') + ' .val_color').title = ttl;
                    }

                    if (currRawPart) {

                        first('.val_color', null, currRawPart.parentNode).style.backgroundColor = value;
                        first('.val_color', null, currRawPart.parentNode).title = ttl;
                    }


                    if (value.indexOf('#') == -1 && value.indexOf('rgb') != -1)
                        value = RTH(value);

                    var co1 = hexToRgb(value, 256);

                    if (ms.material && ms.material.flagDown) {

                        ms.material.setVector4('_bs_color', { x: co1.r, y: co1.g, z: co1.b, a: 1. });

                    } else
                        for (var ims in ms) {
                            ims = ms[ims];

                            ims.material.setVector4('_bs_color', { x: co1.r, y: co1.g, z: co1.b, a: 1. });
                        }
                }


            });

    }

    currMeshPart = '';
    currRawPart = null;
    showPop = function (th, pop, item) {

        currMeshPart = item;
        currRawPart = th;

        if (pop == '.cs_pickColors') {
            first('.pickColor_color_ttl').innerHTML = first('.val_color', null, th.parentNode).title;
            first('.pickColor_color ').style.backgroundColor = first('.val_color', null, th.parentNode).style.backgroundColor;
            first('.pickColor_color_ttl').parentNode.attributes['val'].value = first('.val_color', null, th.parentNode).style.backgroundColor;
            first('.pickColor_color_ttl').parentNode.attributes['ttl'].value = first('.val_color', null, th.parentNode).title;

        }


        first(pop + '.pop_item').classList.remove('hdn-i');



    };


    function backPop(css) {

        first(css).classList.add('slideOutRight');
        first(css).classList.remove('slideInRight');

        setTimeout(() => {
            first(css).classList.add('hdn-i');
            first(css).classList.remove('slideOutRight');
            first(css).classList.add('slideInRight');

        }, 500);


    }



    winResize = function () {

        first('.waitDesign').classList.add('hdn-i');



        var eng = main3D;
        if (!eng) return;

        if (first('.maintab').offsetWidth == 0) {
            setTimeout(() => {
                winResize();
            }, 300); return;
        }

        if (!localStorage.seeTheHelperSteps)
            first('.addCartStep1').classList.remove('hdn-i');

        isMob = first('.ismob').offsetWidth != 0;

        if (!isMob) {
            var W = document.body.offsetWidth;
            var H = document.body.offsetHeight;
            var w = (first('.mainmenu').offsetWidth + first('.maintab').offsetWidth);

            first('.canload').style.width = (W - w) + 'px';

            first('.canload').style.height = (H) + 'px';

            eng.canvas.style.marginLeft = (w) + 'px';

            first('.shareIcons').style.left = (w + 15) + 'px';

            first('.wait').style.left = 'calc(50% + ' + (w / 2) + 'px )';



            first('.NameLabel').style.left = w + 'px';
            first('.NameLabel').classList.remove('hdn-i');

            first('.mainmenu').classList.remove('hdn-i');
            first('.popmenu').classList.remove('hdn-i');
            first('.popmenu').classList.remove('animated');
            first('.popmenu').classList.remove('fadeInLeft');
            first('.mainmenu').classList.add('w-025');
            first('.mainmenu').classList.remove('w-015');
            first('.popmenu').classList.add('l-00');
            first('.popmenu').classList.remove('l-00');
            first('.mainmenu').classList.remove('h-full');
            first('.mainmenu').style.height = 'calc(100% - 58px)';

            first('.popmenu').classList.add('cwhite');
            first('.popmenu').classList.remove('ctrwhite');

            first('#shopfyClass').innerHTML = `
            
            .ShopfyRow {

-webkit-box-direction: normal;
-moz-box-direction: normal;
-webkit-box-orient: horizontal;
-moz-box-orient: horizontal;
-webkit-flex-direction: row;
-ms-flex-direction: row;
flex-direction: row;

}
            `;


            eng.engine.resize();

        } else {




            first('#shopfyClass').innerHTML =
                `
            .ShopfyRow {
   -webkit-box-direction: normal;
   -moz-box-direction: normal;
   -webkit-box-orient: vertical;
   -moz-box-orient: vertical;
   -webkit-flex-direction: column;
   -ms-flex-direction: column;
   flex-direction: column;
    
   border-bottom: solid 20px transparent !important; 
 }

 .ShopfyRow > div {
    min-height:18px; 
    margin :3px;
 }

  
 
 .ShopfyRow  .spec     { width:300px !important;max-width:300px !important;min-width:300px !important;}
 
 
 `;

            first('.canload').addEventListener('click', function () {
                isMob = first('.ismob').offsetWidth != 0;
                if (isMob) {
                    hideMobMenu();
                }
            });


            first('.mainmenu').classList.add('hdn-i');
            first('.popmenu').classList.add('hdn-i');
            first('.popmenu').classList.add('animated');
            first('.popmenu').classList.add('fadeInLeft');
            first('.popmenu').classList.remove('cwhite');
            first('.popmenu').classList.add('ctrwhite');

            first('.mainmenu').classList.remove('w-025');
            first('.mainmenu').classList.add('w-015');
            first('.popmenu').classList.remove('l-00');
            first('.popmenu').classList.add('l-00');
            first('.mainmenu').classList.add('h-full');
            first('.mainmenu').style.height = '';

            var W = document.body.offsetWidth;
            var H = document.body.offsetHeight;
            var w = first('.mainmenu').offsetWidth
                + first('.maintab').offsetWidth;


            first('.canload').style.width = (W) + 'px';

            first('.canload').style.height = (H) + 'px';

            eng.canvas.style.marginLeft = (0) + 'px';

            eng.engine.resize();

            first('.wait').style.left = '50%';
            first('.NameLabel').style.left = (15) + 'px';
            first('.NameLabel').classList.remove('hdn-i');

        }


    };

    showMobMenu = function () {
        first('.NameLabel').classList.add('hdn-i');
        first('.mainmenu').classList.remove('hdn-i');
        first('.popmenu').classList.remove('hdn-i');
    }

    hideMobMenu = function () {
        first('.mainmenu').classList.add('hdn-i');
        first('.popmenu').classList.add('hdn-i');
        first('.NameLabel').classList.remove('hdn-i');

    }

    firstTabCall = function () {




        var isMob = first('.ismob').offsetWidth != 0;


        first('.firstTab').click();



        var eng = main3D;

        eng.camera.wheelPrecision = 80;
        eng.camera.lowerRadiusLimit = 13;
        eng.camera.upperRadiusLimit = 50;
        eng.camera._currentTarget.x = 3;
        eng.camera._currentTarget.y = 0;
        eng.camera._currentTarget.z = 0;
        eng.camera.alpha = 45.00 * deg;
        eng.camera.beta = 45 * deg;
        eng.camera.radius = 32.5;


        //winResize();

        if (location.search.split('~')[3]) {



            design.pdf = '/files/' + location.search.split('~')[3] + '.pdf';
            saveDesign();

          /*  if (first('a.download'))
                first('a.download').href = design.pdf;

            first('a.download').classList.remove('hdn-i');

            if (first('a.mobdown'))
                first('a.mobdown').href = design.pdf;

            first('a.mobdown').classList.remove('hdn-i');*/


            first('.waitDesign').classList.remove('hdn-i');

            setTimeout(loadDesign, 500);

        }
        else
            loadDesign();



        getPrice();



    }

    _step3_ = [];
    _sel_step3_ = 0;

    _step1_ = [];
    _sel_step1_ = 0;

    currGlbIden = 2;

    var design = {};
    var design_data = {};

    var _sel_step2 = "";

    var _sep_ = '~~~';

    function saveDesignInSer(name) {


        first('.waitForSave').classList.remove('hdn-i');




        currModelIden = location.search.split('~')[0].replace('?', '').valueOf() * 1;

        if (currModelIden > 0) {

            guid(1, function (dp) {

                var key = dp.guid;
                first('.designKey').value = key;

                new GUX.dataRow(currModelIden).save({
                    key: key,
                    name: name,
                    data: '',
                    struct: ''
                }).watch(function (d) {

                    first('.waitForSave').classList.add('hdn-i');

                    first('.save_pop').classList.remove('hdn-i');
                    first('.designIden').value = this.iden.valueOf() * 1 + preIden;

                });




            })

        }

    }

    var cartInProcess = false;

    function makeDesignAndSendToCart() {


        if (cartInProcess) {
            return;
        }



        currModelIden = location.search.split('~')[0].replace('?', '').valueOf() * 1;

        if (currModelIden > 0) {

            guid(1, function (dp) {

                var key = dp.guid;

                new GUX.dataRow(currModelIden).save({
                    key: key,
                    name: '',
                    data: cd(JSON.stringify(design)),
                    struct: cd(JSON.stringify(design_data))
                }).watch(function (d) {

                    var designId = this.iden.valueOf() * 1 + preIden;


                    var dt = location.search.split('~')[1].split(',');

                    for (var i in dt) {

                        var dtv = dt[i].split('/');

                        data.dtv[0].replaceAll('%20', ' ') = dtv[1];

                    }

                    for (var i in design) {

                        data.i.replaceAll(_sep_, ' - ') = design[i].split(_sep_)[0];

                    }

                    if (window.parent)

                        window.parent.postMessage({ type: 'add to cart', data: data }, "*");

                    cartInProcess = false;

                });


            })

        }

    }

    function updateDesignInSer() {




        currModelIden = location.search.split('~')[0].replace('?', '').valueOf() * 1;

        var valid = String(first('.designEmail').value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        if (!valid) {
            alert('please entar valid Email.');
            return;
        }

        first('.wait').classList.remove('hdn-i');
        first('#wait_prg').innerHTML = '';

        console.log(design, design_data);

        if (currModelIden > 0) {

            new GUX.dataRow(currModelIden).setId(first('.designIden').value.valueOf() - preIden).save({
                key: first('.designKey').value,
                name: first('.designEmail').value.toLowerCase(),
                data: cd(JSON.stringify(design)),
                struct: cd(JSON.stringify(design_data))

            }).watch(function (d) {

                first('.save_pop').classList.add('hdn-i');

                first('.wait').classList.add('hdn-i');

                first('#wait_prg').innerHTML = '';

            });



        }

    }

    function loadDesignInSer() {

        currModelIden = location.search.split('~')[0].replace('?', '').valueOf() * 1;

        var valid = String(first('.designLoadEmail').value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        if (!valid) {
            alert('please entar valid Email.');
            return;
        }

        first('.wait').classList.remove('hdn-i');
        first('#wait_prg').innerHTML = '';


        if (currModelIden > 0) {

            new GUX.dataRow(currModelIden).setId(first('.designLoadIden').value.valueOf() - preIden).load({ name: '', data: '', struct: '' }).watch(function (d) {


                first('.wait').classList.add('hdn-i');
                first('#wait_prg').innerHTML = '';
                if (this.liveData.name == (first('.designLoadEmail').value)
                    .toLowerCase()) {
                    console.log(d, this);

                    design = JSON.parse(dc(this.liveData.data));
                    design_data = JSON.parse(dc(this.liveData.struct));

                    saveDesign();

                    location.reload();


                }
                else {
                    alert('Please provide owner email for see this design.')
                }


            });



        }

    }

    var dic = [];


    downloadShot = function () {

        var ct_img = document.createElement('img');

        ct_img.onload = function () {

            const linkSource =  ct_img.src;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = location.search.split('~')[1].split('/')[0]+"_"+"_"+(new Date().toDateString())+".png";
  downloadLink.click();
            
        } ;

        shot(main3D, ct_img, 2048);
    }

    checkPop = function (key) {
        if (key == 'showSum') {

            first('.sum_result').innerHTML = '';

            var ct_img = first('.shot1');

            var dt = location.search.split('~')[1].split(',');

            shot(main3D, ct_img, 256);

            for (var i in dt) {

                var dtv = dt[i].split('/');

                var dv = document.createElement('dev');
                dv.className = 'ba-i-01 h-auto c-b-iwgray ctrwhite   rad-05 f-center p-00125 pl-00 pr-00 w-mx-08 w-mn-p30 m-0005';
                dv.innerHTML = `<span class='w-p40 fs-03 c-tblack'>` +
                    dtv[0].replaceAll('%20', ' ')
                        .replaceAll('Left Logo', 'Initals')
                        .replaceAll('Right Logo', 'Y1 Front')
                        .replaceAll('Behind Logo', 'Y1 Behind')
                    + `</span><span class='w-p40 fs-03 ml-00125 c-tgray'>` + dtv[1] + `<span>`;
                first('.sum_result').appendChild(dv);
            }

            for (var i in design) {

                if (design[i]) {

                    var ttl = ' ';
                    var order = 1;




                    var dv = document.createElement('dev');
                    dv.style.order = order;
                    dv.title = ttl;
                    dv.className = 'ba-i-01    h-auto c-b-iwgray ctrwhite   rad-05 f-center p-00125 pl-00 pr-00 w-mn-08 f-i11 w-p30 m-0005';
                    dv.innerHTML = `<span class='w-p45  w-mx-04 fs-03 c-tblack'>` + i
                        .replaceAll('Left Logo', 'Initals')
                        .replaceAll('Right Logo', 'Y1 Front')
                        .replaceAll('Behind Logo', 'Y1 Behind').replaceAll(_sep_, ' - ') + `</span><span class='w-p45  w-mx-04 fs-03 ml-00125 c-tgray'>`
                        + (design[i].split ? design[i].split(_sep_)[0] : design[i]) + `<span>`;

                    if (i.endsWith(' text')) {
                        first('.sum_result').appendChild(dv);
                    } else if (i.endsWith(' font')) {
                        first('.sum_result').appendChild(dv);
                    } else if (i.endsWith(' show')) {

                    } else {
                        first('.sum_result').appendChild(dv);
                    }

                } else {
                    var dv = document.createElement('dev');
                    dv.style.order = order;
                    dv.title = ttl;
                    dv.className = 'ba-i-01    h-auto c-b-iwgray ctrwhite   rad-05 f-center p-00125 pl-00 pr-00 w-mn-08 f-i11 w-p30 m-0005';
                    dv.innerHTML = `<span class='w-p45  w-mx-04 fs-03 c-tblack'>` + i.replaceAll(_sep_, ' - ') + `</span>`;


                    if (i.endsWith(' image')) {
                        dv.innerHTML += `<span class='w-p45  w-mx-04 fs-03 ml-00125 c-tgray'> <img src='` + design_data[i].v + `' class='h-01 ' /><span>`;
                        first('.sum_result').appendChild(dv);
                    }
                    if (i.endsWith(' visible')) {
                        dv.innerHTML = `<span class='w-p45  w-mx-04 fs-03 c-tblack'>` + i
                            .replaceAll('Left Logo', 'Initals')
                            .replaceAll('Right Logo', 'Y1 Front')
                            .replaceAll('Behind Logo', 'Y1 Behind').replaceAll(_sep_, ' - ') + `</span><span class='w-p45  w-mx-04 fs-03 ml-00125 c-tgray'> true<span>`;
                        first('.sum_result').appendChild(dv);
                    }
                }

            }

            first('.sum_pop').classList.remove('hdn-i');
        }


        if (key == 'showLoad') {

            first('.load_pop').classList.remove('hdn-i');
        }

        if (key == 'Reset') {
            cusDesign = {};
            design = {};
            design_data = {};
            saveDesign();
            location.reload();
        }
    }

    selRoot = function (th, css) {
        all('.root_items .r_title', function (at) {
            at.classList.remove('c-t-ired');

        }, function () {

            first(css).classList.add('c-t-ired');

        });

    }


    saveDesign = function () {
        localStorage['EvSeed-' + location.search.split('~')[0] + '-temp'] = JSON.stringify(design);
        localStorage['EvSeed-' + location.search.split('~')[0] + '-custemp'] = JSON.stringify(cusDesign);

        localStorage['EvSeed-' + location.search.split('~')[0] + '-datatemp'] = JSON.stringify(design_data);
    }


    _des_loadeed = false;
    loadDesign = function () {
        console.log('check temp design!');
        var s = localStorage['EvSeed-' + location.search.split('~')[0] + '-temp'];
        var sd = localStorage['EvSeed-' + location.search.split('~')[0] + '-datatemp'];
        var cd = localStorage['EvSeed-' + location.search.split('~')[0] + '-custemp'];
        if (s)
            design = JSON.parse(s);
        if (sd)
            design_data = JSON.parse(sd);
        if (cd)
            cusDesign = JSON.parse(cd);



        if (!_des_loadeed && design.pdf && _meshRef && _meshRef['1~Box001']) {

            _des_loadeed = true;
            ShowPdf(design.pdf, function (im) {

                if (first('#frame_$$TID') )
                {
                    var src = first('#frame_$$TID').src;
                    first('#frame_$$TID').src = '';
                    first('#frame_$$TID').src = src; 
                }
                _meshRef['1~Box001'][0].material.setTexture('txtRef_2', new BABYLON.Texture(im.src, main3D.scene));
                first('.waitDesign').classList.add('hdn-i');
            });
        }

    }

    loadDesign();

    postDesign = function (mesh) {
        var map = _meshMatMap[mesh.ref];
        if (map && design_data[map.name + ' text']) {

            setTimeout(() => {

                drawLayerLive({
                    text: {
                        font: (design_data[map.name + ' font'] ? design_data[map.name + ' font'].val : 'Hestina'),

                        msg: design_data[map.name + ' text'].val
                    }
                }, 1024, 128, map.x, map.y, 3, function (dta) {

                    currGlbIden = mesh.ref.split('~')[0].valueOf() * 1;

                    main3D.selelectMeshes(currGlbIden, map.name,
                        function (ms, idx, map) {

                            if (ms.material && ms.material.flagDown) {
                                ms.material.setTexture('txtRef_7', new BABYLON.Texture(dta, main3D.scene));
                            } else

                                for (var m in ms) {
                                    m = ms[m];

                                    if (m.material && m.material.setTexture)
                                        m.material.setTexture('txtRef_7', new BABYLON.Texture(dta, main3D.scene));
                                }
                        });
                });

            }, 2500);

        }
    }

    checkDesign = function (res, mesh, fn) {
        var ref = mesh.ref;

        var rs = _searchItem(ref, function (m, i, t) {


            if (t == 'text' && _meshMatMap[ref] && design_data[_meshMatMap[ref].name]) {

                var map = _meshMatMap[ref];

                rs = JSON.parse(JSON.stringify(res));

                rs.color = design_data[map.name].co;

                fn(mesh, rs);
                return true;

            }

            if (t == 'var') {
                for (var id in design_data) {

                    if (design_data[id].glb == m[i].id &&
                        __Data.mats[m[i].mat][design_data[id].ttl] &&
                        _meshMatMap[ref].name == design_data[id].ttl) {

                        rs = JSON.parse(JSON.stringify(res));

                        rs.color = design_data[id].co;
                        fn(mesh, rs);
                        return true;

                    }


                }



            }

            if (design_data[i] && design_data[i].act == 'color') {

                rs = JSON.parse(JSON.stringify(res));

                rs.color = design_data[i].co;
                fn(mesh, rs);
                return true;
            }



        });

        if (!rs) fn(mesh, res);


    }


    var _searchItem = function (ref, fun) {

        all('.root_items .r_title', function (at) {
            at.classList.remove('c-t-ired');

        }, function () {

        });
        if (_meshMatMap[ref]) {


            var address = {
                "Body,Arms,Color Strip 3,Color Strip 2,Color Strip 1": "Colour",
                "VAR1-PART1,VAR1-PART2,VAR2-BODY,VAR2-ARMS,": "Design",
                "Text,cnt-ltext,cnt-rtext,cnt-behindtext,cnt-midtxt,cnt-btext,cnt-bodyltext,cnt-bodyrtext": "Text",
                "Right Logo,Behind Logo": "Y1",
                "Left Logo": "In",
                "Name": "Name",
                "Body Logo,cnt-micon,cnt-bodylogo": "Logo",
            };

            function callTab(name, key) {

                all('.pop_item', function (at) {
                    at.classList.add('hdn-i');
                });

                chooseTab('.cs_' + name.split('~')[0]);
                setTimeout(() => {
                    try {
                        first('.Row.key_' + key.replaceAll(' ', '_')).click();
                        first('.Row.key_' + key.replaceAll(' ', '_')).onmouseenter();
                    } catch (e) { }

                }, 300);
            }


            for (var i in address)
                if (("," + [i] + ",").indexOf(',' + _meshMatMap[ref].name + ',') != -1)
                    callTab(address[i], _meshMatMap[ref].name);

        }


    }




    var currPrice = 0.00;
    var CompareAt = 0.00;
    var Tax = true;

    var priceInProgress = false;
    var getPrice = function () {

    };

    function copyUrl() {


        if (design.pdf) {

            var sc = location.search.split('~');

            var copyText = '';
            if (design.pdf.startsWith('https://')) copyText = location.href.split('?')[0] + sc[0] + '~' + sc[1] + '~' + sc[2] + 'view~' + design.pdf.split('/')[4].split('.')[0];
            else copyText = location.href.split('?')[0] + sc[0] + '~' + sc[1] + '~' + sc[2] + 'view~' + design.pdf.split('/')[2].split('.')[0];


            // Copy the text inside the text field

            console.log(copyText);
            navigator.clipboard.writeText(copyText);

            first('.alert .icon').innerHTML = 'info';
            first('.alert .text').innerHTML = 'Share link has been copied to you clipboard.';
            first('.alert').classList.remove('hdn-i');
            setTimeout(function () { first('.alert').classList.add('hdn-i'); }, 2800);



        } else {
            first('.alert .icon').innerHTML = 'warning';
            first('.alert .text').innerHTML = 'You can only share once you have created a design.';
            first('.alert').classList.remove('hdn-i');
            setTimeout(function () { first('.alert').classList.add('hdn-i'); }, 2800);

        }

    }


    function sendEnquity(t) {

        var valid = true;
        all('.req', function (at) {
            if (at.innerHTML == '*') valid = false;
        }, function () {

            if (valid) {


                currModelIden = location.search.split('~')[0].replace('?', '').valueOf() * 1;

                first('.wait').classList.remove('hdn-i');
                first('#wait_prg').innerHTML = '';

                if (currModelIden > 0) {

                    new GUX.dataRow(currModelIden).save({
                        key: 'Sp',
                        name: 'nasimi',
                        data: cd(JSON.stringify(design)),
                        struct: cd(JSON.stringify(design_data))

                    }).watch(function (d) {
                        console.log(d, this);
                        var th = this;

                        first('.save_pop').classList.add('hdn-i');

                        first('.wait').classList.add('hdn-i');
                        first('#wait_prg').innerHTML = '';

                        dn({
                            url: 'https://EvSeed.haze.tools/send?m=EvSeed.haze.tools&d=' + (th.iden + preIden) + '&p=' + currModelIden + '&t=0~rah~man~nas&to=nasimiasl@live.com'
                            , success: function (d) {

                                alert(d);
                                first('.addCartStep1').classList.add('hdn-i');
                                first('.addCartStep2').classList.add('hdn-i');
                            }
                        });

                    });

                }

            } else alert('please compleate all requirments.');
        });
    }




    window.iframeInProcess = function () {
        first('.lock-page').classList.remove('hdn-i');
    }


 