<?php

//@TODO allow passing of a document ID.
$tag = preg_replace('/(:UfEditable(=`.*?`)?)/i', '', $tag);
$return = '<div class="UfEditable ' . $name . '_' . $modx->documentIdentifier . '">' . $tag . '</div>';

return $return;