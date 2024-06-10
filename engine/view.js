var design_data = null;

function InitModel(eng) {
    function firstLoad() {

        if (sceneReady) {
            sceneReady(eng);
        } 

        new GUX.dataRow(1001).setId(location.search.replace('?', '').split('~')[0]).watch(function (s, d) {

           
            if (s == 'empty') {

            }

            try {

                _models = JSON.parse(dc(d.liveData.models));
                _materials = JSON.parse(dc(d.liveData.mats));
                _meshMatMap = JSON.parse(dc(d.liveData.matmap));
                _attach = JSON.parse(dc(d.liveData.attached));
                __Data = js(dc(d.liveData.data).replaceAll('\n', ' ').replaceAll('\\n', ' '));


                for (var i in _models) {
                    _model_iden = i;

                    if (_models[i] && !_models[i].deleted) {

                        if (eng)
                            _createModel(i);
                    }

                }

                for (var i in _materials) {
                    _material_iden = i;

                    if (_materials[i] && !_materials[i].deleted) {

                        if (eng)
                            _createMat(i);
                    }

                }

                if (eng)
                    setTimeout(() => {

                        try {
                             

                            for (var i in design_data) {
                                i = design_data[i];

                                hideProgressPercent = true;

                                if (i.act == 'var' && i.ref.c[i.ttl] && _models[i.ref.c[i.ttl].id]) {
                                    _$$modelLoader(_models[i.ref.c[i.ttl].id], function () { });
                                }
                                if (i.act == 'text' && i.glb != 1 && _models[i.glb]) {
                                    _$$modelLoader(_models[i.glb], function () { });
                                }
                            }
                        } catch (e) { console.log(e); }


                    }, 200);

            } catch (e) { console.log('Error Storage', e); }



        }).load({ matmap: '', models: '', mats: '', data: '', attached: '' });

    }
    var ps = location.search.split('~');

    try {
        if (ps.length > 3 && ps[2].endsWith('View')) {
            if (window.loadDesign) {

                var designId = ps[1].valueOf() * 1 - preIden;
                var key = ps[3];
                console.log(ps, designId, key);
                loadDesign(designId, key, firstLoad);
            } else {

                first('.wait').innerHTML = `<div class=" w-mn-08 rad-05 h-05 ba-i-01 c-b-iwgray cwhite f-center f-c fs-05">
    <div class="icon fs-18 mb-01 c-tred">deployed_code_alert</div>
    <div class='c-tred'>Content Not Found!</div> 
     </div>`;

            }

        } else firstLoad();
    } catch (e) {

        first('.wait').innerHTML = `<div class=" w-mn-11 rad-05 p-01 ba-i-01 c-b-iwgray cwhite f-center f-c fs-05">
<div class="icon fs-18 mb-01 c-tred">error</div>
<div class='c-tred'>Content Not Loaded!</div>
<div class='c-tred fs-03 op03 p-005'>`+ e.message + `</div></div>`;

    }
}


var _materials = [];
var _sel_material = null;
var _material_iden = 0;
var _meshMatMap = {};

var _models = [];
var _sel_model = null;
var _model_iden = 0;
var _meshRef = [];
var _attach = [];
var __Data = {};

var cam_tar = { x: 0, y: 0, z: 0, a: 0.5, b: 0.5, r: 5 };
var camMoveW = {
    steps: 0.005,
    start: 0.,
    tar: 0.,
    go: function (v) { camMoveW.tar = v; },
    fun: function (v) {

        if (v < 0.99) {
            main3D.camera.alpha = (main3D.camera.alpha * (1. - v) + cam_tar.a * v);
            main3D.camera.beta = (main3D.camera.beta * (1. - v) + cam_tar.b * v);
            main3D.camera.radius = max(2.5, (main3D.camera.radius * (1. - v) + cam_tar.r * v));
            main3D.camera._currentTarget.x = (main3D.camera._currentTarget.x * (1. - v) + cam_tar.x * v);
            main3D.camera._currentTarget.y = (main3D.camera._currentTarget.y * (1. - v) + cam_tar.y * v);
            main3D.camera._currentTarget.z = (main3D.camera._currentTarget.z * (1. - v) + cam_tar.z * v);
        }

        if (v == 1) camMoveW.start = 0;

    }
};





