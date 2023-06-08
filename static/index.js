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

		const textarea = document.createElement('textarea');
		textarea.dataset.id = memo.id;
		textarea.value = memo.content;
		textarea.disabled = true;

		btn.append(btnText);
		li.append(textarea, btn);
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

function enabledMemo(textarea, btnText) {
	textarea.disabled = false;
	btnText.textContent = '전송하기';
}

function handleMemo(e) {
	if (e.target.tagName !== 'BUTTON') return;
	const btn = e.target;
	const textarea = btn.previousElementSibling;
	const btnText = btn.querySelector('span');

	if (btnText.textContent === '수정하기') {
		enabledMemo(textarea, btnText);
	} else {
		updateMemo(textarea, btnText);
	}
}

document.querySelector('#memo-form').addEventListener('submit', handleSubmit);
document.querySelector('.memo-output').addEventListener('click', handleMemo);
window.addEventListener('DOMContentLoaded', displayMemo);
