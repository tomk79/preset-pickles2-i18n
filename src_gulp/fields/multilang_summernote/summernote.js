window.BroccoliFieldSummernote = function(broccoli){
	var $ = require('jquery');
	var isGlobalJQuery = ( window.jQuery ? true : false );

	function htmlspecialchars(text){
		text = text.split(/\&/g).join('&amp;');
		text = text.split(/\</g).join('&lt;');
		text = text.split(/\>/g).join('&gt;');
		text = text.split(/\"/g).join('&quot;');
		return text;
	}

	/**
	 * データを正規化する (Client Side)
	 * このメソッドは、同期的に振る舞います。
	 */
	this.normalizeData = function( fieldData, mode ){
		// 編集画面用にデータを初期化。
		var rtn = fieldData;
		if(!rtn || typeof(rtn) != typeof({})){
			data = {
				src: '',
				editor: ''
			};
		}
		if(typeof(rtn.src) != typeof('')){
			rtn.src = '';
		}
		if(typeof(rtn.editor) != typeof('')){
			rtn.editor = '';
		}
		return rtn;
	}

	/**
	 * プレビュー用の簡易なHTMLを生成する (Client Side)
	 * InstanceTreeViewで利用する。
	 */
	this.mkPreviewHtml = function( fieldData, mod, callback ){
		var rtn = '';
		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				if( fieldData && typeof(fieldData.src) == typeof('') ){
					rtn += fieldData.src;
				}
				rlv();

			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback( rtn );
			}); })
		;
		return this;
	}

	/**
	 * エディタUIを生成 (Client Side)
	 */
	this.mkEditor = function( mod, data, elm, callback ){
		if(!data || typeof(data) != typeof({})){
			data = {
				src: '',
				editor: ''
			};
		}

		var rows = 12;
		if( mod.rows ){
			rows = mod.rows;
		}

		if(typeof(data.src) != typeof('')){
			data.src = '';
		}
		if(typeof(data.editor) != typeof('')){
			data.editor = '';
		}

		if( rows != 1 ){

			switch( data.editor ){
				case 'markdown':
					var marked = require('marked');
					marked.setOptions({
						renderer: new marked.Renderer(),
						gfm: true,
						headerIds: false,
						tables: true,
						breaks: false,
						pedantic: false,
						sanitize: false,
						smartLists: true,
						smartypants: false,
						xhtml: true
					});
					data.src = marked(data.src);
					break;
				case 'text':
					// HTML特殊文字変換
					data.src = htmlspecialchars(data.src);

					// 改行コードは改行タグに変換
					data.src = data.src.split(/\r\n|\r|\n/g).join('<br />');
					break;
			}
		}


		var $div = $('<div>');
		$(elm).html($div);

		if( rows == 1 ){
			var $formElm = $('<input type="text" class="form-control">')
				.attr({
					"name": mod.name
				})
				.val(data.src)
				.css({'width':'100%'})
			;
			$div.append( $formElm );

			$div
				.append( $('<p>')
					.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="" /> HTML</label></span>'))
					.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="text" /> テキスト</label></span>'))
					.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="markdown" /> Markdown</label></span>'))
				)
			;
			$div.find('input[type=radio][name=editor-'+mod.name+'][value="'+data.editor+'"]').attr({'checked':'checked'});

		}else{

			$div.append(
				'<div class="broccoli-field-summernote">'+
				'</div>'
			);

			if( isGlobalJQuery ){
				// jQuery がある場合
				var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote').eq(0);
				$targetElm.summernote({
					// TODO: 隠蔽したい。
					placeholder: '',
					tabsize: 2,
					height: 90 + (18 * rows),
					toolbar: [
						['style', ['style']],
						['font', ['bold', 'underline', 'clear']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture', 'video']],
						['view', ['fullscreen', 'codeview', 'help']]
					]
				});
				$targetElm.summernote('code', data.src);
			}else{
				// jQuery がない場合
				console.error('broccoli-field-summernoteフィールドで Summernote (WYSIWYG)を利用するには、グローバルスコープに jQuery がロードされている必要があります。');
				$(elm).find('.broccoli-field-summernote').append( $('<textarea class="form-control">')
					.val(data.src)
					.attr({
						"rows": rows
					})
				);
			}
		}




		new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
			callback();
		}); });
		return this;
	}

	// /**
	//  * エディタUIで編集した内容を検証する (Client Side)
	//  */
	// this.validateEditorContent = function( elm, mod, callback ){
	// 	var errorMsgs = [];
	// 	// errorMsgs.push('エラーがあります。');
	// 	new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
	// 		callback( errorMsgs );
	// 	}); });
	// 	return this;
	// }

	/**
	 * エディタUIで編集した内容を保存 (Client Side)
	 */
	this.saveEditorContent = function( elm, data, mod, callback, options ){
		options = options || {};
		options.message = options.message || function(msg){};//ユーザーへのメッセージテキストを送信
		var rtn = {};
		var $dom = $(elm);

		var rows = 12;
		if( mod.rows ){
			rows = mod.rows;
		}

		rtn.src = '';
		rtn.editor = '';

		if( rows == 1 && $dom.find('input[type=text]').length ){
			rtn.src = $dom.find('input[type=text]').val();
			rtn.editor = $dom.find('input[type=radio][name=editor-'+mod.name+']:checked').val();

		}else if( isGlobalJQuery ){
			// jQuery がある場合
			var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote').eq(0);
				// TODO: 隠蔽したい。

			rtn.src = $targetElm.summernote('code');

		}else{
			// jQuery がない場合
			rtn.src = $dom.find('.broccoli-field-summernote textarea').val();
		}


		rtn = JSON.parse( JSON.stringify(rtn) );

		new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
			callback(rtn);
		}); });
		return this;
	}

}
