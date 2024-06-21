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

            camera.lowerRadiusLimit = 0.05;
            camera.upperRadiusLimit = 100.;


            return camera;
        };

        return setting;
    },


    init: function (eng) {

        eng.camera.attachControl(eng.canvas, true);

        eng.grid = eng.maker({ w: 1, h: 1 }, GB.models.faceXZ, function (me) {

            me.Transparency().InLine(`

             
            result = vec4(0.5,0.5,0.5,0.1);
  
            `).Event(2, 'result.w *=0.4;').Back();
            return me;
        });


        eng.lastLightPos = { x: 0, y: 0, z: -10000, w: 0. };

        document.body.addEventListener('keyup', eng.scene.keyU);
        document.body.addEventListener('keydown', eng.scene.keyD);


        eng.dwStat = {};

        eng.scene.onPointerDown = function (evt, pts) {

            drawer_down(eng, evt, pts);

        };
        eng.scene.onPointerMove = function (evt, pts) {


            drawer_move(eng, evt, pts);

        };
        eng.scene.onPointerUp = function (evt, pts) {
            drawer_up(eng, evt, pts);



        };





        eng.scene.frame = function (t) {

            if(first('#ptp'))first('#ptp').innerHTML = 
               'alpha:'+ floor( eng.camera.alpha*100)/100+' beta:'+floor(eng.camera.beta*100)/100+' radius:'+floor(eng.camera.radius*100)/100 ;

            if(camMoveW && camMoveW.tar > 0 && camMoveW.start < camMoveW.tar){
                camMoveW.start+= camMoveW.steps; 
                 camMoveW.fun(camMoveW.start/camMoveW.tar);
            }

            if (my_List_id != '' && location.search != ''  
            && my_List_id.indexOf(  '#comma'+currModelIden+ '_')  == -1
            && my_List_id.indexOf(location.search.replace('?', '#comma')+ '_')  == -1) {
                console.log('please join with admin and work on your area.');
                location = '/setup';
            }
    

            if (eng.light /*&& ( eng.light.position.x != eng.lastLightPos.x ||
                eng.light.position.y != eng.lastLightPos.y ||
                eng.light.position.z != eng.lastLightPos.z) */) {

                eng.lastLightPos = {
                    x: eng.light.position.x,
                    y: eng.light.position.y,
                    z: eng.light.position.z
                };

                for (var i in eng.scene.meshes) {
                    i = eng.scene.meshes[i];
                    if (i && i.material && i.material.useLight) {
                        i.material.setVector4('lightDir',
                            {
                                x: eng.light.position.x,
                                y: eng.light.position.y,
                                z: eng.light.position.z,
                                w: eng.light.position.w
                            });
                    }
                }
            }



        };

        eng.light = eng.maker({ seg: 10, radius: 0.1 }, GB.models.sphare, function (me) {

            me.InLine(`

             
            result = vec4(1.0,1.0,0.5,1.0);
  
            `).Event(2, 'result.w *=0.4;').Back();
            return me;
        });

        eng.light.position.x = 2.3;
        eng.light.position.y = 2.3;
        eng.light.position.w = 1;

        /* eng.scene.useRightHandedSystem = true;*/

        if (my_List_id != '' && location.search != '' && my_List_id.indexOf(location.search.replace('?', '#comma')+ '_')  == -1) {
           /* alert('please join with admin and work on your area.');
            location = '/setup'; */
        }


        __log('scene is Ready.');

    },

};