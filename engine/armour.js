var armour = function (canvas, camera) {
    this.canvas = canvas;
    this.camera = def(camera, this.camera);
}
var ik = 1;
var reflectPart = function (ref, nrm, scale, brk, x, y, z, bias) {
    var SBP = function(b){ return 'float('+b+')';}
    ik++;
    return 'vec3 new_nrm' + ik + ' = ' + nrm + ';\
    vec3 vr'+ ik + ' = normalize( refract(  normalize(camera -wps*3.141592*length(camera- wps)*' + SBP(scale)
        + ')  ,  new_nrm' + ik + ', ' + SBP(brk) + ') ); \
    float y'+ ik + '= .5+  - atan( ' + SBP(z) + '*vr' + ik + '.z,    ' + SBP(x) + '*vr' + ik + '.x ) / (2.*3.141592);\
    float p'+ ik + '= 0.5  - atan( ' + SBP(y) + '*vr' + ik + '.y, length( vr' + ik + '.xz ) ) / ( 3.141592);\
    result = texture(  '+ ref + ', vec2( y' + ik + ', p' + ik + ') ,' + SBP(bias) + ' );\
    ';
};

armour.prototype = {
    scene: null,
    canvas: null,
    engine: null,
    shader: function (mat, scene, op) {
        return new BABYLONX.ShaderBuilder()

            .Func(function (me) {
                me.Setting.FragmentWorld = true;
                me.Setting.VertexWorld = true;
                me.Setting.Look = true;

                me.FragmentBeforeMain = `

                vec3 getNewUV(vec3 pos,vec3 ps,vec3 n , float sc  ){
           
                 vec3 nps =  (pos-ps)/sc;
           
                
               
                
                 nps = r_y(nps,n.y,vec3(0.)); 
                 nps = r_x(nps,n.x,vec3(0.));
              
        
                 nps = r_z(nps,n.z,vec3(0.00));
           
                 float l1 = max(0.00,min(1.,1.-length(nps)));
                 if(l1>0.00)l1 = max(0.0001,min(1.,  l1-0.5 > 0.001 ? 1.: 0.00 )); 
           
                    vec2 vn = ( 2.00*((nps)*0.5+0.5) ).yx-0.5 ;  
           
                    if(l1 ==0.00 ) vn = vec2(0.00); 
                    
                    return  vec3(vn.x,vn.y,l1);
                }
             
             `;

                me = me.InLine(`

    vec3 wps = vec4(world*vec4(pos,1.)).xyz;
    vec3 wnm =  mat3(world)*nrm;  

        
    `);
                if (mat)
                    return mat(me, op);
                return me;
            }).BuildMaterial(scene);
    },
    pbrMaterial: function (op, scene) {

        

        var mat = function (me, op) {

            me
            .SetUniform('_uvsr', 'vec4')
            .SetUniform('_uvpo', 'vec4')
            .SetUniform('_bs_color', 'vec4')
                .SetUniform('_fs_color', 'vec4')
                .SetUniform('lightDir', 'vec4')
                .SetUniform('_ps_set', 'vec4')
                .SetUniform('_fr_set', 'vec4')
                .SetUniform('iconPlace[90]', 'vec3')
                .Func(function (me) {

                    me.Setting.FragmentWorld = true;
                    me.Setting.VertexWorld = true;
                    me.Setting.Look = true;
                    me = me.InLine(` 

                 
            vec4 res = vec4(0.);
            vec4 pre_res = vec4(0.,0.,0.,-1. );
            float h_v = 1.;
            float discardCond = 0.;
            float alb_alpha = 0.; 
           
    
            vec3 wpos_p = vec4(world*vec4(pos,1.)).xyz;
     
    
            vec4 res_hover = vec4(0.); 
     
            vec3 vn = vec3(0.); `);
                    if (1==0 && (!op || !op.noLayer)) {

                        for (var i = 0; i < 0; i++) {

                            me = me.InLine(`  
                      vn = getNewUV(wpos_p, iconPlace[`+ (i * 3) + `]  ,iconPlace[` + (i * 3 + 1.) + `]    ,iconPlace[` + (i * 3 + 2.) + `].x ); 
               
                    `)
                                .Map({ path: '../Images/none.svg?' + i, alpha: 1, uv: 'vec2(vec2(vn.xy )*vec2( 1.0,1.))' })
                                .InLine(`  
    
                    alb_alpha = max(alb_alpha,vn.z); 
        
                    if(vn.x <=0.0001 && vn.y <=  0.0001 ){ result.xyz = res.xyz;  result.w = res.w;}
                     
                    result.xyz = mix(res.xyz,result.xyz,result.w*vn.z); 
                    result.w  = max(0., result.w*vn.z );
    
                      
                    vec4 res_ref_`+ i + ` = result ; 
    
    
                    if(iconPlace[`+ (i * 3 + 2.) + `].y == 1.0){
    
                    } 
                     else {res.xyz = res_ref_`+ i + `.xyz;  
                }
    
                res.w =   max(res_ref_`+ i + `.w,res.w);
    
                    `);
                        }
                        /** make hover ** just can make minimal color */
                        for (var i = 0; i < 6; i++) {
                            me.InLine(`  
    
                    if(iconPlace[`+ (i * 3 + 2.) + `].y == 1.0){
    
                        pre_res.xyz =   res_ref_`+ i + `.xyz*0.75; 
                        h_v =1.0;
    
                        pre_res.w =   max(res_ref_`+ i + `.w,pre_res.w);
    
                    } 
                     else {   }
    
                    `)
                        }

                        me.InLine(`
    
                 res  = max(res,pre_res);
    
                /* if(h_v > 0. &&  pre_res.w !=-1. ){
                    res.xyz+= vec3(1.,0.,0.);
                 } */
                
                
                `);


                    }

                    /* for(var i = 0;i<4;i++){
         
                         me =  me.InLine(`  
                           res.x  += 1.- max(0.,min(1.,length(pos - iconPlace[`+(i*3)+`])))  ; 
                    
                         `)
         
                     } */


                    return me;
                })

                .InLine(` 
            
            vec4 _light = vec4( 1.);
            vec4 _base = vec4( .0);
            float alpha = 1.0;
            vec3 _shad = vec3(1.);
            vec4 _disp = vec4(0.,0.,0.,0.);
            vec3 _amb = vec3(0.);
            vec4 _ref = vec4(0.,0.,0.,0.);
            vec3 _psf = vec3(0.0); /*phonge,specular,fresnel*/
            vec2 nUv = r_y(vec3(vuv.x*_uvsr.x+_uvpo.x,0.,vuv.y*_uvsr.y+_uvpo.y),_uvsr.z,vec3(0.5)).xz;
            
            `);

            if (op.cusUV && op.cusUV != '') {


                op.cusUVMode = def(op.cusUVMode, 'sphare');

                if (op.cusUVMode == 'sphare') {

                    me.InLine(
                        `
                    vec3 e_ref_UV = normalize( vec3(  `+ op.cusUV + ` ) );
                    vec3 n_ref_UV = normalize(  `+ op.cusUV + `);
                        vec3 r_ref_UV = reflect( e_ref_UV, n_ref_UV );
                        r_ref_UV = r_y(r_ref_UV,float(  `+ def(op.cusUVRot, 0) + `),vec3(0.));
                        float m_ref_UV = 2. * sqrt(
                            pow( r_ref_UV.x, 2. ) +
                            pow( r_ref_UV.y, 2. ) +
                            pow( r_ref_UV.z + float(`+ def(op.cusUVZ, 0.) + `), 2. )
                        );
                        nUv = r_ref_UV.xy / m_ref_UV + .5;
                        nUv = r_y(vec3(nUv.x*_uvsr.x,0.,nUv.y*_uvsr.y),_uvsr.z,vec3(0.5)).xz;
                        `
                    )
                }
                else if (op.cusUVMode == 'x') {
                    me.InLine(
                        ` 
                    
                        nUv =  r_x(`+ op.cusUV + `,float(  ` + def(op.cusUVRot, 0) + `),vec3(0.0,float(` + def(op.cusUVZ, 0.) + `),0.)).xz;
                        nUv = r_y(vec3(nUv.x*_uvsr.x,0.,nUv.y*_uvsr.y),_uvsr.z,vec3(0.5)).xz;
                        `
                    )
                }
                else if (op.cusUVMode == 'normal') {
                    me.InLine(
                        `   
                        nUv =   `+ op.cusUV.replace('normal_xyz', 'pos.xy~pos.xz~pos.xy~pos.zy').split('~')[0] + ` ;
                        if(abs(nrm.y) > `+ def(op.cusUVZ, 0.5) + ` )  nUv =   ` + op.cusUV.replace('normal_xyz', 'pos.xy~pos.xz~pos.xy~pos.zy').split('~')[1] + ` ;
                        else if(abs(nrm.z) > `+ def(op.cusUVZ, 0.5) + ` )  nUv =   ` + op.cusUV.replace('normal_xyz', 'pos.xy~pos.xz~pos.xy~pos.zy').split('~')[2] + ` ;
                        else if(abs(nrm.x) > `+ def(op.cusUVZ, 0.5) + ` )  nUv =   ` + op.cusUV.replace('normal_xyz', 'pos.xy~pos.xz~pos.xy~pos.zy').split('~')[3] + ` ;


                        nUv = r_y(vec3(nUv.x*_uvsr.x,0.,nUv.y*_uvsr.y),_uvsr.z,vec3(0.5)).xz;
                        `
                    )
                } else {
                    me.InLine(
                        `  
                    
                        nUv =   `+ op.cusUV + `  ;
                        nUv = r_y(vec3(nUv.x*_uvsr.x,0.,nUv.y*_uvsr.y),_uvsr.z,vec3(0.5)).xz;
                        `
                    )
                }


            }

            if (op.glass) {

            }

            if (op.disp && op.disp.indexOf('none.svg') == -1) {

                me.Map({ alpha: 1, path: uc(op.disp), uv: 'vec2(nUv*float( _uvsr.w))' }).InLine(`
                
                _disp  = result ; 

                `);

            }

            if (op.base && op.base.indexOf('none.svg') == -1) {

                me.Map({ alpha: 1, path: uc(op.base), uv: 'vec2(nUv)' }).InLine(`
                _base.w = 1.0;
                _base.xyz = result.xyz;
                alpha = result.w ;
                `);

            }
            if (op.trans) {
                me = me.Transparency();

            }
            if (op.bump) {

            }
            if (op.ref) {

            }
            if (op.rough) {

            }
            if (op.phonge) {

            }
            if (op.specular) {

            }
            if (op.fresnel) {

            }
            if (op.ambiant) {

            }
            if (op.lightMap) {

            } 
              me.Map({ alpha: 1, path: '/images/none.svg', uv: 'vec2(vuv*vec2(float('+(window.__Data && window.__Data.uvMap? window.__Data.uvMap.u:1.0)+')*1.0,float('+(window.__Data && window.__Data.uvMap? window.__Data.uvMap.v:1.0)+')*1.0))' }).InLine(`
                 
                vec4 l1 = result ; 
                `);
            me.InLine(` 

            vec4 _map_set = vec4(1.);

            if(_disp.w > 0.00){
                _map_set = _disp;
            }
             
            _psf.x =  dot(wnm, (float(`+op.lightScaleArea+`)*(0.5+0.5*_map_set.x))* normalize( camera-wps))*_map_set.x  ;
            float _def_dt =  dot(wnm, (float(`+op.lightScaleArea+`))* normalize( camera-wps))   ;

            //  ('_ps_set', 'vec4')
            //  ('_fr_set', 'vec4') 

            _psf.y = min(1.,max(0.,pow(_psf.x, _fr_set.z) * _fr_set.z)) ;
            _psf.y = min(1.,max(0.,pow( _psf.y, _fr_set.y) * _fr_set.x)) *_ps_set.z*_map_set.x  ;
            _psf.z =  (1.- min(1.,max(0.,_psf.x))) *_ps_set.w     ;
             
            vec3 _res = _base.xyz;
            vec3 _sc_color =_fs_color.xyz;  

            result  = vec4(vec3(_base.xyz *(_bs_color.xyz*(_fr_set.w)+(1.-_fr_set.w) *_psf.x) )*(_ps_set.x+_ps_set.y*_psf.x) 
            + _psf.y+ 0.75* ( _psf.z*_sc_color*(_bs_color.xyz*(_fr_set.w)+(1.-_fr_set.w) *_psf.x) )
            ,alpha ); 
            
            result.xyz = mix(result.xyz,   l1.xyz*(0.9+0.2*mix(_psf.x*0.75+0.25,1.,1.-length(l1.xyz)))  ,l1.w);

            
            
            `)
                .Event(2, 'result.xyz = result.xyz*0.75 +vec3(1.0,0.,0.)*0.25;')
                .Event(3, 'result.xyz = result.xyz*0.75 +vec3(1.0,0.5,0.)*0.25;')
                .Event(4, 'result.xyz = result.xyz*0.75 +vec3(1.0,1.,0.)*0.25;')
                .Event(5, 'result.xyz = result.xyz*0.5 +vec3(0.0,0.,1.0)*0.5;')
                .Event(6, ' float ns = noise(wps*30.0); if(ns>0.) discard; ')
                ;

            if (op.trans) {
                me.InLine('result.w = alpha;');
            }

            if (op.backFace && op.backFace != '') {
                me.Back(op.backFace);
            }

            me.VertexShader(`

               vec3 ps = pos;   
               
                result.xyz = ps;

            `);


            return me;
        };

        var shad = r_mur.shader(mat, scene, op);
        shad.useLight = true;
        shad.hasLayerMaterial = true;
        shad.hasEvent = true;
        shad.setVector4('lightDir', { x: 0, y: 0, z: 0, w: 20. });
        shad.setVector4('_uvsr', { x: 1, y: 1, z: 0, w: 1. });
        var iconPosValue = [];

        for (var i = 0; i < 90 * 3; i++) {
            if (!iconPosValue[i]) iconPosValue[i] = 0;
        }

        // shad.setArray3('iconPlace', iconPosValue);

        shad.setSetting = function (op) {

            op = def(op, {});

            var color = hexToRgb(def(op.color, '#ffffff'), 256);
            var fscolor = hexToRgb(def(op.fscolor, '#555555'), 256);

            var uvs = {
                x: def(op.uvsx, 1).valueOf() * 1.0,
                y: def(op.uvsy, 1).valueOf() * 1.0,
                z: def(op.uvr, 0).valueOf() * 1.0, w: def(op.uvsnxy, 1.0).valueOf() * 1.0
            };

            var uvp = {
                x: def(op.uvpx, 1).valueOf() * 1.0,
                y: def(op.uvpy, 1).valueOf() * 1.0,
                z:  1.0, w:  1.0
            };

            this.setVector4('_uvsr', uvs);
            this.setVector4('_uvpo', uvp);
            this.setVector4('_bs_color', {
                x: color.r,
                y: color.g,
                z: color.b, w: 1
            });
            this.setVector4('_fs_color', {
                x: fscolor.r,
                y: fscolor.g,
                z: fscolor.b, w: 1
            });
            this.setVector4('_ps_set', {
                x: (op.li1a ? op.li1a : 1.0).valueOf() * 1.0,
                y: (op.li1b ? op.li1b : 1.0).valueOf() * 1.0,
                z: (op.li1c ? op.li1c : 1.0).valueOf() * 1.0,
                w: (op.li1d ? op.li1d : 1.0).valueOf() * 1.0,
            });
            this.setVector4('_fr_set', {
                x: (op.li2a ? op.li2a : 1.0).valueOf() * 1.0,
                y: (op.li2b ? op.li2b : 1.0).valueOf() * 1.0,
                z: (op.li2c ? op.li2c : 1.0).valueOf() * 1.0,
                w: (op.li2d ? op.li2d : 1.0).valueOf() * 1.0,
            });
        };

        shad.setSetting(op);


        return shad;
    },
    maker: function (op, builder, mat, init) {

        var gb = new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom)).toMesh(this.scene);

        if (mat)
            gb.material = armour.prototype.shader(mat, this.scene);

        if (init) init(gb, gb.material);

        return gb;
    },
    view3D: function (eng, pos, tag) {
        if (pos)
            eng.camera.position = BABYLON.Vector3(pos.x, pos.y, pos.z);

        if (tag)
            eng.camera.setTarget(BABYLON.Vector3(eng.camera.position.x + def(tag.x, 0),
                eng.camera.position.y + def(tag.y, 0),
                eng.camera.position.z + def(tag.z, 0)));

    },
    viewAngle: function (eng, pos, animated) {


        if (animated) {

        }
        else {

            if (pos.x || pos.y || pos.z) {
                eng.camera.setTarget(BABYLON.Vector3(def(pos.x, eng.camera._currentTarget.x),
                    eng.camera.position.y + def(pos.y, eng.camera._currentTarget.y),
                    eng.camera.position.z + def(pos.z, eng.camera._currentTarget.z)));
            }
            if (pos.a != undefined) eng.camera.alpha = pos.a;
            if (pos.b != undefined) eng.camera.beta = pos.b;
            if (pos.r != undefined) eng.camera.radius = pos.r;
            if (pos.f != undefined) eng.camera.fov = pos.f;
            if (pos.mn != undefined) eng.camera.minZ = pos.mn;
            if (pos.mx != undefined) eng.camera.maxZ = pos.mx;
        }
    },
    initCamera: function (scene, setting) {
        var scene = this.scene;
        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
        return camera;
    },
    create: function (setting) {

        var th = this;

        BABYLONX.ShaderBuilder.InitializeEngine();
        BABYLONX.GeometryBuilder.InitializeEngine();

        // This creates a basic Babylon Scene object (non-mesh)

        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true });

        this.scene = new BABYLON.Scene(this.engine);

        var scene = this.scene;

        var time = 0;

        scene.keys = "";
        scene.keyD = function (event) {
            var k = ',' + event.keyCode + ',';
            scene.keys = scene.keys.replaceAll(k, '') + k;
            //scene.alpha_view = scene.activeCamera.alpha;

            scene.KeyShift = event.shiftKey;
            scene.KeyAlt = event.altKey;
            scene.KeyCtrl = event.ctrlKey;


            if (event.keyCode == 112) scene.KeyF1 = 1;
            if (event.keyCode == 113) scene.KeyF2 = 1;
            if (event.keyCode == 114) scene.KeyF3 = 1;
            if (event.keyCode == 115) scene.KeyF4 = 1;
            if (event.keyCode == 116) scene.KeyF5 = 1;
            if (event.keyCode == 117) scene.KeyF6 = 1;
            if (event.keyCode == 118) scene.KeyF7 = 1;
            if (event.keyCode == 119) scene.KeyF8 = 1;

            if (event.keyCode == 87) scene.KeyW = 1;
            if (event.keyCode == 83) scene.KeyS = 1;
            if (event.keyCode == 65) scene.KeyA = 1;
            if (event.keyCode == 68) scene.KeyD = 1;
            if (event.keyCode == 81) scene.KeyQ = 1;
            if (event.keyCode == 69) scene.KeyE = 1;

            if (event.keyCode == 90) scene.KeyZ = 1;

            if (event.keyCode == 46) scene.KeyDelete = 1;
            if (event.keyCode == 8) scene.KeyBackspace = 1;

            if (event.keyCode == 38) scene.KeyUp = 1;
            if (event.keyCode == 40) scene.KeyDown = 1;
            if (event.keyCode == 37) scene.KeyLeft = 1;
            if (event.keyCode == 39) scene.KeyRight = 1;
            if (event.keyCode == 32) scene.KeySpace = 1;
            if (event.keyCode == 13) scene.KeyEnter = 1;
            if (event.keyCode == 82) scene.KeyR = 1;
            if (event.keyCode == 84) scene.KeyT = 1;

        }

        scene.keyU = function (event) {
            var k = ',' + event.keyCode + ',';
            scene.keys = scene.keys.replaceAll(k, '');

            scene.KeyShift = false;
            scene.KeyAlt = false;
            scene.KeyCtrl = false;


            scene.key = event.key;

            if (event.keyCode == 112) scene.KeyF1 = 0;
            if (event.keyCode == 113) scene.KeyF2 = 0;
            if (event.keyCode == 114) scene.KeyF3 = 0;
            if (event.keyCode == 115) scene.KeyF4 = 0;


            if (event.keyCode == 87) scene.KeyW = 0;
            if (event.keyCode == 83) scene.KeyS = 0;
            if (event.keyCode == 65) scene.KeyA = 0;
            if (event.keyCode == 68) scene.KeyD = 0;
            if (event.keyCode == 81) scene.KeyQ = 0;
            if (event.keyCode == 69) scene.KeyE = 0;
            if (event.keyCode == 38) scene.KeyUp = 0;

            if (event.keyCode == 90) scene.KeyZ = 0;

            if (event.keyCode == 46) scene.KeyDelete = 0;
            if (event.keyCode == 8) scene.KeyBackspace = 0;


            if (event.keyCode == 40) scene.KeyDown = 0;
            if (event.keyCode == 37) scene.KeyLeft = 0;
            if (event.keyCode == 39) scene.KeyRight = 0;
            if (event.keyCode == 32) scene.KeySpace = 0;
            if (event.keyCode == 13) scene.KeyEnter = 0;
            if (event.keyCode == 82) scene.KeyR = 0;
            if (event.keyCode == 84) scene.KeyT = 0;

        }


        scene.clearColor = new BABYLON.Color4(def(setting.color.x, 0), def(setting.color.y, 0), def(setting.color.z, 0), setting.color.w != null ? setting.color.w : 1);

        this.camera = this.initCamera(scene, setting);

        keyCodeCheck = 0;
        kyCheck = function (ks) {
            if (keyCodeCheck) return 0;
            var f = 1;
            for (var i in ks) {
                if (scene.keys.indexOf(',' + ks[i] + ',') == -1) {
                    f = 0;
                }
            }
            if (f == 1) {
                keyCodeCheck = 1;
                setTimeout(() => {
                    keyCodeCheck = 0;
                }, 300);
            }
            return f;
        }

        scene.time = 0;


        scene.registerBeforeRender(function () {

            scene.time++;



            if (scene.frame) scene.frame(scene.time);


            new BABYLONX.ShaderMaterialHelper().SetUniforms(
                scene.meshes,
                scene.activeCamera.position,
                scene.activeCamera._currentTarget,
                { x: 0, y: 0 },
                { x: 100, y: 100 },
                scene.time);

        });

        this.engine.runRenderLoop(function () {

            if (th.keyFrame) th.keyFrame(scene.time);

            if (!scene.pause)
                scene.render();
        });

        return scene;
    }
    ,
    curve: {
        addPoint: function (main3D, p, iden, index, f) {

            if (!main3D.point_h) {
                main3D.point_h = main3D.maker({ seg: 10, radius: 0.01 }, GB.models.sphare, function (me) {
                    me.Solid({ r: 1, g: 0.8, b: 0.3 })
                        .Event(2, 'result.xyz = vec3(1.,0.5,0.);')
                        .Event(3, 'result.xyz = vec3(1.,1.0,0.);')
                        .Event(5, 'result.xyz = vec3(0.,1.0,0.);')

                        ; return me
                });
                main3D.point_h.visibility = 0;
                main3D.point_h.isPickable = 0;


                main3D.point_sel = main3D.maker({ seg: 10, radius: 0.015 }, GB.models.sphare, function (me) {
                    me.Solid({ r: 0.3, g: 1.0, b: 0.3, a: 0.5 })
                        .Event(2, 'result.xyz = vec3(1.,0.5,0.);')
                        .Event(3, 'result.xyz = vec3(1.,1.0,0.);')
                        .Transparency()

                        ; return me
                });
                main3D.point_sel.visibility = 0;
                main3D.point_sel.isPickable = 0;
            }

            if (!main3D.point_t) {
                main3D.point_t = main3D.maker({ seg: 10, radius: 0.008 }, GB.models.sphare, function (me) {
                    me.Solid({ r: .7, g: .7, b: .5 })
                        .Event(2, 'result.xyz = vec3(1.,0.5,0.);')
                        .Event(3, 'result.xyz = vec3(1.,1.0,0.);')

                        ; return me
                });

                main3D.point_t.visibility = 0;
                main3D.point_t.isPickable = 0;

                main3D.point_t2 = main3D.maker({ seg: 10, radius: 0.008 }, GB.models.sphare, function (me) {
                    me.Solid({ r: .5, g: .7, b: .7 })
                        .Event(2, 'result.xyz = vec3(1.,0.5,0.);')
                        .Event(3, 'result.xyz = vec3(1.,1.0,0.);')

                        ; return me
                });

                main3D.point_t2.visibility = 0;
                main3D.point_t2.isPickable = 0;

                main3D.point_l = main3D.maker({ s: 10, d: 1, w: 0.0015, h: 0.0015, x: 0., y: 0., z: 1.0 }, GB.models.column, function (me) {
                    me.Solid({ r: 1, g: 1, b: 1, a: 0.2 })
                        .Transparency()
                        ; return me
                });

                main3D.point_l.visibility = 0;
                main3D.point_l.isPickable = 0;

            }



            var model = main3D.point_h.clone();
            model.visibility = 1;
            model.isPickable = 1;
            model.dragable = 1;
            model.isPoint = 1;

            model.sel = main3D.point_sel.clone();
            model.sel.parent = model;

            model.p1 = main3D.point_t.clone();
            model.p1_line = main3D.point_l.clone();
            model.p2 = main3D.point_t2.clone();
            model.p2_line = main3D.point_l.clone();

            model.p1.isPoint = 1;
            model.p2.isPoint = 1;

            model.p1.left = 1;
            model.p1.isSub = 1;
            model.p2.right = 1;
            model.p2.isSub = 1;

            model.updateLines = function (model) {
                var p1 = {
                    x: model.p1.position.x,
                    y: model.p1.position.y,
                    z: model.p1.position.z
                };
                var lp1 = pow(pow(p1.x) + pow(p1.y) + pow(p1.z), 0.5);
                model.p1_line.scaling.z = lp1;

                var p2 = {
                    x: model.p2.position.x,
                    y: model.p2.position.y,
                    z: model.p2.position.z
                };
                var lp2 = pow(pow(p2.x) + pow(p2.y) + pow(p2.z), 0.5);
                model.p2_line.scaling.z = lp2;

                model.p1_line.lookAt(model.p1.position);
                model.p2_line.lookAt(model.p2.position);
            };

            model.p1.visibility = 1;
            model.p1_line.visibility = 1;
            model.p1.isPickable = 1;
            model.p1.dragable = 1;
            model.p1.position.x = .015;
            model.p1.solid = true;

            model.p2.visibility = 1;
            model.p2_line.visibility = 1;
            model.p2.isPickable = 1;
            model.p2.dragable = 1;
            model.p2.position.x = 0.015;
            model.p2.position.z = 0.005;
            model.p2.solid = true;

            model.p1.parent = model;
            model.p2.parent = model;
            model.p1_line.parent = model;
            model.p2_line.parent = model;

            model.position.x = p.pickedPoint.x;
            model.position.y = p.pickedPoint.y;
            model.position.z = p.pickedPoint.z;

            model.seg = p.seg;
            model.pow = p.pow;
            model.lvl = p.lvl;
            model.ref = p.ref;
            model.useRef = p.useRef;
            model.func = p.func;
            model.hgt = p.hgt;
            model.cnt = p.cnt;

            if (!main3D.scene.points) main3D.scene.points = [];

            main3D.scene.points.push({ m: model, iden: iden, index: index });


            if (p.p1) {

                model.p1.position.x = p.p1.x;
                model.p1.position.y = p.p1.y;
                model.p1.position.z = p.p1.z;
                model.p1.solid = false;
            }

            if (p.p2) {
                model.p2.position.x = p.p2.x;
                model.p2.position.y = p.p2.y;
                model.p2.position.z = p.p2.z;
                model.p2.solid = false;
            }


            model.updateLines(model);


            model.index = index;
            model.iden = iden;

            if (f) { f(model); }

            return model;

        },

        addPointAsync: async function (main3D, p, iden, index, f) {
            return new Promise((resolve) => {
                resolve(r_mur.curve.addPoint(main3D, p, iden, index, f));
            });
        },

        getPoints: function (main3D, struct) {
            return new Promise((resolve) => {
                var d_t = new Date().getTime();
                var dt = [];

                if (!struct.start.p && !struct.ref && ref != "" && ref_fn) {

                    return ref_fn(buffer, struct.ref);

                } else if (struct.start.p) {

                    var lst_model = {
                        x: struct.start.p.x,
                        y: struct.start.p.y,
                        z: struct.start.p.z
                    };

                    dt.push(r_mur.curve.addPoint(main3D, {

                        pickedPoint: {
                            x: struct.start.p.x,
                            y: struct.start.p.y,
                            z: struct.start.p.z
                        },
                        seg: struct.start.seg,
                        pow: struct.start.pow,
                        lvl: struct.start.lvl,
                        ref: struct.start.ref,
                        useRef: struct.start.useRef,
                        func: struct.start.func,
                        hgt: struct.start.hgt,
                        cnt: struct.start.cnt,

                        p1: !struct.start.p1 ? null : { x: struct.start.p1.x, y: struct.start.p1.y, z: struct.start.p1.z },
                        p2: !struct.start.p2 ? null : { x: struct.start.p2.x, y: struct.start.p2.y, z: struct.start.p2.z },

                    }, struct.iden.valueOf() * 1, struct.start.index));


                    for (var i in struct.data) {


                        i = struct.data[i];

                        lst_model = {
                            x: lst_model.x + i.dir.x * i.len,
                            y: lst_model.y + i.dir.y * i.len,
                            z: lst_model.z + i.dir.z * i.len
                        };

                        dt.push(r_mur.curve.addPoint(main3D, {

                            pickedPoint: {
                                x: lst_model.x,
                                y: lst_model.y,
                                z: lst_model.z
                            },

                            seg: i.seg,
                            pow: i.pow,
                            lvl: i.lvl,
                            ref: i.ref,
                            func: i.func,
                            useRef: i.useRef,

                            hgt: i.hgt,
                            cnt: i.cnt,

                            p1: !i.p1 ? null : { x: i.p1.x, y: i.p1.y, z: i.p1.z },
                            p2: !i.p2 ? null : { x: i.p2.x, y: i.p2.y, z: i.p2.z },

                        }, struct.iden.valueOf() * 1, i.index));

                    }

                    resolve(dt);
                }
            });
        },

        getPointsOfRef: function (buffer, ref) {
            var th = this;

            var r = ref.split(',');
            function getNum(s) {

                var v = { n: '' };

                for (var i = 0; i < s.length; i++) {
                    if (('0123456789').indexOf(s[i]) != -1) v.n += s[i];
                    else {
                        v.n = v.n.valueOf() * 1;
                        v.s = s.substr(i);
                        return v;
                    }
                }
                v.n = v.n.valueOf() * 1;
                return v;
            }
            var poses = [];
            for (var i in r) {
                var v = getNum(r[i]);
                var rs = buffer[v.n];

                var res = r_mur.curve.strToPoints(buffer[v.n].str,
                    buffer[v.n].cls,
                    buffer[v.n].rev,
                    buffer[v.n].dup, buffer, null, v.s);

                poses = poses.concat(res);
            }
            return poses;
        },

        strToPoints: function (struct, close, reverse, dup, buffer, ref_fn, requiredRef) {
            var d_t = new Date().getTime();
            var dt = [];

            if (!struct.start.p && struct.ref && ref != "" && ref_fn) {
                var s = ref_fn(buffer, struct.ref);

                return s;

            } else if (struct.start.p) {

                var lst_model = {
                    x: struct.start.p.x,
                    y: struct.start.p.y,
                    z: struct.start.p.z
                };


                dt.push({
                    seg: struct.start.seg,
                    pow: struct.start.pow,
                    lvl: struct.start.lvl,
                    ref: struct.start.ref,
                    useRef: struct.start.useRef,


                    p: {
                        x: struct.start.p.x,
                        y: struct.start.p.y,
                        z: struct.start.p.z
                    },
                    func: struct.start.func,
                    cnt: struct.start.cnt,
                    hgt: struct.start.hgt,
                    p1: !struct.start.p1 ? null : { x: struct.start.p1.x, y: struct.start.p1.y, z: struct.start.p1.z },
                    p2: !struct.start.p2 ? null : { x: struct.start.p2.x, y: struct.start.p2.y, z: struct.start.p2.z }
                });

                for (var i in struct.data) {

                    i = struct.data[i];

                    lst_model = {
                        x: lst_model.x + i.dir.x * i.len,
                        y: lst_model.y + i.dir.y * i.len,
                        z: lst_model.z + i.dir.z * i.len
                    };


                    dt.push({
                        seg: i.seg,
                        pow: i.pow,
                        lvl: i.lvl,
                        ref: i.ref,
                        useRef: i.useRef,
                        func: i.func,
                        cnt: i.cnt,
                        hgt: i.hgt,
                        p: {
                            x: lst_model.x,
                            y: lst_model.y,
                            z: lst_model.z
                        },
                        p1: !i.p1 ? null : { x: i.p1.x, y: i.p1.y, z: i.p1.z },
                        p2: !i.p2 ? null : { x: i.p2.x, y: i.p2.y, z: i.p2.z },
                    });
                }

                var psii = [dt[0].p];

                for (var i = 1; i < dt.length; i++) {

                    if (!dt[i - 1].p1) dt[i - 1].p1 = { x: 0, y: 0, z: 0 };
                    if (!dt[i].p2) dt[i].p2 = { x: 0, y: 0, z: 0 };

                    var f = null;
                    if (dt[i - 1].func && dt[i - 1].func.replaceAll('\n', '').replaceAll(' ', '').length > 1) {
                        f = js(`function(p,i,a,b,n){ 
                        if(i==0) return p;
                        if(i==n) return p;
                        var v = i/n;
                        
                        `+ (dt[i - 1].cnt ? 'c = ' + dt[i - 1].cnt + ';' : '') + (dt[i - 1].hgt ? 'h = ' + dt[i - 1].hgt + ';' : '') + dt[i - 1].func.replaceAll('\n', '') + `

                        return p;
                    }`);
                    }

                    var ref = def(dt[i - 1].ref, '');

                    var res, res1;

                    if (requiredRef && dt[i - 1].ref == requiredRef)
                        res1 = [dt[i - 1].p];

                    if ((!dt[i - 1].useRef || dt[i - 1].useRef == '') && (!requiredRef || dt[i - 1].ref == requiredRef))
                        res = GB.path3D(dt[i].p, dt[i].p2, dt[i - 1].p, dt[i - 1].p1,
                            {
                                seg: floor(def(dt[i - 1].seg, 32)),
                                power: def(dt[i - 1].pow, 1),
                                level: def(dt[i - 1].lvl, 1),
                                f: f,
                                r: ref && ref != '' ? struct.iden + '~' + def(dt[i - 1].ref, '') : null
                            });
                    else if (dt[i - 1].useRef && dt[i - 1].useRef != '') {
                        res = ref_fn(buffer, dt[i - 1].useRef);
                    }


                    if (requiredRef && dt[i - 1].ref == requiredRef)
                        return res1.concat(res);

                    // psii = psii.concat(dt[i-1].p); 
                    psii = psii.concat(res);
                }

                if (close) psii.push(dt[0].p);

                if (dup) {
                    var psij = [];
                    for (var i in psii) {
                        psij.push(psii[i]);
                        psij.push(psii[i]);
                    }
                    psii = psij;
                }

                if (reverse) {
                    psii = psii.reverse();
                }

                return psii;
            }
        },

        hideHelperPoints: function (main3D) {
            for (var ms in main3D.scene.meshes) {
                ms = main3D.scene.meshes[ms];
                if (ms.isPoint) {
                    ms.visibility = 0;
                    if (ms.p1_line) ms.p1_line.visibility = 0;
                    if (ms.p2_line) ms.p2_line.visibility = 0;
                }
            }
        },

        showHelperPoints: function (main3D, iden) {
            for (var ms in main3D.scene.meshes) {
                ms = main3D.scene.meshes[ms];
                if ((ms.isPoint && ms.iden == iden) ||
                    (ms.isPoint && ms.isSub && ms.parent.iden == iden)
                ) {
                    if (ms.p1_line) ms.p1_line.visibility = 1;
                    if (ms.p2_line) ms.p2_line.visibility = 1;

                    ms.visibility = 1;
                }
            }
        },

        toStruct: async function (model, iden, ref) {

            return new Promise((resolve) => {

                var d_t = new Date().getTime();

                var dt = { iden: iden, start: {}, data: [], ref: null };

                if (ref.refs) { dt.ref = ref.refs; }

                var idn = null;

                for (var i in model) {

                    if (idn == null) {
                        dt.start = {
                            index: i,
                            seg: model[i].seg,
                            pow: model[i].pow,
                            lvl: model[i].lvl,
                            ref: model[i].ref,
                            useRef: model[i].useRef,
                            func: model[i].func,
                            cnt: model[i].cnt,
                            hgt: model[i].hgt,
                            p: {
                                x: model[i].position.x,
                                y: model[i].position.y,
                                z: model[i].position.z
                            },
                            p1: model[i].p1.solid ? null : {
                                x: model[i].p1.position.x,
                                y: model[i].p1.position.y,
                                z: model[i].p1.position.z
                            },
                            p2: model[i].p2.solid ? null : {
                                x: model[i].p2.position.x,
                                y: model[i].p2.position.y,
                                z: model[i].p2.position.z
                            }
                        };
                        idn = 0;
                    }
                    else {

                        var prv = prevIndex(model, i);

                        p = model[i].position;
                        p1 = model[prv].position;


                        var len = sqrt(pow(p.x - p1.x) + pow(p.y - p1.y) + pow(p.z - p1.z));

                        var dir = len == 0 ? { x: 0, y: 0, z: 0 } : {
                            x: (p.x - p1.x) / len,
                            y: (p.y - p1.y) / len,
                            z: (p.z - p1.z) / len
                        };

                        dt.data[idn] = {
                            index: i,
                            len: len,
                            dir: dir,

                            seg: model[i].seg,
                            pow: model[i].pow,
                            lvl: model[i].lvl,
                            ref: model[i].ref,
                            useRef: model[i].useRef,
                            func: model[i].func,
                            hgt: model[i].hgt,
                            cnt: model[i].cnt,
                            p1: model[i].p1.solid ? null : {
                                x: model[i].p1.position.x,
                                y: model[i].p1.position.y,
                                z: model[i].p1.position.z
                            },
                            p2: model[i].p2.solid ? null : {
                                x: model[i].p2.position.x,
                                y: model[i].p2.position.y,
                                z: model[i].p2.position.z
                            }
                        };

                        idn++;
                    }
                }

                dt.prpTime = (new Date().getTime() - d_t);

                resolve(dt);
            });
        },
        applyPos: function (eng, dir, mode, curr, value) {

            var th = eng;
            var mn = 1000000, mx = -1000000;
            var mni = -1, mxi = -1;
            var exp_list = [];

            for (var i in th.scene.points) {
                if (th.scene.points[i].sel && (curr == -1 || curr == th.scene.points[i].iden)) {

                    // if (!th.scene.points[i].m.pos) if we wanna have svae after apply
                    th.scene.points[i].m.pos = th.scene.points[i].m.position.clone();

                    mx = max(mx, th.scene.points[i].m.pos[dir]);
                    if (mx == th.scene.points[i].m.pos[dir]) mxi = i;
                    mn = min(mn, th.scene.points[i].m.pos[dir]);
                    if (mn == th.scene.points[i].m.pos[dir]) mni = i;
                }
            }

            if (mode == 'expand') {
                var mnp = th.scene.points[mni].m.position;
                var mxp = th.scene.points[mxi].m.position;

                for (var i in th.scene.points) {
                    if (th.scene.points[i].sel && (curr == -1 || curr == th.scene.points[i].iden)) {
                        var p = th.scene.points[i].m.position;
                        var dis = sqrt(pow(p.x - mnp.x) + pow(p.y - mnp.y) + pow(p.z - mnp.z));
                        exp_list.push({ d: dis, i: i });
                    }
                }

                exp_list = exp_list.sort(function (a, b) { return a.d - b.d; });

                var dx = (mx - mn) / (exp_list.length - 1);

                for (var j in exp_list) {
                    th.scene.points[exp_list[j].i].m.position[dir] = mn + j * dx;
                    var obj = th.scene.points[exp_list[j].i];

                    GB.updateConnect(th.scene,
                        _rimsModel[obj.iden],
                        (obj.index));
                }


            } else
                for (var i in th.scene.points) {
                    if (th.scene.points[i].sel && (curr == -1 || curr == th.scene.points[i].iden)) {
                        if (mode == 'left')
                            th.scene.points[i].m.position[dir] = mn;
                        else if (mode == 'right')
                            th.scene.points[i].m.position[dir] = mx;
                        else if (mode == 'center')
                            th.scene.points[i].m.position[dir] = (mn + mx) / 2;
                        else if (mode == 'exact')
                            th.scene.points[i].m.position[dir] = value.valueOf() * 1;

                        var obj = th.scene.points[i];

                        GB.updateConnect(th.scene,
                            _rimsModel[obj.iden],
                            (obj.index));
                    }
                }

            _saveRim();

        }
    },
    call: {
        nurbs: function (eng, ref, _rims) {

            if (ref.model && ref.model.mirror) ref.model.mirror.dispose();
            if (ref.model) ref.model.dispose();
            var refMirrors = [];

            var rows = js(ref.rows);
            var cols = js(ref.cols);
            var rowsp = js(ref.rowsp);
            var colsp = js(ref.colsp);

            if (rows && rows.length > 0 && cols && cols.length > 0) {

                var refs = [];
                var refMirrors = [];
                var ts = ref.mirrorTs && ref.mirrorTs != '' ? js(ref.mirrorTs) : {};


                for (var i in rows) {

                    refs[rows[i]] = r_mur.curve.strToPoints(_rims[rows[i]].str, _rims[rows[i]].clr
                        , _rims[rows[i]].rvs, _rims[rows[i]].sld, _rims, r_mur.curve.getPointsOfRef);

                    if (ref.mirror) {

                        var s = { x: 0, y: 0, z: 0, ts: ts };
                        refMirrors[rows[i]] = [];
                        for (var j in refs[rows[i]]) {

                            refMirrors[rows[i]][j] = GB.effect.mirror(refs[rows[i]][j], s, 'x');
                        }
                    }
                }

                for (var i in cols) {
                    refs[cols[i]] = r_mur.curve.strToPoints(_rims[cols[i]].str, _rims[cols[i]].clr
                        , _rims[cols[i]].rvs, _rims[cols[i]].sld, _rims, r_mur.curve.getPointsOfRef);

                    if (ref.mirror) {

                        refMirrors[cols[i]] = [];

                        var s = { x: 0, y: 0, z: 0 };
                        for (var j in refs[cols[i]]) {

                            refMirrors[cols[i]][j] = GB.effect.mirror(refs[cols[i]][j], s, 'x');
                        }
                    }
                }

                for (var n = 0; n <= 1; n++) {
                    if (n == 0 || (n == 1 && ref.mirror)) {
                        var mdl = eng.maker({
                            curves: n == 1 ? refMirrors : refs,
                            rows: rows,
                            rowsPercent: rowsp,
                            columns: cols,
                            columnsPercent: colsp,
                            flip: n == 1 ? !ref.flip : ref.flip
                        },

                            GB.models.nurbs, function (me) {

                                return me
                            });


                        mdl.rows = rows;
                        mdl.cols = cols;
                        mdl.nurbs = true;

                        if (n == 0)
                            ref.model = mdl;
                        else
                            ref.model.mirror = mdl;
                    }

                }


                return ref.model;

            }
        },
        surface: function (eng, ref, _rims) {

            if (ref.model) ref.model.dispose();

            var crvs = js(ref.curves);

            var refMirrors = [];


            var refs = [];
            var ts = ref.mirrorTs && ref.mirrorTs != '' ? js(ref.mirrorTs) : {};


            for (var i in crvs) {
                refs.push(r_mur.curve.strToPoints(_rims[crvs[i]].str, _rims[crvs[i]].clr
                    , _rims[crvs[i]].rvs, _rims[crvs[i]].sld, _rims, r_mur.curve.getPointsOfRef));

                if (ref.mirror) {

                    var s = { x: 0, y: 0, z: 0, ts: ts };
                    refMirrors[refs.length - 1] = [];
                    for (var j in refs[refs.length - 1]) {

                        refMirrors[refs.length - 1][j] = GB.effect.mirror(refs[refs.length - 1][j], s, 'x');
                    }
                }
            }

            for (var n = 0; n <= 1; n++) {
                if ((n == 0) || (n == 1 && ref.mirror)) {

                    var mdl = eng.maker({
                        curves:
                            n == 1 ? refMirrors : refs, seg: 5, flip:
                            n == 1 ? !ref.flip : ref.flip
                    }, GB.models.surface, function (me) {

                        return me;
                    });

                    mdl.rows = crvs;
                    mdl.surface = true;


                    if (n == 0)
                        ref.model = mdl;
                    else
                        ref.model.mirror = mdl;
                }
            }

            return ref.model;
        },
    },

};


var r_mur = armour.prototype;

