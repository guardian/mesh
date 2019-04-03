import { $, $makeBlockContents, $make } from './element.js';

const $blocks = [];

const $makeBlock = (type, $original) => {
	const $parent = $blocks
		.filter($block => $block.props.element.contains($original))
		.pop();

	if ($parent) {
		$parent.replaceWith(
			$makeBlockContents({
				$original,
				type: $parent.props['data-type'] + ' ' + type,
				title: $parent.props['title'] + ' ' + getContents($original),
			})
		);
		return null;
	}
	const $block = $makeBlockContents({
		type,
		$original,
		title: getContents($original),
	});
	$blocks.push($block);
	$original.tabIndex = 0;
	$original.addEventListener('mouseover', () => {
		$block.dataset.hover = 'hover';
	});
	$original.addEventListener('mouseout', () => {
		delete $block.dataset.hover;
	});
	$original.addEventListener('focus', () => {
		$block.dataset.focus = 'focus';
	});
	$original.addEventListener('blur', () => {
		delete $block.dataset.focus;
	});
	return $block;
};
const $a11ybody = $make('x-a11y-body');

document.body.insertAdjacentElement('beforebegin', $a11ybody);
document.body.style.opacity = 0.05;

const getContents = $el => {
	if ($el.nodeName.toLowerCase() === 'img') {
		if ($el.alt) {
			return $el.alt;
		} else {
			return $el.src.split('/').pop();
		}
	}
	if ($el.id) {
		const $label = document.querySelector(`label[for=${$el.id}]`);
		if ($label) {
			return $label.innerText;
		}
		return $el.innerText;
	}
	if (!$el.innerText && $el.closest('label')) {
		return $el.closest('label').innerText;
	}
	return $el.innerText;
};

$('button, input[type=button], [role=button]').forEach($original => {
	const $el = $makeBlock('button', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});

$('a').forEach($original => {
	const $el = $makeBlock('link', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});

$('input:not([type=button]):not([type=radio])').forEach($original => {
	const $el = $makeBlock('input', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});

$('input[type=radio]').forEach($original => {
	const $el = $makeBlock('input-radio', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});

$('img').forEach($original => {
	const $el = $makeBlock('img', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});

$('h1, h2, h3, h4, h5, h6').forEach($original => {
	const $el = $makeBlock('heading', $original);
	if ($el) {
		$a11ybody.appendChild($el);
	}
});
