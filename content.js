const $ = selector => [...document.querySelectorAll(selector)];
const $make = (el, props = {}, children = []) => {
	const $el = document.createElement(el);
	$el.props = {};
	Object.entries(props).forEach(([k, v]) => {
		if (k === 'style') {
			Object.entries(v).forEach(([prop, val]) => {
				$el.style[prop] = val;
				console.log($el.style[prop], prop, val);
			});
		} else if (k.substring(0, 2) === 'on') {
			$el.addEventListener(k.substring(2).toLowerCase(), v);
		} else {
			$el.setAttribute(k, v);
		}
		$el.props[k] = v;
	});

	if (!Array.isArray(children)) children = [children];
	children
		.filter($child => !!$child)
		.forEach($child => {
			if (typeof $child === 'string' || typeof $child === 'number') {
				$el.appendChild(document.createTextNode($child));
			} else {
				$el.appendChild($child);
			}
		});

	return $el;
};

const $a11ybody = $make('x-a11y-body');

document.body.insertAdjacentElement('beforebegin', $a11ybody);
document.body.style.opacity = 0.1;
document.body.style.pointerEvents = 'none';

const getContents = $el => {
	if ($el.id) {
		const $label = document.querySelector(`label[for=${$el.id}]`);
		if ($label) {
			return $label.innerText;
		}
		return $el.innerText;
	}
	return $el.innerText;
};

const getMetrics = $el => {
	const { left, top, height, width } = $el.getBoundingClientRect();
	return {
		position: 'absolute',
		left: left + window.scrollX + 'px',
		top: top + window.scrollY + 'px',
		height: height + 'px',
		width: width + 'px',
	};
};

$('button, input[type=button]').forEach(element => {
	const $btn = $make(
		'x-a11y-button',
		{ element, style: getMetrics(element) },
		getContents(element)
	);
	$a11ybody.appendChild($btn);
});

$('a').forEach(element => {
	const $link = $make(
		'x-a11y-link',
		{ element, style: getMetrics(element) },
		getContents(element)
	);
	$a11ybody.appendChild($link);
});

$('input:not([type=button])').forEach(element => {
	const $link = $make(
		'x-a11y-input',
		{ element, style: getMetrics(element) },
		getContents(element)
	);
	$a11ybody.appendChild($link);
});

$('h1, h2, h3, h4, h5, h6').forEach(element => {
	const $link = $make(
		'x-a11y-text',
		{ element, style: getMetrics(element) },
		getContents(element)
	);
	$a11ybody.appendChild($link);
});
