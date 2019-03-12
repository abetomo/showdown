showdown.subParser('makehtml.abetomoA', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('makehtml.abetomoA.before', text, options, globals).getText();

  // add a couple extra lines after the text and endtext mark
  text = text + '\n\n';

  var rgx = /(^ {0,3}->[ \t]?.+\n(.+\n)*\n*)+/gm;
  if (options.splitAdjacentBlockquotes) {
    rgx = /^ {0,3}<-[\s\S]*?(?:\n\n)/gm;
  }

  text = text.replace(rgx, function (bq) {
    bq = bq.replace(/^[ \t]*->[ \t]?/gm, ''); // trim one level of quoting

    // attacklab: clean up hack
    bq = bq.replace(/¨0/g, '');

    bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
    bq = showdown.subParser('makehtml.githubCodeBlocks')(bq, options, globals);
    bq = showdown.subParser('makehtml.blockGamut')(bq, options, globals); // recurse

    bq = bq.replace(/(^|\n)/g, '$1  ');
    // These leading spaces screw with <pre> content, so we need to fix that:
    bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
      var pre = m1;
      // attacklab: hack around Konqueror 3.5.4 bug:
      pre = pre.replace(/^  /mg, '¨0');
      pre = pre.replace(/¨0/g, '');
      return pre;
    });

    // Use Bulma
    var html = [
      '<div class="columns is-mobile">',
      '<div class="column is-2">',
      '<div class="left-image"></div>',
      '</div>',
      '<div class="left box column">',
      bq,
      '</div>',
      '</div>',
    ].join('\n');

    return showdown.subParser('makehtml.hashBlock')(
      html,
      options,
      globals
    );
  });

  text = globals.converter._dispatch('makehtml.abetomoA.after', text, options, globals).getText();

  return text;
});
