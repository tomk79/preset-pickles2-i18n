<?php
namespace proj;
class site extends \picklesFramework2\site{

	private $px;

	/**
	 * $site オブジェクトを生成して登録する
	 */
	public static function initialize($px, $json){
		$is_enable_sitemap = $px->is_path_enable_sitemap( $px->req()->get_request_file_path() );
		if( !$is_enable_sitemap ){
			return;
		}

		$site =  new self($px);
		$px->set_site( $site );
		return;
	}

	/**
	 * Constructor
	 *
	 * @param object $px Picklesオブジェクト
	 */
	public function __construct( $px ){
		$this->px = $px;
		parent::__construct( $px );
	}

	/**
	 * ページ情報を取得する。
	 *
	 * このメソッドは、指定したページの情報を連想配列で返します。対象のページは第1引数にパスまたはページIDで指定します。
	 *
	 * カレントページの情報を取得する場合は、代わりに `$px->site()->get_current_page_info()` が使用できます。
	 *
	 * パスで指定したページの情報を取得する例 :
	 * <pre>&lt;?php
	 * // ページ &quot;/aaa/bbb.html&quot; のページ情報を得る
	 * $page_info = $px-&gt;site()-&gt;get_page_info('/aaa/bbb.html');
	 * var_dump( $page_info );
	 * ?&gt;</pre>
	 *
	 * ページIDで指定したページの情報を取得する例 :
	 * <pre>&lt;?php
	 * // トップページのページ情報を得る
	 * // (トップページのページIDは必ず空白の文字列)
	 * $page_info = $px-&gt;site()-&gt;get_page_info('');
	 * var_dump( $page_info );
	 * ?&gt;</pre>
	 *
	 * 取得対象のページがアクター(role値が設定されている場合にアクターと判定される)だった場合、
	 * 返却値は一旦ロールページの情報で初期化され、アクター側に値がある項目のみ、アクター側の値で上書きされます。
	 * ただし、id, path, content, role 列はアクター側の値が、
	 * logical_path 列はロール側の値が、それぞれ強制的に採用されます。
	 *
	 * @param string $path 取得するページのパス または ページID。
	 * @param string $key 取り出す単一要素のキー。省略時はすべての要素を含む連想配列が返されます。省略可。
	 * @return mixed 単一ページ情報を格納する連想配列、`$key` が指定された場合は、その値のみ。
	 */
	public function get_page_info( $path, $key = null ){
		$args = func_get_args();
		$page_info = call_user_func_array( array('parent', 'get_page_info'), $args );
		return $page_info;
	}
}