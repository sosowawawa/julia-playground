(() => {
	let resolvePromise = null;
	let listenersSetup = false;

	// 要素取得を遅延させる
	function getElements() {
		return {
			overlay: document.getElementById('warning-dialog-overlay'),
			dialog: document.getElementById('warning-dialog'),
			titleEl: document.getElementById('warning-dialog-title'),
			messageTextEl: document.querySelector('#warning-dialog-message .dialog-message-text'),
			btnYes: document.getElementById('dialog-yes'),
			btnNo: document.getElementById('dialog-no')
		};
	}

	function setupListeners() {
		if (listenersSetup) return;
		listenersSetup = true;

		const {btnYes, btnNo} = getElements();
		if (!btnYes || !btnNo) {
			console.error('Dialog buttons not found');
			return;
		}

		// No: 単純にダイアログを閉じ、イベントを発火
		btnNo.addEventListener('click', () => {
			closeDialog(false);
			window.dispatchEvent(new CustomEvent('warning-dialog-no'));
		});

		// Yes: メッセージを差し替え、footer を close ボタンのみへ差し替える
		btnYes.addEventListener('click', () => {
			const {messageTextEl, overlay} = getElements();
			if (messageTextEl) messageTextEl.textContent = 'Pleeease…';

			const footer = overlay.querySelector('.dialog-footer');
			if (!footer) return;

			// replace buttons with a single Close button
			footer.innerHTML = '';
			const closeBtn = document.createElement('button');
			closeBtn.id = 'dialog-close';
			closeBtn.className = 'btn btn-close';
			closeBtn.textContent = 'Close';
			// あえてdialogスコープ内のため特別なリセットは不要
			footer.appendChild(closeBtn);

			// Close ボタンはダイアログを閉じ、index の GIF を差し替えるイベントを発火
			closeBtn.addEventListener('click', () => {
				const newGifUrl = 'https://media.tenor.com/awlXAXpEWHgAAAAi/ebichu-hamster.gif';
				closeDialog(true);

				// index ページにある GIF を差し替え（存在する場合）
				const topGif = document.getElementById('topGif');
				if (topGif) topGif.src = newGifUrl;

				window.dispatchEvent(new CustomEvent('warning-dialog-close', {detail: {newGifUrl}}));
			});

			window.dispatchEvent(new CustomEvent('warning-dialog-yes'));
		});

		// keyboard handling: Enter -> Yes, Escape -> No
		document.addEventListener('keydown', (e) => {
			const {overlay} = getElements();
			if (!overlay || overlay.hidden) return;
			if (e.key === 'Escape') { e.preventDefault(); closeDialog(false); }
			if (e.key === 'Enter') { e.preventDefault(); closeDialog(true); }
		});

		// click outside to close (No)
		const {overlay} = getElements();
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) closeDialog(false);
		});
	}

	function openDialog({title = 'Alert', message = 'If you make this choice, I infect your PC with a virus.', yesText = 'Yes', noText = 'No'}){
		setupListeners(); // リスナー設定を初回呼び出しで実行
		
		const {overlay, titleEl, messageTextEl, btnYes, btnNo} = getElements();
		titleEl.textContent = title;
		if (messageTextEl) messageTextEl.textContent = message;
		btnYes.textContent = yesText;
		btnNo.textContent = noText;

		overlay.hidden = false;
		// focus management
		btnNo.focus();

		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	}

	function closeDialog(result){
		const {overlay} = getElements();
		overlay.hidden = true;
		resolvePromise && resolvePromise(result);
		resolvePromise = null;
	}

	// Expose API
	window.showWarningDialog = openDialog;
})();
