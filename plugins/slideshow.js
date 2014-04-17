/*
 * CSS Modal Plugin for a slideshow inside a modal
 * Author: Anselm Hannemann
 * Date: 2014-04-16
 */

'use strict';

/*
 * Function to handle actions on modal with slideshow
 * @param element {DOMNode} on which the action is called
 * @param action {string} stating the action `close`|`next`|`previous`
 */

var _slideshowHandler = function (CSSModal, action) {
	if (!action) {
		throw new Error('Error: No action specified');
	}

	var currentItem = CSSModal.activeElement.querySelector('img.is-active');
	var allItems = CSSModal.activeElement.querySelectorAll('img');
	var i = 0;
	var nextItem;
	var previousItem;

	// Evaluate action
	if (action == 'close') {
		CSSModal.trigger('cssmodal:hide', CSSModal.activeElement);
	} else if (action == 'next') {
		for (; i < allItems.length; i++) {
			if (allItems[i].className = 'is-active') {

				if (allItems[i + 1]) {
					nextItem = allItems[i + 1];
				}

				allItems[i].setAttribute('class', '');

				_initSlideshowItem(nextItem, 'show');
			}
		}
		// CSSModal.trigger('cssmodal:slideshow:next', CSSModal.activeElement);
	} else if (action == 'previous') {
		for (; i < allItems.length; i++) {
			if (allItems[i].className = 'is-active') {
				if (allItems[i - 1]) {
					previousItem = allItems[i - 1];
				}
				// allItems[i].setAttribute('class', '');
				_initSlideshowItem(previousItem, 'show');
			}
		}

		CSSModal.trigger('cssmodal:slideshow:previous', CSSModal.activeElement);
	}
};

/*
 *
 * @param CSSModal {CSSModal} (required)
 */

var _keyboardHandler = function (CSSModal, key) {
	if (!key) {
		throw new Error('Error: No key specified');
	}

	if (key.which == '37') {
		_slideshowHandler(CSSModal, 'previous');
	} else if (key.which == '39') {
		_slideshowHandler(CSSModal, 'next');
	}

	return;
};

/*
 * Initialize the specified slideshow item and its state
 * @param activeItem {int} (required, inherited through initSlideshow)
 * @param state {string} specifies the state, can be `hidden` or `show`
 */

var _initSlideshowItem = function (activeItem, state) {
	if (!activeItem) {
		throw new Error('Error: No activeItem found/specified.');
	}
	if (!state) {
		state = 'hidden';
	}

	// Handle element states
	if (state == 'hidden') {
		var styleVisuallyHidden = 'border: 0;clip: rect(0 0 0 0);height: 1px;margin: -1px;overflow:hidden;padding:0;position:absolute;width:1px;';

		activeItem.className = '';
		activeItem.style = styleVisuallyHidden;
	} else if (state == 'show') {
		var activeClass = 'is-active';

		activeItem.className = activeClass;
		activeItem.style = '';
	}

	CSSModal.activeElement.querySelector('.modal-content').appendChild(activeItem);
};

var _unloadSlideshowItem = function (activeItem, state) {
	// Unload images when not needed anymore
};

/*
 * Helper function to call resizeModalDynamically only under conditions
 * @param CSSModal {CSSModal} (required)
 * @param elementList {DOMNodeList} (required)
 * @param activeItem {int} can trigger a specific item
 */

var initSlideshow = function (CSSModal, elementList, activeItem) {
	if (!CSSModal) {
		throw new Error('Error: CSSModal is not loaded.');
	}
	if (!CSSModal.activeElement) {
		throw new Error('Error: No active modal.');
	}
	if (!elementList) {
		throw new Error('Error: No elementList provided to create slideshow of.');
	}
	if (!activeItem) {
		var activeItem = 1; // @TODO: Might need to work with DOMNode instead of [int]
	}

	// Gather all elements showing in one Array
	var slideshowContent = elementList;
	var $modalContent = CSSModal.activeElement.querySelector('.modal-content');

	// Remove elements from DOM
	// $modalContent.innerHTML = ''; // @TODO: Currently fucks up DOM when closing modal and calling it again (nothing there).
	// Preload other elements
	var i = 0;
	var allItems = CSSModal.activeElement.querySelectorAll('img');

	for (; i < allItems.length; i++) {
		_initSlideshowItem(allItems[i], 'hidden');
	}
	// Show specified element
	_initSlideshowItem(slideshowContent[activeItem], 'show');
};

/*
 * Assign basic event handlers
 */

CSSModal.on('cssmodal:show', document, function () { // @TODO: Make it work for the clicked element

	if (CSSModal.activeElement.hasAttribute('data-modal-slideshow')) {
		var slideshowSource = CSSModal.activeElement.querySelectorAll('img');

		initSlideshow(CSSModal, slideshowSource, 2); // @TODO: Make it configurable
	}
});

CSSModal.on('cssmodal:slideshow:next', document, function () {
	_slideshowHandler(CSSModal, 'next');
});

CSSModal.on('cssmodal:slideshow:previous', document, function () {
	_slideshowHandler(CSSModal, 'previous');
});

// CSSModal.on('cssmodal:hide', document, CSSModal.mainHandler);

CSSModal.on('keyup', window, function (event) {
	_keyboardHandler(CSSModal, event);
});

/*
 * AMD, module loader, global registration
 */

// Expose modal for loaders that implement the Node module pattern.
if (typeof module === 'object' && module && typeof module.exports === 'object') {
	module.exports = {};

// Register as an AMD module
} else if (typeof define === 'function' && define.amd) {

define(['CSSModal'], function (CSSModal) {
	initSlideshow(CSSModal);
});

// Export CSSModal into global space
} else if (typeof global === 'object' && typeof global.document === 'object') {
	initSlideshow(CSSModal);
}
