

function ray(scene, pos, tar) {

    if (pos.x == 0) pos.x += 0.00001;
    if (pos.y == 0) pos.y += 0.00001;
    if (pos.z == 0) pos.z += 0.00001;

    var r = new BABYLON.Ray(new BABYLON.Vector3(pos.x, pos.y, pos.z), new BABYLON.Vector3(tar.x, tar.y, tar.z), 1000.);
    var meshFound = scene.pickWithRay(r);

    if (meshFound != null && meshFound.pickedPoint != null) {
        return { o: meshFound.pickedMesh, p: meshFound.pickedPoint };
    }

    return null;
};


var icons = [];
var layerIndex = 0;
function addVirtalBox(iden, scene, pos, tar, op, ry, mode, option) {


    var bx = new BABYLON.Mesh('s', scene);
    bx.mode = mode;

    bx.iden = iden;
    icons[iden] = bx;

    var bx1 = BABYLON.Mesh.CreateBox('s', op.size, scene);;
    bx1.material = new BABYLONX.ShaderBuilder().Solid({ a: 0. }).Transparency().BuildMaterial(scene);
    bx1.scaling.z = 0.07;
    bx1.scaling.x = 0.75;
    bx1.scaling.y = 0.75;

    bx1.parent = bx;
    bx.main = bx1;
    bx.option = option;

    if (mode.startsWith('text_')) {

        drawLayer({ text: option }, 512, 512 * 0.0, function (d2, dt) {
            bx.image = d2;

            bx.drawData = dt;

            bx.main.scaling.x = 0.5;

            bx.main.scaling.y = 1 / max(5., option.msg.length);
            bx.main.scy = 1 / max(5., option.msg.length);
        });
    }
    else if (mode.startsWith('icon_') && option.image) {

        var img = document.createElement('img');
        img.onload = function () {

            drawLayer({ image: this }, 512, 512 * 0.3, function (d2, dt) {


                bx.drawData = dt;
                bx.image = d2;
            });

            matIconChanged(scene);
        };

        img.src = option.image + '?' + new Date().getTime();

    }

    bx1.rotation.x = op.rot;


    bx1.isDrawerLayer = true;

    if (ry) {

        var t = new BABYLON.Vector3(
            tar.x - pos.x,
            tar.y - pos.y,
            tar.z - pos.z,
        );

        var res = ray(scene,
            {
                x: pos.x,
                y: pos.y,
                z: pos.z
            },
            t);

        if (res) {

            bx.position.x = res.p.x;
            bx.position.y = res.p.y;
            bx.position.z = res.p.z;

            bx.lookAt(pos);

        }

    } else {

        bx.position.x = pos.x;
        bx.position.y = pos.y;
        bx.position.z = pos.z;

        bx.lookAt(tar);

    }

    setTimeout(function () {
        matIconChanged(scene);
    }, 30);

    return bx;

}

