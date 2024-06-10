var data = {
    main: {
        title: 'color',
        items: {
            Shell-main :{ id:25, type:'mesh', colors: [] }, 
        }
    },
    logo : {
        title: 'logo',
            items: {
            plam - logo : { id: 26, type: 'icon', logo: ['None', 'LTD_Edition_Logo', '...'], colors: [] }
            xyz - logo : { id: 26, type: 'text', value: 'deafult', colors: [], fonts: [], sizes: [] }
        }
    } ,
    text : {
        title: 'imbriodery',
            items: { 
            xyz  : { id: 26, type: 'text', value: 'deafult', colors: [], fonts: [], sizes: [] }
        }
    },
    webbing: {
        web: {
            items: { 
                web_color: {
                    type: 'variant', id: 1,
                        items : {
                        web: { id: [25, 26], type: 'mesh', colors: [] },
                        lace: { id: 26, type: 'mesh', colors: [] },
                        stiching: { id: 33, type: 'mesh', colors: [] },
                    }
                },
                lacy_color: {
                    type: 'variant', id: 1,
                        items : {
                        web: { id: [25, 26], type: 'mesh', colors: [] },
                        lace: { id: 26, type: 'mesh', colors: [] },
                        stiching: { id: 33, type: 'mesh', colors: [] },
                    }
                }
            },
            selectMode: 'multiple' | 'single'
        }
    } 
};

