<?


        /* register JS */
$managerUrl = $modx->context->getOption('manager_url', MODX_MANAGER_URL, $modx->_userConfig);
$record = $modx->resource->toArray();
$_SERVER['HTTP_MODAUTH'] = $modx->site_id;

$modx->regClientCSS("manager/assets/ext3/resources/css/ext-all-notheme-min.css");
$modx->regClientCSS("manager/templates/default/css/modx-min.css");
$modx->regClientCSS("core/components/upfront/assets/css/reset.css");

$modx->regClientStartupScript($managerUrl."assets/ext3/adapter/ext/ext-base.js");
$modx->regClientStartupScript($managerUrl."assets/ext3/ext-all.js");
$modx->regClientStartupScript($managerUrl."assets/modext/build/core/modx-min.js");
$modx->regClientStartupScript("connectors/lang.js.php?ctx=mgr&topic=topmenu,file,resource,resource&action=30");
$modx->regClientStartupScript("connectors/layout/modx.config.js.php?action=30&wctx=web");
$modx->regClientStartupScript($managerUrl."assets/modext/modext.js?v=206pl");
$modx->regClientStartupScript($managerUrl.'assets/modext/util/datetime.js');
$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/element/modx.panel.tv.renders.js');
$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/resource/modx.grid.resource.security.js');
$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/resource/modx.panel.resource.tv.js');
$modx->regClientStartupScript($managerUrl.'assets/modext/widgets/resource/modx.panel.resource.js');
$modx->regClientStartupScript($managerUrl.'assets/modext/sections/resource/update.js');
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
        ,resource: "'.$modx->resource->get('id').'"
        ,record: '.$modx->toJSON($record).'
        ,access_permissions: "'.$access_permissions.'"
        ,publish_document: "'.$publish_document.'"
        ,preview_url: "'.$url.'"
        ,canSave: "'.($modx->hasPermission('save_document') ? 1 : 0).'"
        ,canEdit: "'.($modx->hasPermission('edit_document') ? 1 : 0).'"
        ,canCreate: "'.($modx->hasPermission('new_document') ? 1 : 0).'"
    });
});
// ]]>
</script>');
$modx->regClientHTMLBlock("<div id='upfront_wrapper'><div id='modx-panel-resource-div'></div></div>");
switch($modx->event->name){
    case "onWebPageInit":
//return $modx->smarty->fetch('resource/update.tpl');
        $modx->regClientStartupScript("core/components/upfront/assets/js/start.js");

        break;

}
return;//load up the current document maps.
$document = $modx->getObject('modResource', $modx->resourceIdentifier);
$tvs = $document->getMany('TemplateVars');
foreach($tvs as $tvId => $tv){
    $tvNames[$tv->get('name')] = $tv->renderOutput($modx->resourceIdentifier);
}
$graph = array_merge($document->toArray(), $tvNames);
foreach($graph as $key => $val){
    //$modx->documentOutput = str_replace('[[*' . $key, '[[*' . $key . ':upFront=`' . $modx->documentIdentifier . '`', $modx->documentOutput);
}

//var_dump($modx->resource->toArray(), $modx->documentOutput); exit();