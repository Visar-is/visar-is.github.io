// Bounded Select Control
// Prototype for a jQuery-based survey form control allowing multiple <select> dropdowns with numeric values of which the sum is bounded.
// E.g. “Distribution of activities in a working week” where the upper bound is the hours worked per week, and the participant selects 
// the number of hours dedicated to various activities, without the form elements allowing them to go above the upper bound.

$('.constrained-dropdown').not('.collapse').find('.primer').after('<p><label>Number of hours spent working in a typical week: <input class="percentage-select-limit" name="total_hours" /></label></p>');

$('.constrained-dropdown').last().after('<div class="percentage-select-feedback"></div>');

(function () {
	function BoundedSelect(limit, elements, percentageElement) {
		var el;
		var self = this;
  
		this.elements = elements;
		this.percentageElement = percentageElement;
		this.percentageElements = Object.create(null);
  
		this.updateLimit(limit);
  		counter = 1
		this.each(function (el) {
			var pEl = document.createElement('div');
			pEl.setAttribute('class', 'percentage-select-feedback-segment segment-' + counter);
			counter = counter+1
			self.percentageElement.append(pEl);
			self.percentageElements[el.name] = pEl;
			el.onchange = function (event) {
				self.update();
			};
		});
	}
  
	BoundedSelect.prototype.update = function () {
		var self = this;
		var max = self.limit - self.reduce(function (running, el) { return running + (el.value === '' ? 0 : +el.value); }, 0);
		self.disableOptionsHigherThan(max);
		self.updatePercentages();			
	};
  
	BoundedSelect.prototype.disableOptionsHigherThan = function (max) {
		var self = this;
		this.each(function (el) {
			self.each(function (optionEl) {
				optionEl.disabled = optionEl.value > (+el.value === '' ? max : +el.value + max);
			}, el.querySelectorAll('option'));
		});
	};
  
	BoundedSelect.prototype.updatePercentages = function () {
		var self = this;
		this.each(function (el) {
			var percentage = +el.value / self.limit * 100;
			self.percentageElements[el.name].style.width = percentage + '%';
		});
	};
  
	BoundedSelect.prototype.each = function (callback, collection=false) {
		collection = collection || this.elements;
		for (var i=0; i<collection.length; i++) {
			callback(collection[i]);
		}
		return this;
	};
  
	BoundedSelect.prototype.reduce = function (callback, initial) {
		var running = initial;
		for (var i=0; i<this.elements.length; i++) {
			running = callback(running, this.elements[i]);
		}
		return running;
	};
  
	BoundedSelect.prototype.updateLimit = function (newLimit) {
		this.limit = newLimit === '' ? 0 : +newLimit;
		var frag = document.createDocumentFragment();
		var self = this;
		el = document.createElement('option');
		el.selected = true;
		frag.appendChild(el);
		for (var i=1; i<=this.limit; i++) {
			el = document.createElement('option');
			el.textContent = i;
			frag.appendChild(el);
		}
  
		self.each(function (el) {
			el.innerHTML = '';
			el.appendChild(frag.cloneNode(true));
		});
	};
  
	var percentageSelect = new BoundedSelect(50, $('select.percentage-select'), $('.percentage-select-feedback'));
	var limitControl = $('.percentage-select-limit');
	limitControl.onkeyup = function (event) {
		percentageSelect.updateLimit(event.target.value);
	};
}());