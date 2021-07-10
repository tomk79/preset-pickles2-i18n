<?php
namespace broccoliHtmlEditor\broccoliFieldSummernote;
class summernote extends \broccoliHtmlEditor\fieldBase{

    private $broccoli;

    /**
     * constructor
     */
    public function __construct($broccoli){
        $this->broccoli = $broccoli;
        parent::__construct($broccoli);
    }

	/**
	 * データをバインドする (Server Side)
	 */
	public function bind( $fieldData, $mode, $mod ){
		$rtn = '';
		if(is_array($fieldData) && is_string(@$fieldData['src'])){
			$rtn = ''.$fieldData['src'];

			switch( $fieldData['editor'] ){
				case 'text':
					$rtn = htmlspecialchars( $rtn ); // ←HTML特殊文字変換
					$rtn = preg_replace('/\r\n|\r|\n/s', '<br />', $rtn); // ← 改行コードは改行タグに変換
					break;
				case 'markdown':
					$rtn = $this->broccoli->markdown($rtn);
					break;
				case 'html':
				default:
					break;
			}
		}
		if( $mode == 'canvas' && !strlen(trim($rtn)) ){
			$rtn = '<span style="color:#999;background-color:#ddd;font-size:10px;padding:0 1em;max-width:100%;overflow:hidden;white-space:nowrap;">(ダブルクリックしてテキストを編集してください)</span>';
		}
		return $rtn;
	}

}