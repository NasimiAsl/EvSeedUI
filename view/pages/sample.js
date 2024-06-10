
var js = {
    mats: {
        "pickColor" :{},
        "textureUploader":{},
        "material":{ ref,hiny ,light ,bump}, 

        "colors": {
            "Varsity Yellow": { type: 'mat', color: '#e0be3d', id: 1 },
            "Gold": { type: 'mat', color: '#e0be3d', id: 1 },
            "Aqua Blue": { type: 'mat', color: '#21ffff', id: 1 },
            "Black": { type: 'mat', color: '#000000', id: 1 },
            "Blonde": { type: 'mat', color: '#edc27d', id: 1 },
            "Brown": { type: 'mat', color: '#312219', id: 1 },
            "Cool Grey": { type: 'mat', color: '#353841', id: 1 },
            "Crimson": { type: 'mat', color: '#39110b', id: 1 },
            "Hunter Green": { type: 'mat', color: '#07250e', id: 1 },
            "Navy Blue": { type: 'mat', color: '#102447', id: 1 },
            "Orange Tan": { type: 'mat', color: '#d65c1b', id: 1 },
            "Pink": { type: 'mat', color: '#a9004e', id: 1 },
            "Purple": { type: 'mat', color: '#470092', id: 1 },
            "Red": { type: 'mat', color: '#900006', id: 1 },
            "Royal Blue": { type: 'mat', color: '#092ba6', id: 1 },
            "Tan": { type: 'mat', color: '#96612b', id: 1 },
            "White": { type: 'mat', color: '#ffffff', id: 1 }
        },

        "set1": {
            "WEB COLOR": { type: 'mesh', id: '', mat: 'colors', currMat: 1 },
            "LACES COLOR": { type: 'mesh', id: '', mat: 'colors', currMat: 1 },
            "STITCHING COLOR": { type: 'mesh', id: '', mat: 'pickColor,textureUploader', currMat: 1 }
        },
        "set2": {
            "WRIST COLOR": { type: 'mesh', id: '', mat: 'colors', currMat: 1 },
            "WRIST PAD STITCHING": { type: 'mesh', id: '', mat: 'colors', currMat: 1 }
        },
        "set3": {
            "FINGER PAD COLOR": { type: 'mesh', id: '', mat: 'colors', currMat: 1 },
            "FINGER PAD STITCHING": { type: 'mesh', id: '', mat: 'colors', currMat: 1 }
        },

    },
    text: {
        "PINKY":
        {
            "show": { type: 'check', value: 'no', ref: '148~embroidy_text_02' },
            "text": { type: 'text', value: 'text', ref: '148~embroidy_text_02', x: 0, y: 0 },
            "font": { type: 'list', value: 'HESTINA', list: 'HESTINA,HEAVITAS,ENGLAND SIGNATURE', ref: '148~embroidy_text_02' },
            "color": { type: 'mesh', value: 'Black', mat: 'colors', currMat: 1, ref: '148~embroidy_text_02' },
        },
        "THUMB": {
            "show": { type: 'check', value: 'no', ref: '143~embroidery_logo' },
            "text": { type: 'text', value: 'text', ref: '143~embroidery_logo', x: 0, y: 0 },
            "font": { type: 'list', value: 'HESTINA', list: 'HESTINA,HEAVITAS,ENGLAND SIGNATURE', ref: '143~embroidery_logo' },
            "color": { type: 'mesh', value: 'Black', mat: 'colors', currMat: 1, ref: '143~embroidery_logo' },
        },
    },
    logo: {
        "JL Glove Logo": {
            "PALM LOGO": { type: 'list', value: 'NONE', list: 'NONE~8,LTD EDITION LOGO~6,STANDARD PALM LOGO STAMP~7', mat: 'colors', currMat: 1 },
            "SCRIPT LOGO": { type: 'mesh', value: 'White', mat: 'colors', currMat: 1 },
            "WRIST LOGO - MAIN": { type: 'mesh', value: 'White', mat: 'colors', currMat: 1 },
            "WRIST LOGO - OUTLINE": { type: 'mesh', value: 'Black', mat: 'colors', currMat: 1 },
            "WRIST LOGO - SHADOW": { type: 'mesh', value: 'Red', mat: 'colors', currMat: 1 },
        }
    },
    main: {
        "SHELL- MAIN": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "MIDDLE FINGER 1": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "MIDDLE FINGER 2": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "RING FINGER 1": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "RING FINGER 2": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "PINKY STRIP- INNER": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "PINKY STRIP- OUTER": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "THUMB STRIP- OUTER": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "PALM": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "LACES": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "WELTING": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "BINDING": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "STITCHING": { type: 'mesh', id: '', mat: 'colors', model: 1 },
        "PALM LINER": { type: 'mesh', id: '', mat: 'colors', model: 1 },
    },
    WEBBING: {
        WEB: {
            "NONE": { type: 'none', type: 'glb', group: 'WEB' },
            "2PIECE CLOSED": { type: 'glb', id: 2, mat: "set1" },
            "GEM WEB": { type: 'glb', id: 30, mat: "set1" },
            "H WEB": { type: 'glb', path: '', id: 58, mat: "set1" },
            "I TRAP": { type: 'glb', path: '', id: 59, mat: "set1" },
            "I WEB": { type: 'glb', path: '', id: 60, mat: "set1" },
            "MOD TRAP": { type: 'glb', path: '', id: 61, mat: "set1" },
            "ONE PIECE WEB": { type: 'glb', path: '', id: 62, mat: "set1" },
            "SINGLE POST- LACED": { type: 'glb', path: '', id: 63, mat: "set1" },
            "POST WEB": { type: 'glb', path: '', id: 64, mat: "set1" },
            "BASKET WEB": { type: 'glb', path: '', id: 65, mat: "set1" },
            "CLOSED WEB": { type: 'glb', path: '', id: 66, mat: "set1" },
            "COMPLEX TRAP": { type: 'glb', path: '', id: 67, mat: "set1" },
            "51 TRAP": { type: 'glb', path: '', id: 68, mat: "set1" }
        },
    },
    FINGER_WRIST: {
        "WRIST PAD": {
            "NONE": { type: 'none', type: 'glb', group: 'WRIST PAD' },
            "DNA MOISTURE WICKING MESH": { type: 'glb', id: 110, mat: "set2" },
            "CLASSIC SOFT GOAT'S FUR": { type: 'glb', path: '', id: 115, mat: "set2" },
        },
        "ONE / TWO PIECE WRIST": {
            "NONE": { type: 'none', type: 'glb', group: 'ONE / TWO PIECE WRIST' },
            "ONE PIECE WRIST": { type: 'glb', path: '', id: 96, mat: "set2" },
            "TWO PIECE WRIST": { type: 'glb', path: '', id: 103, mat: "set2" }
        },
        "FINGER PAD / HOOD": {
            "NONE": { type: 'none' },
            "FINGER PAD": { type: 'ilist', value: 'NONE', mat: 'set3', list: 'NONE,SHIFT TO MIDDLE FINGER (TIP),STANDARD INDEX FINGER' },
            "FINGER HOOD": { type: 'ilist', value: 'NONE', mat: 'set3', list: 'NONE,SHIFT TO MIDDLE FINGER,STANDARD INDEX FINGER' }
        }
    }
};

 