var _createModel = function (id, part) {

    var loader = id != undefined;

    id = id ? id : ++_model_iden;

    _models[id] = def(_models[id], { name: ' ... ' });

    _models[id].parent = _models[id].parent ? _models[id].parent : part;

    _models[id].iden = id;
   

    if (_models[id] && ( _models[id].path || _models[id].rmrPath ))
        _$$modelLoader(_models[id]);
}

var _createMat = function (id, part) {

    var loader = id != undefined;

    id = id ? id : ++_material_iden;

    _materials[id] = def(_materials[id], { name: ' ... ' });

    _materials[id].parent = _materials[id].parent ? _materials[id].parent : part;


};



var _loadIcons = function () {

    return;

    function addIcon(i, ic) {
        layerIndex = i;
        var tx;

        if (ic.data.text)
            tx = addVirtalBox(i, main3D.scene, main3D.camera.position, main3D.camera._currentTarget,
                { size: 1, rot: 0., path: '' }, 1, 'text_', ic.data);
        else
            tx = addVirtalBox(i, main3D.scene, main3D.camera.position, main3D.camera._currentTarget,
                { size: 1, rot: 0., path: '' }, 1, 'icon_', ic.data);


        tx.position.x = ic.pos.x;
        tx.position.y = ic.pos.y;
        tx.position.z = ic.pos.z;
        tx.main.position.x = ic.mpos.x;
        tx.main.position.y = ic.mpos.y;
        tx.main.position.z = ic.mpos.z;

        tx.rotation.x = ic.rot.x;
        tx.rotation.y = ic.rot.y;
        tx.rotation.z = ic.rot.z;
        tx.main.rotation.x = ic.mrot.x;
        tx.main.rotation.y = ic.mrot.y;
        tx.main.rotation.z = ic.mrot.z;

        tx.main.scaling.x = ic.msca.x;
        tx.main.scaling.y = ic.msca.y;
        tx.main.scaling.z = ic.msca.z;


    }

    for (var i in _attach) {
        if (_attach[i])
            addIcon(i, _attach[i]);
    }
}

var glbItemLoad = [];
var checkDesign = null;
var postDesign = null;

