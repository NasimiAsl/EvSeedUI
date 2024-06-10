
function downloadFile(filename, data) {
    const blob = new Blob([data], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    }
    else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
  var md5f = []; 

  var db_api_file =  'https://evseed.haze.tools';
  var apiPathBase = 'https://evseed.haze.tools/';
  var apiPath = apiPathBase;
  function uc(u){ return u.replace('https://file.5kb.me/',db_api_file);};

  var md5 = function (s, t, f) {
  
    var iframe = document.createElement('iframe');
    iframe.src = db_api_file+'/submit/content/item?type=' + t + '&md5=' + s;
    document.body.appendChild(iframe);
  
    md5f[t] = f;
  
  }

  var guidf = [];
  var guid = function (  t, f) {
  
    var iframe = document.createElement('iframe');
    iframe.src = db_api_file+'/submit/content/item?type=' + t + '&guid=1'  ;
    document.body.appendChild(iframe);
  
    guidf[t] = f;
  
  }
  
 
  
  function readFile(ctl, fun) {
  
    const FR = new FileReader();
  
    FR.addEventListener("load", function (evt) {
  
      fun(evt.target.result);
    });
  
    FR.readAsDataURL(ctl.files[0]);
  }
  
  
  var dn = function (op) {
    op = def(op, {});
    op.type = def(op.type, "Get");
    op.url = def(op.url, "/");
    op.success = def(op.success, function (data) { });
    op.error = def(op.error, function (data) { });
    op.end = def(op.end, function () { });
    op.begin = def(op.begin, function () { });
    op.option = def(op.option, {});
  
    function processData(data) {
      op.success(data, op.option);
    }
  
    function handler() {
      op.subProgress = def(op.subProgress, function (p) { });
      op.subProgress(this);
      if (this.readyState == this.DONE) {
        if (this.status == 200) {
          // success!
          processData(this.responseText);
        } else {
          op.error(this);
        }
        op.end();
      }
    }
  
    try {
      var client = new XMLHttpRequest();
  
      client.onreadystatechange = handler;
      client.open(op.type, op.url);
      client.setRequestHeader('Access-Control-Allow-Origin', '*');
      op.begin(client);
      client.send();
      client.onprogress = function (pe) {
        if (pe.lengthComputable) {
          op.progress = def(op.progress, function (p) { });
          op.progress(pe.loaded * 100 / pe.total);
        }
      };
    } catch (e) {
      op.error(e);
      op.end();
    }
  };
  var up = function (op) {
    op = def(op, {});
    op.type = def(op.type, "POST");
    op.url = def(op.url, "/");
    op.success = def(op.success, function (data) { });
    op.error = def(op.error, function (data) { });
    op.end = def(op.end, function () { });
    op.begin = def(op.begin, function () { });
  
    function processData(data) {
      op.success(data);
    }
  
    function handler() {
      if (this.readyState == this.DONE) {
        if (this.status == 200) {
          // success!
          processData(this.responseText);
        } else {
          op.error(this);
        }
        op.end();
      }
    }
  
    try {
      var client = new XMLHttpRequest();
      op.begin(client);
      client.onreadystatechange = handler;
      if ("withCredentials" in client) {
        client.open(op.type, op.url, true);
        client.upload.onprogress = function (pe) {
          if (pe.lengthComputable) {
            op.progress = def(op.progress, function (p) { });
            op.progress(pe.loaded * 100 / pe.total);
          }
        };
      } else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        client = new XDomainRequest();
        client.onreadystatechange = handler;
  
        client.open(op.type, op.url);
        client.upload.onprogress = function (pe) {
          if (pe.lengthComputable) {
            op.progress = def(op.progress, function (p) { });
            op.progress(pe.loaded * 100 / pe.total);
          }
        };
      }
  
      if (def(op.file)) {
        var data = new FormData();
        _for(
          op.file,
          function (at, i) {
            data.append("file" + i, at.data);
          },
          function () {
            client.setRequestHeader("content", JSON.stringify(op.data));
            client.send(data);
            client.upload.onprogress = function (pe) {
              if (pe.lengthComputable) {
                op.progress = def(op.progress, function (p) { });
                op.progress(pe.loaded * 100 / pe.total);
              }
            };
          }
        );
      } else {
        client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        client.send(def(op.data, false) ? JSON.stringify(op.data) : "");
        client.onprogress = function (pe) {
          if (pe.lengthComputable) {
            op.progress = def(op.progress, function (p) { });
            op.progress(pe.loaded * 100 / pe.total);
          }
        };
      }
    } catch (e) {
      op.error(e);
      op.end();
    }
  };
  
  function ds(p, fn) {
    dn({
      url: p,
      success: function (d) {
        window.eval(d);
        if (fn) fn();
      }
    });
  }
  
  var GUX = {};
  /** GUX DB  */
  GUX.XHR = {
    dn: function (op) {
  
      op = def(op, {});
      op.type = def(op.type, 'Get');
      op.url = def(op.url, '/');
      op.success = def(op.success, function (data) { });
      op.error = def(op.error, function (data) { });
      op.end = def(op.end, function () { });
      op.begin = def(op.begin, function () { });
      op.option = def(op.option, {});
  
      function processData(data) {
        op.success(data, op.option);
      }
  
      function handler() {
        op.subProgress = def(op.subProgress, function (p) { });
        op.subProgress(this);
        if (this.readyState == this.DONE) {
          if (this.status == 200) {
            // success!
            processData(this.responseText);
          }
          else {
            op.error(this);
          }
          op.end();
        }
      }
  
      try {
  
        var client = new XMLHttpRequest();
  
        client.onreadystatechange = handler;
        client.open(op.type, op.url);
        op.begin(client);
        client.send();
        client.onprogress = function (pe) {
          if (pe.lengthComputable) {
            op.progress = def(op.progress, function (p) { });
            op.progress(pe.loaded * 100. / pe.total);
          }
        }
      } catch (e) { op.error(e); op.end(); }
  
    },
    up: function (op) {
      op = def(op, {});
      op.type = def(op.type, 'POST');
      op.url = def(op.url, '/');
      op.success = def(op.success, function (data) { });
      op.error = def(op.error, function (data) { });
      op.end = def(op.end, function () { });
      op.begin = def(op.begin, function () { });
  
      function processData(data) {
        op.success(data);
      }
  
      function handler() {
  
        if (this.readyState == this.DONE) {
          if (this.status == 200) {
            // success!
            processData(this.responseText);
          }
          else {
            op.error(this);
          }
          op.end();
        }
      }
  
      try {
  
        var client = new XMLHttpRequest();
  
        client.onreadystatechange = handler;
        if ("withCredentials" in client) {
          client.open(op.type, op.url, true);
          op.begin(client);
          client.upload.onprogress = function (pe) {
            if (pe.lengthComputable) {
              op.progress = def(op.progress, function (p) { });
              op.progress(pe.loaded * 100. / pe.total);
            }
          }
  
        } else if (typeof XDomainRequest != "undefined") {
  
          // Otherwise, check if XDomainRequest.
          // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
          client = new XDomainRequest();
          client.onreadystatechange = handler;
  
          client.open(op.type, op.url);
          op.begin(client);
          client.upload.onprogress = function (pe) {
            if (pe.lengthComputable) {
              op.progress = def(op.progress, function (p) { });
              op.progress(pe.loaded * 100. / pe.total);
            }
          }
        }
  
        if (def(op.file)) {
          var data = new FormData();
          _for(op.file, function (at, i) {
            data.append("file" + i, at.data);
  
          }, function () {
            client.setRequestHeader("content", JSON.stringify(op.data));
            client.send(data);
            client.upload.onprogress = function (pe) {
              if (pe.lengthComputable) {
                op.progress = def(op.progress, function (p) { });
                op.progress(pe.loaded * 100. / pe.total);
              }
            }
          });
        }
        else {
          client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          client.send((def(op.data, false) ? JSON.stringify(op.data) : ''));
          client.onprogress = function (pe) {
            if (pe.lengthComputable) {
              op.progress = def(op.progress, function (p) { });
              op.progress(pe.loaded * 100. / pe.total);
            }
          }
        }
      } catch (e) { op.error(e); op.end(); }
    }
  };
  
  GUX.dataRow = function (p, id) { this.partition = p; this.iden = id; };
  
  GUX.dataRow._ErrorInSave = 500;
  GUX.dataRow._ErrorInLoad = 404;
  GUX.dataRow._Saved = 300;
  GUX.dataRow._WaitToSaved = 100;
  GUX.dataRow._WaitToDownload = 101;
  GUX.dataRow._UpdateByServer = 200;
  GUX.dataRow._WaitToUpdate = 201;
  
  GUX.dataRow.prototype = {
    iden: null,
    event: null,
    log: null,
    watch: function (fun) {
      this.event = fun;
      return this;
    },
    partition: 99999,
    liveData: null,
    status: null,
    setId: function (id) {
      this.iden = id;
      return this;
    },
    /* */
    save: function (data) {
  
      var th = this;
  
      for (var i in data) {
        if (data[i] != undefined)
          data[i] = data[i].toString().replace(/,/g, '#comma').replace(/;/g, '#semicolon');
      }
  
      th.liveData = data;
      th.status = GUX.dataRow._WaitToSaved;
      if (th.log) th.log(th);
  
      data = JSON.stringify(data);
      up({
        url: apiPath+'/api/Submit/950DA5EE-3130-4C14-98DA-D353780B8B72', data: { data: data, id: th.iden, Part: th.partition },
        success: function (d) {
          th.iden = d.replace(/"/g, '').split('|')[1].valueOf() * 1;
          th.status = GUX.dataRow._Saved;
          if (th.log) th.log(th);
          if (th.event) th.event('success', th);
        },
        error: function (d) {
          if (th.event) th.event('failed', d);
          th.status = GUX.dataRow._ErrorInSave;
          if (th.log) th.log(th, d);
        },
      });
      return th;
    },
    load: function (fields) {
      var th = this;
      var o = '_start_';
      var index = 0;
      for (var i in fields) {
        var ps = fields[i];
        fields[i] = index;
        index += 1;
        o += ',' + ps + i;
      }
      o = o.replace('_start_,', '');
      th.status = GUX.dataRow._WaitToDownload;
      if (th.log) th.log(th, d);
      dn({
        url: apiPath+'/api/xobjs?c=1&i=0&p=' + th.partition + '&o=' + o + '&s=' + th.iden, success: function (d) {
          d = JSON.parse(d);
          if(d.length ==0){  th.event('empty', th); return; }
          th.status = GUX.dataRow._WaitToUpdate;
          for (var i in fields) {
  
            fields[i] = d[0].p[fields[i]].toString().replace(/,/g, '#comma').replace(/;/g, '#semicolon');
          }
          th.liveData = fields;
          th.status = GUX.dataRow._UpdateByServer;
          if (th.log) th.log(th, d);
          if (th.event) th.event('success', th);
        },
        error: function (d) {
          th.status = GUX.dataRow._ErrorInLoad;
          if (th.log) th.log(th, d);
          if (th.event) th.event('failed', d);
        },
      });
      return th;
  
  
    },
  
    list: function (fields, filter, start, count, dc) {
      var th = this;
      var o = '_start_';
      var index = 0;
      for (var i in fields) {
  
  
        o += ',' + fields[i] + i;
  
        fields[i] = index;
        index += 1;
      }
      o = o.replace('_start_,', '');
      th.status = GUX.dataRow._WaitToDownload;
      if (th.log) th.log(th, d);
      dn({
        url: apiPath+'/api/xobjs?c=' + count + '&i=' + start + '&p=' + th.partition + '&o=' + o, success: function (d) {
          d = JSON.parse(d);
          th.status = GUX.dataRow._WaitToUpdate;
  
          var res = [];
  
          for (var j in d) {
  
            var fil = {};
  
            var f = 0;
  
            for (var i in fields) {
              if (d[j].p[fields[i]]) {
  
                var val = d[j].p[fields[i]].toString()
                  .replace(/,/g, '#comma')
                  .replace(/__disc__/g, '')
                  .replace(/;/g, '#semicolon');
  
             
  
                if (filter && filter[i] && (filter[i] == 'all' || filter[i] == val)) {
                  fil[i] = val; f++;
                }
              }
  
            } 
  
            if (f == dc)
              res[d[j].o] = (fil);
          }
          th.status = GUX.dataRow._UpdateByServer;
  
          if (th.log) th.log(th, res);
          if (th.event) th.event('success', res);
  
        },
        error: function (d) {
          th.status = GUX.dataRow._ErrorInLoad;
          if (th.log) th.log(th, d);
          if (th.event) th.event('failed', d);
        },
      });
      return th;
    }
  }
  
  function cd(v) {
    return v
      .replace(/"/g, '_!gt_')
      .replace(/'/g, '_!tt_')
      .replace(/;/g, '_!sq_')
      .replace(/,/g, '_!co_')
      .replace(/{/g, '_!as_')
      .replace(/}/g, '_!ae_')
      .replaceAll('[', '_!bs_')
      .replace(/]/g, '_!be_')
      .replace(/`/g, '_!qq_')
      .replace(/=/g, '_!eq_')
      .replace(/:/g, '_!d2_')
      .replace(/\\/g, '_!sl_');
  
  
  
  };
  function dc(v) {
    return v
      .replace(/_!gt_/g, '"')
      .replace(/_!tt_/g, "'")
      .replace(/_!sq_/g, ';')
      .replace(/_!co_/g, ',')
      .replace(/_!as_/g, '{')
      .replace(/_!ae_/g, '}')
      .replace(/_!bs_/g, '[')
      .replace(/_!be_/g, ']')
      .replace(/_!qq_/g, '`')
      .replace(/_!eq_/g, '=')
      .replace(/_!d2_/g, ':')
      .replace(/_!sl_/g, '\\');
  
  };

  var my_List_id = "";
  var userTkn = null;
  var currModelIden = location.search.replace('?', '').valueOf() * 1.0;
  
  function saveToDataBase( clone,api,iden) {

    if(my_List_id.indexOf('#comma'+currModelIden)!=-1) 
    if (currModelIden > 0) { 
      
      if(api)
      { 
        apiPath = api;  
        if(!iden) clone = null;
      } 
  
      new GUX.dataRow(1001).setId(clone?iden:currModelIden).watch(function (s, d) {
        
        apiPath = apiPathBase;
        
        if (s == 'success')
          alert('data saved successfly.');
        
        

          var txt =  prompt('Please Set Name :');
            if(txt){
              
                var li = my_List_id.split('#comma');
                var ids = '#comma';
                for(var i in li ){
                    i = li[i].split('_');
                    if(ids.indexOf('#comma'+i[0])==-1)
                    ids+=i[0]+'_'+(i[0] != (clone? -1 :currModelIden) ?  i[1]+'_'+i[2]:(new Date().getTime())+'_'+txt)+'#comma'; 
                } 

                if(clone)
                ids += d.iden+'_'+(new Date().getTime())+'_'+txt+'#comma'; 

                new GUX.dataRow(1000).setId(userTkn[0].valueOf()*1)
                .watch(function(){            
                      location = '/setup/?'+d.iden;
                })
                .save({myitems: ids}); 
            }
          
  
      }).save({
        
        matmap: cd(localStorage['_meshMatMap' + (location.search)]),
        models: cd(localStorage['_model_iden' + (location.search)]),
        mats: cd(localStorage['_mats_iden' + (location.search)]),
        data: cd(localStorage['_maindatalist' + (location.search)]),
        attached: cd(localStorage['_attach' + (location.search)]),
       
      });


  
  
    } else {
      alert('please create new Model or chose your model id from user Panel.')
    }
  
  }

  window.dn = function (op) {

    op = def(op,{});
    op.type = def(op.type,'Get');
    op.url = def(op.url,'/');
    op.success = def(op.success,function (data) { });
    op.error = def(op.error,function (data) { });
    op.end = def(op.end,function () { });
    op.begin = def(op.begin,function () { });
    op.option = def(op.option,{});
    
    function processData(data) {
      op.success(data,op.option);
    }
    
    
    
    function handler() {
      op.subProgress = def(op.subProgress,function (p) { });
      op.subProgress(this);
      if (this.readyState == this.DONE) {
        if (this.status == 200) {
          // success!
          processData(this.responseText);
        }
        else {
          op.error(this);
        }
        op.end();
      }
    }
    
    try {
    
      var client = new XMLHttpRequest();
    
      client.onreadystatechange = handler;
      client.open(op.type,op.url);
      op.begin(client);
      client.send();
      client.onprogress = function (pe) {
        if (pe.lengthComputable) {
          op.progress = def(op.progress,function (p) { });
          op.progress(pe.loaded * 100. / pe.total);
        }
      };
    } catch (e) { op.error(e); op.end(); }
    
    };
    