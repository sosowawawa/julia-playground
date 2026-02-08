(() => {
	const overlay = document.getElementById('warning-dialog-overlay');
	const dialog = document.getElementById('warning-dialog');
	const titleEl = document.getElementById('warning-dialog-title');
	const messageEl = document.getElementById('warning-dialog-message');
	const btnYes = document.getElementById('dialog-yes');
	const btnNo = document.getElementById('dialog-no');

	let resolvePromise = null;

	function openDialog({title = '警告', message = '', yesText = 'はい', noText = 'いいえ'}){
		titleEl.textContent = title;
		messageEl.textContent = message;
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
		overlay.hidden = true;
		resolvePromise && resolvePromise(result);
		resolvePromise = null;
	}

	btnYes.addEventListener('click', () => closeDialog(true));
	btnNo.addEventListener('click', () => closeDialog(false));

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

	// Expose API
	window.showWarningDialog = openDialog;
})();