function drawLayerLive(data, size, pad, x, y, b, fun ,op) {

    x = def(x, 0);
    y = def(y, 0); 
    op = def(op,{}); 

    var ct = document.createElement('canvas');
    ct.width = size;
    ct.height = size;
    ct.className = 'fx hdn-i';
    document.body.appendChild(ct);

    var ctx = ct.getContext('2d');

    ctx.clearRect(0., 0., size, size); 

    if (data.image) {

        var im = document.createElement('img');
        im.onload = function () {
            ctx.drawImage(this, pad * 0.5 + x, pad * 0.5 + y, size - pad, size - pad);

            fun(ct.toDataURL(), data);

        }
        im.src = data.image.src;
    }

    if (data.text) {

        var fs = 200;

        ctx.font = (data.text.bold ? 'bold ' : '') + fs+"px " + data.text.font;
        ctx.textAlign = def(op.alignX,'center');
        ctx.textBaseline =  def(op.alignY,'middle');

        var text  = { width: 0, height: 0 };

        if(op.wrap ) data.text.msg = op.wrap(data.text.msg);
    
        var txts = data.text.msg.split(def(op.line,'\\n')); 
           
            for (var i in txts) {

                var _t = ctx.measureText(' ' + txts[i] + ' ');

                if( _t.width > text.width){
                    text.height = 1.25*_t.width/txts[i].length;
                    text.width = max(text.width, _t.width);
                } 

            }
       

       

        ctx.font = (data.text.bold ? 'bold ' : '') + (1.0-(def(op.secLineConfig,0.35)*(txts.length>1?1:0)))*def(data.text.size, 1.0) * min(140, ( def(op.minRange, 0.8) * (size - pad) * fs / text.width)) + "px " + data.text.font;

        text.height *= (1.0-(def(op.secLineConfig,0.35)*(txts.length>1?1:0)));

        ctx.fillStyle = '#000000dd';
        ctx.lineWidth = 5;

        text.height = def(op.lineHeight,text.height);

        for (var i in txts) {

            var tx = txts[i]; 

            var _h = text.height*0.5+floor(i * text.height) -  (txts.length )*0.5* text.height; 

            ctx.fillText(' ' + tx + ' ', size * 0.5 + x + b, size * 0.5 + y + _h + b);
            ctx.fillText(' ' + tx + ' ', size * 0.5 + x + b, size * 0.5 + y + _h - b);

            ctx.fillStyle = '#ffffffdd';
            ctx.fillText(' ' + tx + ' ', size * 0.5 + x - b, size * 0.5 + _h + y - b);
            ctx.fillText(' ' + tx + ' ', size * 0.5 + x - b, size * 0.5 + _h + y + b);

            ctx.fillStyle = '#ddddddff';
            ctx.fillText(' ' + tx + ' ', size * 0.5 + x, size * 0.5 + _h + y);


        }






        fun(ct.toDataURL(), data);

    }

    // TextMetrics object 
}

function drawLayer(data, size, pad, fun) {

    var ct = document.createElement('canvas');
    ct.width = size;
    ct.height = size;
    document.body.appendChild(ct);

    var ctx = ct.getContext('2d');

    ctx.clearRect(0., 0., size, size);


    if (data.image) {

        var im = document.createElement('img');
        im.onload = function () {
            ctx.drawImage(this, pad * 0.5, pad * 0.5, size - pad, size - pad);

            fun(ct.toDataURL(), data);

        }
        im.src = data.image.src;

    }


    if (data.text) {


        ctx.font = (data.text.bold ? 'bold ' : '') + "200px " + data.text.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var text = ctx.measureText(' ' + data.text.msg + ' ');
        ctx.font = (data.text.bold ? 'bold ' : '') + ((size - pad) * 200 / text.width) + "px " + data.text.font;

        if (data.text.co1) {
            ctx.fillStyle = (data.text.co1) + 'ff';

            ctx.fillText(' ' + data.text.msg + ' ', size * 0.5, size * 0.5);
        }

        if (data.text.co2) {
            ctx.strokeStyle = (data.text.co2) + 'ff';
            ctx.lineWidth = 5;
            ctx.strokeText(' ' + data.text.msg + ' ', size * 0.5, size * 0.5);
        }


        fun(ct.toDataURL(), data);

    }

    // TextMetrics object 
}

