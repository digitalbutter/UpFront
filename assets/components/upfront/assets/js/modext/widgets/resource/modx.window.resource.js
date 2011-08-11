Ext.override(MODx.Window, {
	renderTo: 'upfront_wrapper'
});

Ext.override(Ext.menu.Menu, {
	renderTo: 'upfront_wrapper'
});

Ext.override(Ext.ToolTip, {
	renderTo: 'upfront_wrapper'
});

Ext.MessageBox = function(){
    var dlg, opt, mask, waitTimer,
        bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl,
        buttons, activeTextEl, bwidth, bufferIcon = '', iconCls = '',
        buttonNames = ['ok', 'yes', 'no', 'cancel'],
        windowWidth = 400;

    
    var handleButton = function(button){
        buttons[button].blur();
        if(dlg.isVisible()){
            dlg.hide();
            handleHide();
            Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value, opt], 1);
        }
    };

    
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();        
    };

    
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
            handleHide();
        }
        if(e){
            e.stopEvent();
        }
    };

    
    var updateButtons = function(b){
        var width = 0,
            cfg;
        if(!b){
            Ext.each(buttonNames, function(name){
                buttons[name].hide();
            });
            return width;
        }
        dlg.footer.dom.style.display = '';
        Ext.iterate(buttons, function(name, btn){
            cfg = b[name];
            if(cfg){
                btn.show();
                btn.setText(Ext.isString(cfg) ? cfg : Ext.MessageBox.buttonText[name]);
                width += btn.getEl().getWidth() + 15;
            }else{
                btn.hide();
            }
        });
        return width;
    };

    return {
        
        getDialog : function(titleText){
           if(!dlg){
                var btns = [];
                
                buttons = {};
                Ext.each(buttonNames, function(name){
                    btns.push(buttons[name] = new Ext.Button({
                        text: this.buttonText[name],
                        handler: handleButton.createCallback(name),
                        hideMode: 'offsets'
                    }));
                }, this);
                dlg = new Ext.Window({
                    autoCreate : true,
                    title:titleText,
                    resizable:false,
                    constrain:true,
                    constrainHeader:true,
                    minimizable : false,
                    maximizable : false,
                    stateful: false,
                    modal: true,
                    shim:true,
                    buttonAlign:"center",
                    width:windowWidth,
                    height:100,
                    minHeight: 80,
                    plain:true,
                    footer:true,
                    closable:true,
                    draggable: false,
                    close : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    },
                    fbar: new Ext.Toolbar({
                        items: btns,
                        enableOverflow: false
                    })
                });
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.setSize(this.maxWidth, 100); 
            }
            
            msgEl.update(text ? text + ' ' : '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0,
                mw = msgEl.getWidth() + msgEl.getMargins('lr'),
                fw = dlg.getFrameWidth('lr'),
                bw = dlg.body.getFrameWidth('lr'),
                w;
                
            w = Math.max(Math.min(opt.width || iw+mw+fw+bw, opt.maxWidth || this.maxWidth),
                    Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if(opt.prompt === true){
                activeTextEl.setWidth(w-iw-fw-bw);
            }
            if(opt.progress === true || opt.wait === true){
                progressBar.setSize(w-iw-fw-bw);
            }
            if(Ext.isIE && w == bwidth){
                w += 4; 
            }
            msgEl.update(text || '&#160;');
            dlg.setSize(w, 'auto').center();
            return this;
        },

        
        updateProgress : function(value, progressText, msg){
            progressBar.updateProgress(value, progressText);
            if(msg){
                this.updateText(msg);
            }
            return this;
        },

        
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        
        hide : function(){
            var proxy = dlg ? dlg.activeGhost : null;
            if(this.isVisible() || proxy){
                dlg.hide();
                handleHide();
                if (proxy){
                    
                    
                    dlg.unghost(false, false);
                } 
            }
            return this;
        },

        
        show : function(options){
        	
            if(this.isVisible()){
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                d.focusEl = activeTextEl;
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                if (db){
                    d.focusEl = db;
                }
            }
            if(Ext.isDefined(opt.iconCls)){
              d.setIconClass(opt.iconCls);
            }
            this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
            bwidth = updateButtons(opt.buttons);
            progressBar.setVisible(opt.progress === true || opt.wait === true);
            this.updateProgress(0, opt.progressText);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === false;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                
                document.getElementById('upfront_wrapper').appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                
                d.on('show', function(){
                    if(allowClose === true){
                        d.keyMap.enable();
                    }else{
                        d.keyMap.disable();
                    }
                }, this, {single:true});
                d.show(opt.animEl);
            }
            if(opt.wait === true){
                progressBar.wait(opt.waitConfig);
            }
            
            dlg.setSize(windowWidth, 'auto').center();
            
            return this;
        },

        
        setIcon : function(icon){
            if(!dlg){
                bufferIcon = icon;
                return;
            }
            bufferIcon = undefined;
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                bodyEl.addClass('x-dlg-icon');
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                bodyEl.removeClass('x-dlg-icon');
                iconCls = '';
            }
            return this;
        },

        
        progress : function(title, msg, progressText){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                progressText: progressText
            });
            return this;
        },

        
        wait : function(msg, title, config){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: this.minProgressWidth,
                waitConfig: config
            });
            return this;
        },

        
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope,
                minWidth: this.minWidth
            });
            return this;
        },

        
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                icon: this.QUESTION,
                minWidth: this.minWidth
            });
            return this;
        },

        
        prompt : function(title, msg, fn, scope, multiline, value){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth: this.minPromptWidth,
                scope : scope,
                prompt:true,
                multiline: multiline,
                value: value
            });
            return this;
        },

        
        OK : {ok:true},
        
        CANCEL : {cancel:true},
        
        OKCANCEL : {ok:true, cancel:true},
        
        YESNO : {yes:true, no:true},
        
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        
        INFO : 'ext-mb-info',
        
        WARNING : 'ext-mb-warning',
        
        QUESTION : 'ext-mb-question',
        
        ERROR : 'ext-mb-error',

        
        defaultTextHeight : 75,
        
        maxWidth : 600,
        
        minWidth : 100,
        
        minProgressWidth : 250,
        
        minPromptWidth: 250,
        
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();


