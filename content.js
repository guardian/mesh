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

$makeBlock = (type, $original) =>
	$make(
		'x-a11y-block',
		{
			element: $original,
			style: getMetrics($original),
			'data-type': type,
		},
		getContents($original)
	);

const $a11ybody = $make('x-a11y-body');

document.body.insertAdjacentElement('beforebegin', $a11ybody);
document.body.style.opacity = 0.1;
document.body.style.pointerEvents = 'none';

const getContents = $el => {
	if ($el.nodeName.toLowerCase() === 'img') {
		return $el.alt;
	}
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

$('button, input[type=button]').forEach($original => {
	const $el = $makeBlock('button', $original);
	$a11ybody.appendChild($el);
});

$('a').forEach($original => {
	const $el = $makeBlock('link', $original);
	$a11ybody.appendChild($el);
});

$('input:not([type=button])').forEach($original => {
	const $el = $makeBlock('button', $original);
	$a11ybody.appendChild($el);
});

$('img').forEach($original => {
	if ($original.alt) {
		const $el = $makeBlock('button', $original);
		$a11ybody.appendChild($el);
	}
});

$('h1, h2, h3, h4, h5, h6').forEach(element => {
	const $link = $make(
		'x-a11y-text',
		{ element, style: getMetrics(element) },
		getContents(element)
	);
	$a11ybody.appendChild($link);
});
