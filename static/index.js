const memo = document.querySelector('#memo');

async function displayMemo() {
	const data = await getAllMemos();
	const ul = document.querySelector('.memo-output ul');
	ul.innerHTML = '';

	data.forEach(memo => {
		const li = document.createElement('li');
		li.textContent = memo.content;
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

document.querySelector('#memo-form').addEventListener('submit', handleSubmit);
window.addEventListener('DOMContentLoaded', displayMemo);
