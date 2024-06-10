window.__log = function (m, c) { first('#log').innerHTML = m; };
local = {
    prepare: function (eng, setting) {
        eng.initCamera = function (scene, setting) {

            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.ArcRotateCamera("camera1", 3, 3, 3, new BABYLON.Vector3(0, 5, -10), scene);

            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            camera.minZ = 1;
            camera.maxZ = 1000.;



            return camera;
        };

        return setting;
    },


    init: function (eng) {

        eng.camera.attachControl(eng.canvas, true);

       

        eng.lastLightPos = { x: 0, y: 0, z: -10000, w: 0. };

        document.body.addEventListener('keyup', eng.scene.keyU);
        document.body.addEventListener('keydown', eng.scene.keyD);

        eng.selelectMeshes = function (ids, mesh, fun) {
            for (var i in _meshMatMap) {
                if (i.startsWith(ids + '~') && _meshMatMap[i] && (_meshMatMap[i].name == mesh)) {

                    fun(_meshRef[i], i, _meshMatMap[i]);
                }
            }
        };

        var loadingIndex = [];

        if (first('.lo1'))
            loadingIndex = [first('.lo1'), first('.lo2'), first('.lo3'), first('.lo4'), first('.lo5')];

        eng.scene.frame = function (t) {



            if (t % 10 < 1 && loadingIndex.length > 0) {

                var index = 4 - ((t % 11 * 31) % 5);// 0..4

                loadingIndex[0].style.opacity = 0.1;
                loadingIndex[1].style.opacity = 0.1;
                loadingIndex[2].style.opacity = 0.1;
                loadingIndex[3].style.opacity = 0.1;
                loadingIndex[4].style.opacity = 0.1;

                loadingIndex[index].style.opacity = 0.8;

            }


            if (t % 20 < 1 && eng.glbWait) {
                eng.glbWait(eng);

            }

            if (eng.scene.call && t - eng.scene.call.t > eng.scene.call.dt) {

                try { eng.scene.call.fun(eng.scene.call.p); } catch (e) { }
                eng.scene.call = null;
            }


            if (camMoveW && camMoveW.tar > 0 && camMoveW.start < camMoveW.tar) {
                camMoveW.start += camMoveW.steps;
                camMoveW.fun(camMoveW.start / camMoveW.tar);
            }

            if (my_List_id != '' && location.search != ''
                && my_List_id.indexOf('#comma' + currModelIden + '_') == -1
                && my_List_id.indexOf(location.search.replace('?', '#comma') + '_') == -1) {
                console.log('please join with admin and work on your area.');
                location = '/setup';
            }


        };

        /*eng.light = eng.maker({ seg: 10, radius: 0.1 }, GB.models.sphare, function (me) {

            me.InLine(` 
            discard;
  
            `).Event(2, 'result.w *=0.4;').Back();
            return me;
        });

        eng.light.position.x = 2.3;
        eng.light.position.y = 2.3;
        eng.light.position.w = 1;*/

        eng.scene.onPointerDown = function (evt, pts) {

            if (camMoveW.start < 1) camMoveW.start = 1.0;

            eng.d = 1;
            eng.dt = new Date().getTime();
            eng.m = null;
            if (pts && pts.hit) {
                eng.m = pts.pickedMesh;
                eng.x = eng.scene.pointerX;
                eng.y = eng.scene.pointerY;

                eng.test = pts.pickedMesh;

            }

            if (pts && pts.hit && pts.pickedMesh.ref) {

                eng.nominatePick = pts.pickedMesh;



            } else {
                if (eng.lastPicked) {
                    eng.lastPicked.material.flagDown(3);
                }
            }

        };
        eng.scene.onPointerMove = function (evt, pts) {

            // if (camMoveW.start < 1) camMoveW.start = 0.95;  

        };
        eng.scene.onPointerUp = function (evt, pts) {

            if (eng.d == 1) {
                eng.d = 0;
                eng.dt = new Date().getTime() - eng.dt;

                if (eng.m && abs(eng.x - eng.scene.pointerX) < 4
                    && abs(eng.y - eng.scene.pointerY) < 4 && eng.dt < 800) {

                    if (eng.nominatePick) {
                        if (eng.lastPicked && eng.lastPicked.ref != eng.nominatePick.ref) {
                            eng.lastPicked.material.flagDown(3);
                        }

                        eng.nominatePick.material.flagUp(3);

                        _sel_step2 = '';

                        _searchItem(eng.nominatePick.ref);

                        eng.lastPicked = eng.nominatePick;


                        setTimeout(() => {
                            if (eng.lastPicked) {
                                eng.lastPicked.material.flagDown(3);
                            }
                        }, 500);

                        eng.nominatePick = null;
                    }

                }
            }



        };


        eng.canvas.addEventListener("wheel", (event) => {

            if (camMoveW.start < 1) camMoveW.start = 1.0;
        });


        InitModel(eng);




    },

};
