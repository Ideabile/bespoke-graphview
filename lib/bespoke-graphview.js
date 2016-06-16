module.exports = function( options ) {
  // If you want options, they should be passed in here.
  // https://github.com/markdalgleish/bespoke.js#plugins-with-options
  if(typeof options === 'string') options = { el: options };
  var _defaults = {
    diagram: 'svg',
    el: '.diagram li',
  };

  if( typeof Object.assign !== 'undefined' ){
    var mergeObjects = Object.assign;
  } else {
    var mergeObjects = function mergeObjects() {
      var resObj = {};
      for(var i=0; i < arguments.length; i += 1) {
        var obj = arguments[i],
            keys = Object.keys(obj);
        for(var j=0; j < keys.length; j += 1) {
          resObj[keys[j]] = obj[keys[j]];
        }
      }
      return resObj;
    }
  }

  options = mergeObjects(_defaults, options);

  return function(deck) {
    // Use the 'deck' instance to interact with the presentation.
    // https://github.com/markdalgleish/bespoke.js#deck-instances
    var activeSlide, activeItem;

    // For example:
    //deck.next();
    var Items = deck.slides.map(function(slide){
      return [].slice.call(slide.querySelectorAll(options.el), 0);
    });

    function placeSvg(slideIndex, url){
      var ajax = new XMLHttpRequest();
      ajax.open('GET', url, true);
      ajax.send();
      ajax.onload = function(e){
        var div = document.createElement('div');
        div.innerHTML = ajax.responseText;
        div.classList.add('bespoke-graphview--graph');
        deck.slides[slideIndex].insertBefore(div, deck.slides[slideIndex].childNodes[0]);
        activateItem(activeSlide, activeItem)
      };
    };

    function getSvgSlide(slideIndex){
      return deck.slides[slideIndex].querySelector(options.diagram) || false;
    };

    function next(){
      var nextSlideIndex = activeSlide + 1;

      if(activeItemByOffset(1)){
        activateItem(activeSlide, activeItem + 1);
        return false;
      }else if( Items[nextSlideIndex] ){
        activateItem(nextSlideIndex, 0);
      }
      return true;
    };

    function prev(){
      var prevSlideIndex = activeSlide - 1;

      if (activeItemByOffset(-1)) {
        activateItem(activeSlide, activeItem - 1);
        return false;
      } else if (Items[prevSlideIndex]) {
        activateItem(prevSlideIndex, Items[prevSlideIndex].length - 1);
      }
      return true;
    };

    function focusSvgGroup(svg, config){
      var allGroups = svg.querySelectorAll('g'),
          focused = false;

      if(config.graph && config.graph === '*'){
        svg.querySelectorAll('g').forEach(function(el){
          el.classList.add('focus');
        });
        return false;
      }

      for(var i=0; i<allGroups.length; i++){
        var item = allGroups[i];
        if(typeof config.graph !== 'undefined' && item.getAttribute('id') === config.graph){
          item.classList.add('focus');
          focused = item;
          continue;
        }
        item.classList.remove('focus');
      }

      return focused;
    };

    function activateItem(slideIndex, itemIndex){
      if(itemIndex < 0) itemIndex = 0;
      if(itemIndex > Items[slideIndex].length - 1) itemIndex = Items[slideIndex].length - 1;

      activeSlide = slideIndex || 0;
      activeItem = itemIndex || 0;

      if(!Items[slideIndex] && !Items[slideIndex].length > 0 && !Items[slideIndex][itemIndex]) return true;

      var _slide = Items[slideIndex],
          svg = getSvgSlide(slideIndex);

      if(!svg) return true;

      Items[slideIndex].forEach(function(Item, b){
        var obj = Item.dataset;

        if(b === itemIndex){
          var currentGroup = focusSvgGroup(svg, obj),
              pos = currentGroup ? currentGroup.getBoundingClientRect() : false,
              itemSize = Item.getBoundingClientRect();

          if( pos ){
            if( obj.pos && obj.pos.indexOf('bottom') > -1 ){
              Item.style.bottom = pos.top+'px';
            }else{
              Item.style.top = pos.top + 'px';
            }

            if( obj.pos && obj.pos.indexOf('left') > -1 ){
              Item.style.right = pos.left - pos.width +'px';
            }else{
              Item.style.left = pos.left + pos.width+'px';
            }
          }

          Item.classList.add('active');
        }else if(b < itemIndex){
          Item.classList.remove('active');
          Item.classList.add('old');
        }else{
          Item.classList.remove('active');
          Item.classList.remove('old');
        }
      });

    };

    function activeItemByOffset(offset) {
      return Items[activeSlide][activeItem + offset] !== undefined;
    };

    Items.forEach(function(slide, index){
      if(slide.length <= 0) return false;
      placeSvg(index, deck.slides[index].querySelector('.diagram').dataset.graph);
    });

    deck.on('next', next);
    deck.on('prev', prev);

    deck.on('slide', function(e){
      activateItem(e.index, 0);
    });

    activateItem(0, 0);

  };
};