function drawer_down(eng, evt, pts) {

    eng.dwStat.d = 1;
    eng.dwStat.x = eng.scene.pointerX;
    eng.dwStat.y = eng.pointerY;

    if (pts.hit && pts.pickedMesh) {

        if (!eng.dwDragedPos) {


            if (!eng.drawerScaleHelper) {

                eng.drawerScaleHelper = new BABYLON.Mesh.CreateSphere('scene', 10, 0.15, eng.scene);
                eng.drawerScaleHelper.isDrawerScaler = true;
                eng.drawerScaleHelper.material =
                    new BABYLONX.ShaderBuilder().Solid({ r: 1 }).BuildMaterial(eng.scene);
                eng.drawerScaleHelper.visibility = 1.0;
                eng.drawerScaleHelper.isPickable = false;
                eng.drawerScaleHelperBox = new BABYLON.Mesh.CreateBox('scene', 10, eng.scene);
                eng.drawerScaleHelperBox.material =
                    new BABYLONX.ShaderBuilder().Solid({ r: 1, a: 0.5 }).Transparency().BuildMaterial(eng.scene);
                eng.drawerScaleHelperBox.scaling.z = 0.001;
                eng.drawerScaleHelperBox.visibility = 0.0;
                eng.drawerScaleHelperBox.isPickable = false;
                eng.drawerScaleHelperHit = new BABYLON.Mesh('s', eng.scene);
                eng.drawerScaleHelperHit.parent = eng.drawerScaleHelperBox;
                eng.drawerScaleHelperHit.position.x = 1;
                eng.drawerScaleHelperHit.position.y = 1;


            }

            eng.dwDragedPos = new BABYLON.Mesh.CreateSphere('scene', 10, 0.02, eng.scene);
            eng.dwDragedPos.visibility = 0.0;

            eng.dwDragedPos.isPickable = false;

            eng.dwDragedTar = new BABYLON.Mesh.CreateSphere('scene', 10, 0.02, eng.scene);
            eng.dwDragedTar.visibility = 0.0;

            eng.dwDragedTar.isPickable = false;

        }

        eng.dwDragedPos.position.x = pts.pickedPoint.x;
        eng.dwDragedPos.position.y = pts.pickedPoint.y;
        eng.dwDragedPos.position.z = pts.pickedPoint.z;

        if (pts.pickedMesh.isDrawerLayer) {

            eng.dwStat.drag = 1;

            eng.dwDragedMesh = pts.pickedMesh;

            eng.drawerScaleHelperBox.visibility = 0.0;
            eng.drawerScaleHelper.visibility = 1.0;


            eng.camera.detachControl(eng.canvas, true);

            for (var i in eng.scene.meshes) {
                i = eng.scene.meshes[i];
                if (i && i.isDrawerLayer) i.isPickable = false;

            }
            eng.drawerScaleHelperHit.isPickable = false;
            eng.drawerScaleHelper.isPickable = false;
            eng.drawerScaleHelperBox.isPickable = false;
            eng.dwDragedPos.isPickable = false;
            eng.dwDragedTar.isPickable = false;

        }

        if (pts.pickedMesh.isDrawerScaler) {
            eng.dwStat.drag = 0;
            eng.dwStat.dragScaler = 1;

            eng.camera.detachControl(eng.canvas, true);

            for (var i in eng.scene.meshes) {
                i = eng.scene.meshes[i];
                i.isPickable = false;
            }
            eng.drawerScaleHelperBox.isPickable = true;


        }
    } else if (eng.drawerScaleHelperBox) {
        eng.lastSelectItem = null;
        eng.drawerScaleHelper.visibility = 0;
        eng.drawerScaleHelper.isPickable = 0;
        eng.drawerScaleHelperBox.isPickable = 0;
        eng.drawerScaleHelperBox.visibility = 0;
        eng.drawerScaleHelperHit.visibility = 0;
    }

}

