<?

//@TODO - proper security/ACL checks.
if(!$mgr = $modx->getAuthenticatedUser('mgr')){
	return;
}


$managerUrl = $modx->context->getOption('manager_url', MODX_MANAGER_URL, $modx->_userConfig);
$assetsUrl = $modx->context->getOption('assets_url', MODX_ASSETS_URL, $modx->_userConfig) . 'components/upfront/assets/';
$_SERVER['HTTP_MODAUTH'] = $modx->site_id;

switch($modx->event->name){
    case "OnWebPageInit":
        /* CSS REGISTERED FOR EXT RENDERING */
		/* @TODO - check which manager theme we should be using */
		$modx->regClientCSS($managerUrl . "assets/ext3/resources/css/ext-all-notheme-min.css");
		$modx->regClientCSS($managerUrl . "templates/default/css/modx-min.css");
		/* CSS REGISTERED FOR CUSTOM RULES (Resets) */
		$modx->regClientCSS($assetsUrl . "css/reset.css");
		/* STOCK MODX FILES */
		$modx->regClientStartupScript($managerUrl."assets/ext3/adapter/ext/ext-base.js");
		$modx->regClientStartupScript($managerUrl."assets/ext3/ext-all.js");
		$modx->regClientStartupScript($managerUrl."assets/modext/build/core/modx-min.js");
		$modx->regClientStartupScript($siteUrl . "connectors/lang.js.php?ctx=mgr&topic=topmenu,file,resource,resource&action=30");
		$modx->regClientStartupScript($siteUrl . "connectors/layout/modx.config.js.php?action=30&wctx=web");
		$modx->regClientStartupScript($managerUrl."assets/modext/modext.js?v=206pl");
		$modx->regClientStartupScript($managerUrl.'assets/modext/util/datetime.js');
		$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/element/modx.panel.tv.renders.js');
		$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/resource/modx.grid.resource.security.js');
		$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/resource/modx.panel.resource.tv.js');
		/* NON-MODX FILES LOADED FROM UPFRONT ASSETS DIR */
		$modx->regClientStartupScript($assetsUrl.'js/modext/widgets/resource/modx.panel.resource.js');
		$modx->regClientStartupScript($assetsUrl.'js/modext/sections/resource/update.js');
		
		$resource=  $modx->getObject('modResource', $modx->resourceIdentifier);
		$record = $resource->toArray();
		$modx->regClientStartupHTMLBlock('
		<script type="text/javascript">
		// <![CDATA[
		MODx.config.publish_document = "'.$publish_document.'";
		MODx.onDocFormRender = "'.$onDocFormRender.'";
		MODx.ctx = "mgr";
			Ext.Ajax.extraParams = {
				"HTTP_MODAUTH": "' . $modx->site_id . '"
			};
		Ext.onReady(function() {
			MODx.load({
				xtype: "modx-page-resource-update"
				,resource: "'.$resource->get('id').'"
				,record: '.$modx->toJSON($record).'
				,access_permissions: "'.$access_permissions.'"
				,publish_document: "'.$publish_document.'"
				,preview_url: "'.$url.'"
				,canSave: "'.($modx->hasPermission('save_document') ? 1 : 0).'"
				,canEdit: "'.($modx->hasPermission('edit_document') ? 1 : 0).'"
				,canCreate: "'.($modx->hasPermission('new_document') ? 1 : 0).'"
			});
			var actionButtons = Ext.getCmp("modx-action-buttons").hide();
			var actionButtonsWrapper = Ext.get("modAB").addClass("collapsed");
		});
		// ]]>
		</script>');
		
		//@TODO: parse with chunk->process for custom welcome etc.
		$chunk = $modx->newObject('modChunk');
		$tpl = file_get_contents(MODX_CORE_PATH . 'components/upfront/elements/templates/update.tpl');
		$chunk->setContent($tpl);
		$injectHTML = $chunk->process();
		$modx->regClientHTMLBlock($injectHTML);
		
        break;
}

return;//load up the current document maps.