Ext.Msg = Ext.MessageBox;

MODx.window.EditableField = function(config) {
    config = config || {};
    this.ident = config.ident || 'upfront-'+Ext.id();
    Ext.applyIf(config,{
        title: 'UpFront'
        ,url: MODx.config.site_url+'assets/components/upfront/connectors/mgr.php'
        ,id: this.ident
        ,baseParams: {
        	action: 'resource/update'
        	,id: config.resourceIdentifier
        }
        ,fields: config.fields
    });
    
    MODx.window.EditableField.superclass.constructor.call(this,config);
    
};
Ext.extend(MODx.window.EditableField,MODx.Window);
Ext.reg('modx-window-editable-field',MODx.window.EditableField);

/* creates listeners on all UfEditable divs, allowing form windows to open on click */
var upfrontEmbeddedEdit = function(){
	return{ 
		init: function(){
			this.target = Ext.get('upfront_wrapper');
			this.windows = {};
			this.xtypes = {
				"id":"numberfield",
				"type":"textfield",
				"contentType":"textfield",
				"pagetitle": {
					editable: true,
					xtype: "textfield",
					fieldLabel: _('resource_pagetitle'),
					width: 300
				},
				"longtitle":{
					editable: true,
					xtype: "textfield",
					fieldLabel: _('resource_longtitle'),
					width: 300
				},
				"description":"textfield",
				"alias":"textfield",
				"link_attributes":"textfield",
				"published":"modx-combo-boolean",
				"pub_date":"modx-combo-boolean",
				"unpub_date":"modx-combo-boolean",
				"parent":"modx-combo-boolean",
				"isfolder":"modx-combo-boolean",
				"introtext":"textarea",
				"content":{
					editable: true,
					xtype: "textarea",
					fieldLabel: _('resource_content'),
					width: 500
				},
				"richtext":"modx-combo-boolean",
				"template":"modx-combo-template",
				"menuindex":"numberfield",
				"searchable":"modx-combo-boolean",
				"cacheable":"modx-combo-boolean",
				"createdby":"modx-combo-boolean",
				"createdon":"modx-combo-boolean",
				"editedby":"modx-combo-boolean",
				"editedon":"datetimefield",
				"deleted":"modx-combo-boolean",
				"deletedon":"modx-combo-boolean",
				"deletedby":"modx-combo-boolean",
				"publishedon":"modx-combo-boolean",
				"publishedby":"modx-combo-boolean",
				"menutitle":"textfield",
				"donthit":"modx-combo-boolean",
				"haskeywords":"modx-combo-boolean",
				"hasmetatags":"modx-combo-boolean",
				"privateweb":"modx-combo-boolean",
				"privatemgr":"modx-combo-boolean",
				"content_dispo":"modx-combo-boolean",
				"hidemenu":"modx-combo-boolean",
				"class_key":"textfield",
				"context_key":"textfield",
				"content_type":"textfield"
			};
			Ext.select("div.UfEditable").on("mouseenter", highlightSection);
			Ext.select("div.UfEditable").on("mouseleave", unHighlightSection);
			Ext.select("div.UfEditable").on("click", editSection);
		}
	}
}();

