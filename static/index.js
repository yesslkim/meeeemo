const form = document.querySelector('#memo-form');
// const memo = document.querySelector('#content');
// const memoImg = document.querySelector('#image');

async function displayMemo() {
	const data = await getAllMemos();
	const ul = document.querySelector('.memo-output ul');
	ul.innerHTML = '';

	data.reverse().forEach(async memo => {
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

		const img = document.createElement('img');
		const res = await fetch(`/images/${memo.id}`);
		const blob = await res.blob();
		const imgLink = URL.createObjectURL(blob);
		img.src = imgLink;

		const input = document.createElement('input');
		input.type = 'text';
		input.value = memo.title;
		input.disabled = true;

		const textarea = document.createElement('textarea');
		textarea.dataset.id = memo.id;
		textarea.value = memo.contents;
		textarea.disabled = true;

		deleteBtn.append(deleteBtnText);
		btn.append(btnText);
		li.append(input, img, textarea, btn, deleteBtn);
		ul.append(li);
	});
}

async function getAllMemos() {
	const res = await fetch('/memo');
	const data = await res.json();
	return data;
}

// function deleteInputValue() {
// 	memo.value = '';
// }

async function handleSubmit(e) {
	e.preventDefault();
	const response = await fetch('/memo/create', {
		method: 'POST',
		body: new FormData(form),
	});

	const result = await response.json();

	console.log(result);

	if (result === '200') {
		alert('메모가 등록 되었습니다.');
		window.location.pathname = '/';
	}
}

// async function updateMemo(textarea, btnText) {
// 	const id = textarea.dataset.id;
// 	const res = await fetch(`/memo/${id}`, {
// 		method: 'PUT',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({
// 			id,
// 			content: textarea.value,
// 		}),
// 	});

// 	if (!res.ok) throw Error(`${res.status} ${res.statusText}`);
// 	alert('메모가 수정되었습니다 💙');

// 	textarea.disabled = true;
// 	btnText.textContent = '수정하기';
// }

// async function deleteMemo(textarea) {
// 	const id = textarea.dataset.id;
// 	const res = await fetch(`/memo/${id}`, { method: 'DELETE' });

// 	if (!res.ok) throw Error(`${res.status} ${res.statusText}`);
// 	alert('메모가 삭제되었습니다');
// 	displayMemo();
// }

// function enabledMemo(textarea, btnText) {
// 	textarea.disabled = false;
// 	btnText.textContent = '전송하기';
// }

// function handleMemo(e) {
// 	if (e.target.tagName !== 'BUTTON') return;
// 	const btn = e.target;
// 	const btnText = btn.querySelector('span');
// 	let textarea;

// 	switch (true) {
// 		case btnText.textContent === '수정하기':
// 			textarea = btn.previousElementSibling;
// 			enabledMemo(textarea, btnText);
// 			break;
// 		case btnText.textContent === '전송하기':
// 			textarea = btn.previousElementSibling;
// 			updateMemo(textarea, btnText);
// 			break;
// 		case btnText.textContent === '삭제하기':
// 			textarea = btn.previousElementSibling.previousElementSibling;
// 			deleteMemo(textarea);
// 			break;
// 		default:
// 			break;
// 	}
// }

document.querySelector('#memo-form').addEventListener('submit', handleSubmit);
// document.querySelector('.memo-output').addEventListener('click', handleMemo);
window.addEventListener('DOMContentLoaded', displayMemo);
