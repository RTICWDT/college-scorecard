// (function(exports) {
//
//   var picc = exports.picc || (exports.picc = {});
//
//   picc.accordion = function() {
//     var selectors = {
//       button: '.accordion-toggle, button[aria-controls], a[aria-controls]',
//       content: null
//     };
//
//     var accordion = function(selection) {
//       selection.each(function() {
//         var root = d3.select(this);
//
//         var button = root.select(selectors.button);
//         if (button.empty()) {
//           console.warn('no <button aria-controls="..."> found in:', this);
//           return;
//         }
//
//         /*
//         if (button.property('nodeName') === 'A') {
//           button.attr('aria-role', 'button');
//         }
//         */
//
//         var content = root.select(contentSelector(button));
//         if (!content) {
//           console.error('no element with id: "%s" found in:', button.attr('aria-controls'), this);
//           return;
//         }
//
//         button.on('click', function() {
//           root.call(accordion.toggle);
//           d3.event.preventDefault();
//         });
//
//         root.each(update);
//       });
//     };
//
//     accordion.expanded = function(el) {
//       return d3.select(el)
//         .select(selectors.button)
//           .attr('data-expanded') === 'true';
//     };
//
//     accordion.toggle = function(selection) {
//       selection.each(function() {
//         var root = d3.select(this);
//         var expanded = root.attr('data-expanded') !== 'true';
//         root.attr('data-expanded', expanded);
//         update.call(this, true);
//       });
//     };
//
//     accordion.open = function(selection) {
//       selection.each(function() {
//         this.setAttribute('data-expanded', 'true');
//         update.call(this, true);
//       });
//     };
//
//     accordion.close = function(selection) {
//       selection.each(function() {
//         this.setAttribute('data-expanded', 'false');
//         update.call(this, true);
//       });
//     };
//
//     accordion.button = function(selector) {
//       if (!arguments.length) return selectors.button;
//       selectors.button = selector;
//       return accordion;
//     };
//
//     accordion.content = function(selector) {
//       if (!arguments.length) return selectors.content;
//       selectors.content = selector;
//       return accordion;
//     };
//
//     function update(dispatch) {
//       var root = d3.select(this);
//       var expanded = root.attr('data-expanded') === 'true';
//       var button = root.select(selectors.button);
//       var content = root.select(contentSelector(button));
//
//       button
//         .attr('aria-expanded', expanded)
//         .attr('title', buttonTitle(expanded));
//
//       content
//         .attr('aria-hidden', !expanded)
//         .classed('hidden', !expanded);
//
//
//       if (dispatch) {
//         this.dispatchEvent(new CustomEvent(expanded ? 'open' : 'close'));
//       }
//     }
//
//     function contentSelector(button) {
//       return selectors.content || ('#' + button.attr('aria-controls'));
//     }
//
//     function buttonTitle(expanded) {
//       return function() {
//         if (expanded && this.hasAttribute('data-expanded-title')) {
//           return this.getAttribute('data-expanded-title');
//         } else if (!expanded && this.hasAttribute('data-collapsed-title')) {
//           return this.getAttribute('data-collapsed-title');
//         }
//         return [
//           expanded ? 'Collapse' : 'Expand',
//           this.textContent.trim()
//         ].join(' ')
//       };
//     }
//
//     return accordion;
//   };
//
//
//   window.addEventListener('load', function() {
//     d3.selectAll('.picc-accordion')
//       .call(picc.accordion())
//       .on('open', function() {
//         var af = this.querySelector('[autofocus]');
//         if (af) af.focus();
//       });
//   });
//
// })(this);
