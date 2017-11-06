import postcss from 'postcss';
import test from 'ava';

import plugin from './index.js';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(
              result.css.replace(/\s+/g, ' ').trim(),
              output.replace(/\s+/g, ' ').trim());
            t.deepEqual(result.warnings().length, 0);
        });
}

test('class added to selectors as both combining class and parent', t => {
    return run(
        t,
        ` .foo,
          bar .baz,
          .buzz .bam,
          *::before,
          #main
          { }`,
        ` .scope .foo,         .scope.foo,
          .scope bar .baz,     bar.scope .baz,
          .scope .buzz .bam,   .scope.buzz .bam,
          .scope *::before,    .scope::before,
          .scope #main,        #main.scope
          { }`,
        { class: '.scope' });
});

test('does not add scope class to keyframes names', t => {
    return run(
        t,
        '@keyframes foo { }',
        '@keyframes foo { }',
        { class: '.scope' });
});