var highlightSection = function(e) {
	Ext.get(this).addClass('ufHighlighted');
}

var unHighlightSection = function(e) {
	//Ext.get(this).frame();
	Ext.get(this).removeClass('ufHighlighted');
}

var editSection = function(e) {
	//does the click element come from this page? Let's pull from the existing form panel if it does.
	var className = this.className;
	var classGiven = className.replace('UfEditable', '');
	classGiven = classGiven.replace('ufHighlighted', '');
	classGiven = Ext.util.Format.trim(classGiven);
	className = classGiven;
	classGiven = classGiven.split('_');
	var fieldName = classGiven[0];
	var fieldResourceIdentifier = classGiven[1];
	if(!upfrontEmbeddedEdit.windows[classGiven]){
	
		upfrontEmbeddedEdit.windows[classGiven] = MODx.load({
			xtype: 'modx-window-editable-field'
			,fields: [
				{
					xtype: upfrontEmbeddedEdit.xtypes[fieldName].xtype
					,id: 'upfront-editable-' + className
					,fieldLabel: upfrontEmbeddedEdit.xtypes[fieldName].fieldLabel
					,name: 'value'
					,resourceIdentifier: fieldResourceIdentifier
					,width: upfrontEmbeddedEdit.xtypes[fieldName].width
					,editable: upfrontEmbeddedEdit.xtypes[fieldName].editable
					,enableKeyEvents: true
					,listeners: {
						'keyup': {scope:this,fn:function(f,e) {
							Ext.select('div.UfEditable.' + className).update(f.getValue());
						}}
					}
				},
				{
					xtype: 'hidden'
					,id: 'upfront-editable-resourceIdentifier-' + className
					,name: 'id'
					,value: fieldResourceIdentifier
				},
				{
					xtype: 'hidden'
					,name: 'fieldName'
					,value: fieldName
				}
			] 
			,listeners: {
				 'success': {fn:function(a,b) {
				 	title = "Error";
				 	if(a.a.result.success){
				 		title = 'Success';
				 	}
				 	MODx.msg.alert(title, a.a.result.message);
				},scope:this}
			}
		});
	
	}
	//editField.setValues(r);
	upfrontEmbeddedEdit.windows[classGiven].show();
}


Ext.onReady(
	function(){
		upfrontEmbeddedEdit.init();
	}
);    