function drawer_drag_move(eng, pts) {



    if (pts.hit && eng.dwDragedPos) {

        eng.dwDragedPos.position.x = pts.pickedPoint.x;
        eng.dwDragedPos.position.y = pts.pickedPoint.y;
        eng.dwDragedPos.position.z = pts.pickedPoint.z;

        var pickNormal = pts.getNormal(true /** world normal */);

        eng.dwDragedMesh.lastNormal = pickNormal;

        /**
         *  babylon 4
           eng.dwDragedTar.position.x = pts.pickedPoint.x + pickNormal.x;
        eng.dwDragedTar.position.y = pts.pickedPoint.y + pickNormal.y;
        eng.dwDragedTar.position.z = pts.pickedPoint.z + pickNormal.z;
         */

        /** babylon 5 */
        eng.dwDragedTar.position.x = pts.pickedPoint.x + pickNormal.x;
        eng.dwDragedTar.position.y = pts.pickedPoint.y + pickNormal.y;
        eng.dwDragedTar.position.z = pts.pickedPoint.z + pickNormal.z;

        // scene.dragCamera.position =  eng.dwDragedPos.position;
        // scene.dragCamera.setTarget( eng.dwDragedTar.position);

        eng.dwDragedMesh.parent.position.x = eng.dwDragedPos.position.x;
        eng.dwDragedMesh.parent.position.y = eng.dwDragedPos.position.y;
        eng.dwDragedMesh.parent.position.z = eng.dwDragedPos.position.z;


        eng.dwDragedMesh.parent.lookAt(eng.dwDragedTar.position);


        matIconChanged(eng.scene)

    }



}
function drawer_move(eng, evt, pts) {

    if (eng.dwStat.d) {
        eng.dwStat.dx = eng.dwStat.x - eng.scene.pointerX;
        eng.dwStat.dy = eng.dwStat.y - eng.scene.pointerY;

        if (eng.dwStat.drag) {

            var pts = eng.scene.pick(eng.scene.pointerX, eng.scene.pointerY);

            drawer_drag_move(eng, pts);
        } else if (eng.dwStat.dragScaler) {

            var pts = eng.scene.pick(eng.scene.pointerX, eng.scene.pointerY);

            if (pts.hit) {
                eng.drawerScaleHelper.position.x = pts.pickedPoint.x;
                eng.drawerScaleHelper.position.y = pts.pickedPoint.y;
                eng.drawerScaleHelper.position.z = pts.pickedPoint.z;

                var sc = __len(eng.drawerScaleHelper.absolutePosition, eng.drawerScaleHelperBox.absolutePosition);

                var al = a2v({
                    x: eng.drawerScaleHelper.absolutePosition.x - eng.drawerScaleHelperBox.absolutePosition.x,
                    y: eng.drawerScaleHelper.absolutePosition.y - eng.drawerScaleHelperBox.absolutePosition.y,
                    z: eng.drawerScaleHelper.absolutePosition.z - eng.drawerScaleHelperBox.absolutePosition.z,
                },
                    {
                        x: eng.drawerScaleHelperHit.absolutePosition.x - eng.drawerScaleHelperBox.absolutePosition.x,
                        y: eng.drawerScaleHelperHit.absolutePosition.y - eng.drawerScaleHelperBox.absolutePosition.y,
                        z: eng.drawerScaleHelperHit.absolutePosition.z - eng.drawerScaleHelperBox.absolutePosition.z,
                    });

                var c2v = crossi({
                    x: eng.drawerScaleHelper.absolutePosition.x - eng.drawerScaleHelperBox.absolutePosition.x,
                    y: eng.drawerScaleHelper.absolutePosition.y - eng.drawerScaleHelperBox.absolutePosition.y,
                    z: eng.drawerScaleHelper.absolutePosition.z - eng.drawerScaleHelperBox.absolutePosition.z,
                },
                    {
                        x: eng.drawerScaleHelperHit.absolutePosition.x - eng.drawerScaleHelperBox.absolutePosition.x,
                        y: eng.drawerScaleHelperHit.absolutePosition.y - eng.drawerScaleHelperBox.absolutePosition.y,
                        z: eng.drawerScaleHelperHit.absolutePosition.z - eng.drawerScaleHelperBox.absolutePosition.z,
                    });

                var dt = doti(eng.lastSelectItem.main.lastNormal, c2v);



                if (dt < 0.) al = 180 * deg - al;


                eng.lastSelectItem.main.rotation.z = -al;

                eng.lastSelectItem.main.scaling.x = sc * 2.;
                eng.lastSelectItem.main.scaling.y = sc * 2.;
                matIconChanged(eng.scene);
            }
        }

    } else {

        var pts = eng.scene.pick(eng.scene.pointerX, eng.scene.pointerY);

        if (pts.hit && pts.pickedMesh.isDrawerLayer) {

            for (var i in eng.scene.meshes) {
                i = eng.scene.meshes[i];

                if (i && i.isDrawerLayer) i.hover = 0.;
            }

            pts.pickedMesh.hover = 1;
            eng.canvas.classList.add('h-cursor');
            matIconChanged(eng.scene)

        } else {
            for (var i in eng.scene.meshes) {
                i = eng.scene.meshes[i];

                if (i && i.isDrawerLayer) i.hover = 0.;
            }

            eng.canvas.classList.remove('h-cursor');
            matIconChanged(eng.scene)
        }
    }
}

