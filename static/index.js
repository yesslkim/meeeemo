const memo = document.querySelector('#memo');

async function displayMemo() {
	const data = await getAllMemos();
	const ul = document.querySelector('.memo-output ul');
	ul.innerHTML = '';

	data.forEach(memo => {
		const li = document.createElement('li');

		const btnText = document.createElement('span');
		btnText.classList.add('sr-only');
		btnText.textContent = '수정하기';

		const btn = document.createElement('button');
		btn.type = 'button';

		const deleteBtnText = document.createElement('span');
		deleteBtnText.classList.add('sr-only');
		deleteBtnText.textContent = '삭제하기';

		const deleteBtn = document.createElement('button');
		deleteBtn.type = 'button';

		const textarea = document.createElement('textarea');
		textarea.dataset.id = memo.id;
		textarea.value = memo.content;
		textarea.disabled = true;

		deleteBtn.append(deleteBtnText);
		btn.append(btnText);
		li.append(textarea, btn, deleteBtn);
		ul.append(li);
	});
}

async function getAllMemos() {
	const res = await fetch('/memo');
	const data = await res.json();
	return data;
}

async function createMemo() {
	const res = await fetch('/memo/create', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: new Date().getTime(), content: memo.value }),
	});

	if (!res.ok) throw Error(`${res.status} ${res.statusText}`);

	const data = await res.json();
}

function deleteInputValue() {
	memo.value = '';
}

function handleSubmit(e) {
	e.preventDefault();
	createMemo();
	deleteInputValue();
	displayMemo();
}

async function updateMemo(textarea, btnText) {
	const id = textarea.dataset.id;
	const res = await fetch(`/memo/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			id,
			content: textarea.value,
		}),
	});

	if (!res.ok) throw Error(`${res.status} ${res.statusText}`);
	alert('메모가 수정되었습니다 💙');

	textarea.disabled = true;
	btnText.textContent = '수정하기';
}

async function deleteMemo(textarea) {
	const id = textarea.dataset.id;
	const res = await fetch(`/memo/${id}`, { method: 'DELETE' });

	if (!res.ok) throw Error(`${res.status} ${res.statusText}`);
	alert('메모가 삭제되었습니다');
	displayMemo();
}

function enabledMemo(textarea, btnText) {
	textarea.disabled = false;
	btnText.textContent = '전송하기';
}

function handleMemo(e) {
	if (e.target.tagName !== 'BUTTON') return;
	const btn = e.target;
	const btnText = btn.querySelector('span');
	let textarea;

	switch (true) {
		case btnText.textContent === '수정하기':
			textarea = btn.previousElementSibling;
			enabledMemo(textarea, btnText);
			break;
		case btnText.textContent === '전송하기':
			textarea = btn.previousElementSibling;
			updateMemo(textarea, btnText);
			break;
		case btnText.textContent === '삭제하기':
			textarea = btn.previousElementSibling.previousElementSibling;
			deleteMemo(textarea);
			break;
		default:
			break;
	}
}

document.querySelector('#memo-form').addEventListener('submit', handleSubmit);
document.querySelector('.memo-output').addEventListener('click', handleMemo);
window.addEventListener('DOMContentLoaded', displayMemo);
