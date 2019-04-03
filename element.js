const $ = selector => [...document.querySelectorAll(selector)];

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

const $makeBlockContents = ({ type, $original, title }) =>
	$make(
		'x-a11y-block',
		{
			element: $original,
			style: getMetrics($original),
			'data-type': type,
		},
		$make('div', {}, [$make('x-title', {}, title), $make('small', {}, type)])
	);

export { $, $makeBlockContents, $make };
