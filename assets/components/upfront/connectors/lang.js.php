<?php
/**
 * Loads the lexicon into a JS-compatible function _()
 *
 * @package modx
 * @subpackage lexicon
 */
ob_start();
require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php'; 
if (!defined('MODX_CORE_PATH')) define('MODX_CORE_PATH', dirname(dirname(__FILE__)) . '/core/');
if (!include_once(MODX_CORE_PATH . 'model/modx/modx.class.php')) die();
if (empty($options) || !is_array($options)) $options = array();
$modx= new modX('', $options);

/* initialize the proper context */
$ctx = 'mgr';
$modx->initialize($ctx);

/* handle the request */
$connectorRequestClass = $modx->getOption('modConnectorRequest.class',null,'modConnectorRequest');
$modx->config['modRequest.class'] = $connectorRequestClass;
$modx->getRequest();
$modx->request->sanitizeRequest();

ob_clean();

$ml = $modx->getOption('manager_language',null,'en');
if ($ml != 'en') {
	$modx->lexicon->load($ml.':core:default');
	$modx->setOption('cultureKey',$ml);
}

if (!empty($_REQUEST['topic'])) {
    $topics = explode(',',$_REQUEST['topic']);
    foreach($topics as $topic) {
    	$modx->lexicon->load($ml . ':upfront:' . $topic);
	}
}

$entries = $modx->lexicon->fetch();

$s = '';
while (list($k,$v) = each ($entries)) {
    $s .= "MODx.lang['$k']= ".'"'.esc($v).'";';
}
echo $s;

function esc($s) {
    return strtr($s,array('\\'=>'\\\\',"'"=>"\\'",'"'=>'\\"',"\r"=>'\\r',"\n"=>'\\n','</'=>'<\/'));
}

/* gather output from buffer */
$output = ob_get_contents();
ob_end_clean();


/* if turned on, will cache lexicon entries in JS based upon http headers */
if ($modx->getOption('cache_lang_js',null,false)) {
    $hash = md5($output);
    $headers = $modx->request->getHeaders();

    /* if Browser sent ID, check if they match */
    if (isset($headers['If-None-Match']) && @preg_match($hash, $headers['If-None-Match'])) {
        header('HTTP/1.1 304 Not Modified');
    } else {
        header("ETag: \"{$hash}\"");
        header('Accept-Ranges: bytes');
        //header('Content-Length: '.strlen($output));
        header('Content-Type: application/x-javascript');

        echo $output;
    }
} else {
    /* just output JS with no server caching */
    //header('Content-Length: '.strlen($output));
    header('Content-Type: application/x-javascript');
    echo $output;
}
@session_write_close();
exit();