function drawer_up(eng, evt, pts) {

    if (eng.dwStat.d && eng.drawerScaleHelperBox) {

        eng.dwStat.d = 0;

        if (eng.dwStat.drag) {

            eng.dwStat.drag = 0;

            eng.lastSelectItem = eng.dwDragedMesh.parent;

            eng.drawerScaleHelperBox.visibility = 0.0;
            eng.drawerScaleHelper.visibility = 1.0;
            eng.drawerScaleHelper.isPickable = 1.0;

            eng.drawerScaleHelperBox.position.x = eng.dwDragedPos.position.x;
            eng.drawerScaleHelperBox.position.y = eng.dwDragedPos.position.y;
            eng.drawerScaleHelperBox.position.z = eng.dwDragedPos.position.z;
            eng.drawerScaleHelperBox.isPickable = false;


            eng.drawerScaleHelperBox.lookAt(eng.dwDragedTar.position);

            eng.drawerScaleHelperHit.position.x = eng.lastSelectItem.main.scaling.x * 0.5;
            eng.drawerScaleHelperHit.position.y = eng.lastSelectItem.main.scaling.x * 0.5;

            setTimeout(() => {
                eng.drawerScaleHelper.position.x = eng.drawerScaleHelperHit.absolutePosition.x;
                eng.drawerScaleHelper.position.y = eng.drawerScaleHelperHit.absolutePosition.y;
                eng.drawerScaleHelper.position.z = eng.drawerScaleHelperHit.absolutePosition.z;

                _saveSetup();
            }, 30);
            // show setting

            var currIden = eng.lastSelectItem.iden;


            if (eng.dwDragedMesh.parent.mode.startsWith('text_')) {

                /* first('.font_setting').classList.remove('hdn-i')
 
                 if(icons[currIden]){
 
                     first('#tx_co1').value = scene.lastSelectItem.drawData.text.co1;
                    
                     first('#tx_co2').value  = scene.lastSelectItem.drawData.text.co2;
                     if(scene.lastSelectItem.drawData.text.bold) first('#tx_bold').classList.add('cnavy');
                     else  first('#tx_bold').classList.remove('cnavy');
 
                      first('#tx_text').value =  scene.lastSelectItem.drawData.text.msg;
 
                       first('#tx_font').value = scene.lastSelectItem.drawData.text.font; 
                 }*/
            } else {
                /*
                first('.icon_path').classList.remove('hdn-i')

                if(icons[currIden]){

                    first('.icon_path img').src = def(scene.lastSelectItem.image,'../images/deflogo.png');
  
                } */
            }

            eng.camera.attachControl(eng.canvas, true);

            for (var i in eng.scene.meshes) {
                i = eng.scene.meshes[i];

                if (i && i.isDrawerLayer) i.isPickable = true;
            }

        }

    }

    if (eng.dwStat.dragScaler) {
        eng.camera.attachControl(eng.canvas, true);

        for (var i in eng.scene.meshes) {
            i = eng.scene.meshes[i];

            i.isPickable = true;
        }
        eng.dwStat.dragScaler = 0;

        //eng.drawerScaleHelperBox.visibility = 0.0;
        //eng.drawerScaleHelper.visibility = 0.0;
        eng.drawerScaleHelperBox.isPickable = false;
        eng.drawerScaleHelper.isPickable = true;
        eng.drawerScaleHelperHit.isPickable = false;

        eng.drawerScaleHelperBox.visibility = 0.0;
        eng.drawerScaleHelper.visibility = 1.0;

        _saveSetup();


    }
}

