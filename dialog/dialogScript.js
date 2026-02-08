(() => {
	let resolvePromise = null;
	// Elements are resolved on demand to support dynamic DOM insertion
	function getElements() {
		return {
			overlay: document.getElementById('warning-dialog-overlay'),
			dialog: document.getElementById('warning-dialog'),
			titleEl: document.getElementById('warning-dialog-title'),
			messageEl: document.getElementById('warning-dialog-message'),
			messageTextEl: document.querySelector('#warning-dialog-message .dialog-message-text'),
			btnYes: document.getElementById('dialog-yes'),
			btnNo: document.getElementById('dialog-no')
		};
	}

	function openDialog({title = 'Alert', message = 'If you make this choice, I infect your PC with a virus.', yesText = 'Yes', noText = 'No'}){
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

	// Setup event listeners dynamically when needed
	function setupListeners() {
		const {btnYes, btnNo, messageTextEl, overlay} = getElements();

		// No: 単純にダイアログを閉じ、イベントを発火
		btnNo.addEventListener('click', () => {
			closeDialog(false);
			window.dispatchEvent(new CustomEvent('warning-dialog-no'));
		});

		// Yes: メッセージを差し替え、footer を close ボタンのみへ差し替える
		btnYes.addEventListener('click', () => {
			if (messageTextEl) messageTextEl.textContent = 'Pleeease…';

			const footer = document.querySelector('.dialog-footer');
			if (!footer) return;

			// replace buttons with a single Close button
			footer.innerHTML = '';
			const closeBtn = document.createElement('button');
			closeBtn.id = 'dialog-close';
			closeBtn.className = 'btn btn-close';
			closeBtn.textContent = 'Close';
			footer.appendChild(closeBtn);

			// Close ボタンはダイアログを閉じ、index の GIF を差し替えるイベントを発火
			closeBtn.addEventListener('click', () => {
				const newGifUrl = 'https://media.tenor.com/awlXAXpEWHgAAAAi/ebichu-hamster.gif';

				// まずダイアログを閉じる
				closeDialog(true);

				// index ページにある GIF を差し替え（存在する場合）
				try {
					const topGif = window.parent && window.parent.document ? window.parent.document.getElementById('topGif') : document.getElementById('topGif');
					if (topGif) topGif.src = newGifUrl;
				} catch (e) {
					const topGif = document.getElementById('topGif');
					if (topGif) topGif.src = newGifUrl;
				}

				window.dispatchEvent(new CustomEvent('warning-dialog-close', {detail: {newGifUrl}}));
			});

			window.dispatchEvent(new CustomEvent('warning-dialog-yes'));
		});

		// keyboard handling: Enter -> Yes, Escape -> No
		document.addEventListener('keydown', (e) => {
			if (overlay.hidden) return;
			if (e.key === 'Escape') { e.preventDefault(); closeDialog(false); }
			if (e.key === 'Enter') { e.preventDefault(); closeDialog(true); }
		});

		// click outside to close (No)
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) closeDialog(false);
		});
	}

	// Setup listeners on first call
	let listenersSetup = false;
	const originalOpenDialog = openDialog;
	window.showWarningDialog = function(options) {
		if (!listenersSetup) {
			setupListeners();
			listenersSetup = true;
		}
		return originalOpenDialog(options);
	};
})();