var _$$modelLoader = function (mdl, f1) {

 

    if (glbItemLoad[mdl.rmrPath ? mdl.rmrPath : mdl.path]) {
        if (f1)
            f1(true);
        return false;
    }

    glbItemLoad[mdl.rmrPath ? mdl.rmrPath : mdl.path] = true;

    var value = mdl.path;
    var rootId = mdl.iden;
    if (mdl.rmrPath) value = uc(mdl.rmrPath);

    var ext = value.split('.')[value.split('.').length - 1];
    var name = value.replace('.' + ext, '').split('/');
    name = name[name.length - 1];

    var itmLoad = name + '.' + ext;

    if (ext == 'glb') {

        loadGlbSampleModel(main3D.scene, db_api_file + '/Musics/', name + '.' + ext, function (meshes) {

            var mesh = new BABYLON.Mesh(main3D.scene);

            for (var i in meshes) {

                var id = ++_model_iden;
                meshes[i].iden = id;
                meshes[i].ref = rootId + '~' + meshes[i].name;
                if (!_meshRef[rootId + '~' + meshes[i].name]) _meshRef[rootId + '~' + meshes[i].name] = [];
                _meshRef[rootId + '~' + meshes[i].name].push(meshes[i]);

            }

            function parentApply(m, meshes) {

                if (m.parent && !m.parent.iden) {
                    var id = ++_model_iden;
                    m.parent.iden = id;
                    m.parent.isGroup = true;
                    meshes.push(m.parent);

                    parentApply(m.parent, meshes);
                }

            }

            for (var i in meshes) {

                parentApply(meshes[i], meshes);

            }


            for (var i in meshes) {
                i = meshes[i];

                if (i && !i.isGroup && i.material) {

                    var des = _meshMatMap[i.ref] && _meshMatMap[i.ref].mat ? _materials[_meshMatMap[i.ref].mat] : {};

                    
                    if (checkDesign)
                        des = checkDesign(des, i, function (n, res) {
                            n.material = r_mur.pbrMaterial(res, main3D.scene);
                        });
                    else
                        i.material = r_mur.pbrMaterial(des, main3D.scene);

                    if (postDesign)
                        postDesign(i);
                }
            }

            setTimeout(() => {

                if (f1)
                    f1(true);

                main3D.waitMeshes = meshes;

                main3D.glbWait = function (eng) {
                    var meshes = [];
                    if (eng.waitMeshes) {
                        meshes = eng.waitMeshes;
                    }
                    else {
                        first('.wait').classList.remove('fadeIn');
                        first('.wait').classList.add('fadeOut');

                        setTimeout(function () {

                            first('.wait').classList.add('hdn-i');

 

                            //_loadIcons();
                        }, 300);
                        eng.glbWait = null;
                        return;

                    }

                    var mr = true;
                    var c = 0, l = 0;
                    for (var i in meshes) {
                        if (meshes[i].material) {
                            c++;
                            if (meshes[i].material.isReady && meshes[i].material.isReady()) {
                                l++;

                                for (var j in meshes[i].material._textures) {

                                    c++;

                                    if (meshes[i].material._textures[j] &&
                                        meshes[i].material._textures[j].isReady &&
                                        meshes[i].material._textures[j].isReady()) {
                                        l++;

                                    } else {
                                        mr = false;
                                    }

                                }
                            } else {
                                mr = false;
                            }
                        }
                    }

                    /*
                    if(hideProgressPercent)   first('.load_progress').innerHTML =''; else */
                    first('.load_progress').innerHTML += '.';
                    if (first('.load_progress').innerHTML.length > 6)
                        first('.load_progress').innerHTML = '';

                    first('#wait_prg').style['stroke-dashoffset'] = 400 - (l / c) * 400;

                    if (mr) {

                        if (first('.addtoCart')) first('.addtoCart').classList.remove('hdn-i');

                        all('.popmenu', function (at) { at.classList.remove('hdn-i') });
                        winResize();
                        if (first('.mainmenu')) first('.mainmenu').classList.remove('hdn-i');

                        first('.wait').classList.remove('fadeIn');
                        first('.wait').classList.add('fadeOut');
                        for (var ig in glb_Loader) glb_Loader[ig] = -1;
                        setTimeout(function () {

                            first('.wait').classList.add('hdn-i');
                            first('.canload').classList.remove('op0');
                            first('.canload').classList.add('animated');
                            first('.canload').classList.add('fadeIn');

                            if (firstTabCall) {
                                firstTabCall();
                                firstTabCall = function () { } // clear old call
                            }


                            //_loadIcons();
                        }, 300);

                        eng.glbWait = null;
                        return;

                    }
                }


            }, 200);

            meshes[0].parent = mesh;
            mesh.scaling.x *= def(mdl.scale,10.);
            mesh.scaling.y *= def(mdl.scale,10.);
            mesh.scaling.z *= def(mdl.scale,10.);
            /*
           mesh.rotation.x = 0.;
           mesh.rotation.y = 180.*deg;
           mesh.rotation.z = 0.;   */

        });
    } 

    if (ext == 'rmr') {
        dn({
            url: value,
            type: 'GET',
            success: function (d) {

                var st = JSON.parse(d);

                function makeModel(rootId, sti) {
                    var mesh = {};
                    mesh.ref = rootId + '~' + sti.name.trim();

                    // if (!_meshMatMap[mesh.ref] || !_meshMatMap[mesh.ref].hide) {
                    if (sti.mode == 'nurbs')
                        mesh = r_mur.call.nurbs(main3D, sti, st);
                    else if (sti.mode == 'surface')
                        mesh = r_mur.call.surface(main3D, sti, st);
                    // }



                    mesh.name = sti.name.trim();
                    mesh.iden = ++_model_iden;;
                    mesh.ref = rootId + '~' + mesh.name.trim();
                    _meshRef[rootId + '~' + mesh.name.trim()] = mesh;

                    if (mesh.mirror) {
                        mesh.mirror.name = sti.name.trim();
                        mesh.mirror.iden = ++_model_iden;;
                        mesh.mirror.ref = rootId + '~' + mesh.name.trim();


                    }




                    mesh.material = r_mur.pbrMaterial(_meshMatMap[mesh.ref] && _meshMatMap[mesh.ref].mat ? _materials[_meshMatMap[mesh.ref].mat] : {}, main3D.scene);
                    if (mesh.mirror)
                        mesh.mirror.material = mesh.material;

                    if (_meshMatMap[mesh.ref] && _meshMatMap[mesh.ref].hide) {
                        mesh.visibility = 0;
                        mesh.isPickable = 0;
                        if (mesh.mirror) {
                            mesh.mirror.visibility = 0;
                            mesh.mirror.isPickable = 0;
                        }

                    }
                } 
               

                for (var i in st) {

                    if (st[i] && st[i].face && st[i].mode != "helperFace" && !st[i].deleted) {

                        st[i].name = st[i].name.trim()

                        var hid, hcam;



                        makeModel(rootId, st[i]);

                    } 

                }

               

                if (f1)
                    f1(true);

                first('.wait').classList.remove('fadeIn');
                first('.wait').classList.add('fadeOut');

                if (first('.addtoCart')) first('.addtoCart').classList.remove('hdn-i');
                all('.popmenu', function (at) { at.classList.remove('hdn-i') });
                winResize();
                if (first('.mainmenu')) first('.mainmenu').classList.remove('hdn-i');


                setTimeout(function () {

                    first('.wait').classList.add('hdn-i');
                   if(first('.canload')) first('.canload').classList.remove('op0');
                   if(first('.canload')) first('.canload').classList.add('animated');
                   if(first('.canload'))first('.canload').classList.add('fadeIn');

                    if (firstTabCall) {
                        firstTabCall();
                        firstTabCall = function () { } // clear old call
                    }


                    //_loadIcons();
                }, 300);
                main3D.glbWait = null;
                return; 

            }
        })

    }


}