function drawSelecter(canvas, pts, tars, sel, unsel) {

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;




    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;

    ctx.setLineDash([5]);


    ctx.strokeStyle = "#ffffffFF";

    var mode = 0;

    if (main3D.scene.KeyShift) {
        ctx.fillStyle = "#99FF9955";
        mode = 1;
    }
    else if (main3D.scene.KeyAlt) {
        ctx.fillStyle = "#FF999955";
        mode = -1;
    }
    else
        ctx.fillStyle = "#FFFF9955";


    if (pts) {
        ctx.beginPath();

        ctx.moveTo(pts[0].x, pts[0].y);

        for (var i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        // Draw the Path
        ctx.stroke();
        ctx.fill();

        var w = 2;
        if (tars)
            for (var i = 0; i < tars.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = "#ff0000FF";
                w = 2;
                if (isPointInsidePolygon(tars[i], pts)) {
                    ctx.fillStyle = "#ffffffFF";
                    w = 4;
                    if ((mode == 1 || mode == 0) && sel) sel(tars[i]);
                    else if (mode == -1 && sel) unsel(tars[i]);

                } else {
                    if (mode == 0 && unsel) unsel(tars[i]);
                }
                ctx.arc(tars[i].x, tars[i].y, w, 0, 2 * Math.PI);
                ctx.fill();
            }
    }




}


var createdTextures = [];

function matIconChanged(scene) {

    var iconPosValue = [];
    var id_path = [];

    for (var ic in icons) {
        var ici = ic;
        ic = icons[ic];
        if (ic && ic.main) {

            if (ic.image) id_path.push(ic.image);

            /* 
            // normal model
            iconPosValue.push(ic.position.x);
             iconPosValue.push(ic.position.y);
             iconPosValue.push(ic.position.z);
             iconPosValue.push(  abs(ic.rotation.x*rad));
             iconPosValue.push(  ic.rotation.y*rad);
             iconPosValue.push(  (-90.-ic.main.rotation.z*rad));
             iconPosValue.push(ic.main.scaling.x*8.0);
             iconPosValue.push(def(ic.main.hover,0.));
             iconPosValue.push(0.); */

            /** glb model */
            iconPosValue.push(ic.position.x);
            iconPosValue.push(ic.position.y);
            iconPosValue.push(ic.position.z);
            iconPosValue.push(abs(ic.rotation.x * rad));
            iconPosValue.push(ic.rotation.y * rad);
            iconPosValue.push((-90. - ic.main.rotation.z * rad));
            iconPosValue.push(ic.main.scaling.x * 2.0);
            iconPosValue.push(def(ic.main.hover, 0.));
            iconPosValue.push(0.);


        }
    }

    for (var i = 0; i < 90 * 3; i++) {
        if (!iconPosValue[i]) iconPosValue[i] = 0;
    }

    for (var ms in scene.meshes) {
        ms = scene.meshes[ms];
        if (!ms.isLayer && ms.material && ms.material.hasLayerMaterial) {
            ms.material.setArray3('iconPlace', iconPosValue);

            for (var j in id_path) {

                if (!createdTextures[id_path[j]]) {
                    var txt = new BABYLON.Texture(id_path[j], scene);

                    ms.material.setTexture('txtRef_' + j, txt);
                }
            }


        }
    }

}

function shot(eng, ctl, w) {

    eng.canvas.classList.add('op0');
    var oldW = eng.canvas.style.width;
    eng.canvas.style.width = w + 'px';
    eng.canvas.style.height = w + 'px';
    eng.engine.resize();
    eng.canvas.classList.add('op0');
    eng.scene.clearColor = new BABYLON.Color4(1., 1., 1., 0.);


    setTimeout(function () {
        ctl.src = eng.canvas.toDataURL();
        setTimeout(function () {

            eng.scene.clearColor = new BABYLON.Color4(1., 1., 1., 1.);

            eng.canvas.classList.remove('op0');
            eng.canvas.style.width = oldW;
            eng.canvas.style.height = '100%';
            eng.engine.resize();

        }, 500);
    }, 300);

}
