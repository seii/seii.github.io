(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);

(function() {
	/*
	 * Code for special "click to expand" <aside> tags inspired by
	 * Jasper Flick @ catlikecoding.com
	 * Site: https://catlikecoding.com/
	 *
	 * USAGE:
	 * <aside>
	 *     <h3>SOME_HEADER_TEXT</h3>
	 *	       <div>
	 *		       <p>SOME_BODY_TEXT</p>
	 *		   </div>
	 *	   </h3>
	 * </aside>
	 */
	// Expansion toggle for asides.
	for(const h3 of document.querySelectorAll('aside h3')) {
		h3.onclick = function() {
			const div = this.nextSibling.nextSibling;
			div.className = div.className === 'expanded' ? '' : 'expanded';
			h3.className = h3.className === 'expanded' ? '' : 'expanded';
		};
	}
})();