var currModel = location.search.split('~')[0].replace('?', '').valueOf() * 1;
var currDesign = null;
if (localStorage["_current_design_" + currModel]) {
    currDesign = JSON.parse(localStorage["_current_design_" + currModel]);
}

var _saveLocalDesign = function () {
    localStorage["_current_design_" + currModel] = JSON.stringify(currDesign);
};

window.addEventListener(
    "message",
    (event) => {

        if (event.data.type.startsWith('md5_')) {
            md5f[event.data.type.replace('md5_', '')](event.data.path);
        }

    },
    false
);


window.addEventListener(
    "message",
    (event) => {

        console.log(event);

        if (event.data.type.startsWith('guid_')) {
            guidf[event.data.type.replace('guid_', '')](event.data);
        }

        if(event.data.type=='inprogress'){
            if(window.iframeInProcess) iframeInProcess();

        }

        if (event.data.type && event.data.type.startsWith('upload_')) {

            if (first('.' + event.data.type).src.indexOf('/categories?') == -1) {

                first('.' + event.data.type).src = db_api_file + '/submit/dashboard?' + event.data.type + '!' + event.data.path;
            } 
             

            window.eval(event.data.type + '("' + event.data.path + '")');

        }
    },
    false
);

if (window.parent)

    window.parent.postMessage({ type: 'max' }, "*");



