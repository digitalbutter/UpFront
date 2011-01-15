MODx.window.EditableField = function(config) {
    config = config || {};
    this.ident = config.ident || 'upfront-'+Ext.id();
    Ext.applyIf(config,{
        title: 'UpFront'
        ,url: MODx.config.site_url+'connectors/shopping-cart/products.php'
        ,id: this.ident
        ,renderTo: 'upfront_wrapper'
        ,action: 'newImage'
        ,baseParams: {
        	action: 'newimage'
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
	var class = className.replace('UfEditable', '');
	class = class.replace('ufHighlighted', '');
	class = Ext.util.Format.trim(class);
	class = class.split('_');
	var fieldName = class[0];
	var fieldResourceIdentifier = class[1];
	if(!upfrontEmbeddedEdit.windows[class]){
	
		upfrontEmbeddedEdit.windows[class] = MODx.load({
			xtype: 'modx-window-editable-field'
			,fields: [
				{
					xtype: upfrontEmbeddedEdit.xtypes[fieldName].xtype
					,id: 'upfront-editabe-' + className
					,fieldLabel: upfrontEmbeddedEdit.xtypes[fieldName].fieldLabel
					,name: fieldName
					,resourceIdentifier: fieldResourceIdentifier
					,width: upfrontEmbeddedEdit.xtypes[fieldName].width
					,editable: upfrontEmbeddedEdit.xtypes[fieldName].editable
				}
			] 
			,listeners: {
				 'success': {fn:function() {
					
				},scope:this}
			}
		});
	
	}
	//editField.setValues(r);
	upfrontEmbeddedEdit.windows[class].show();
}


Ext.onReady(
	function(){
		upfrontEmbeddedEdit.init();
	}
);    
