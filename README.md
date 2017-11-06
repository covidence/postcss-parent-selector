# postcss-scope-at-selector

[PostCSS] plugin for altering the selectors in a stylesheet to limit their
scope to elements with an additional (specified) class or contained within an
ancestor holding that class.

Based on [parent-selector] and similar to it, as well as [prefixwrap] and
[Scopify]. However, they all require being able to apply the scoping selector
to a parent element. I needed to apply apply a stylesheet to a specific element
(and its descendents) without risking it applying to siblings (if a common
parent was augmented with new selector) or altering the DOM to have a dedicated
parent (which is not always possible, e.g. a specific `<li>`).

[PostCSS]: https://github.com/postcss/postcss
[parent-selector]: https://github.com/domwashburn/postcss-parent-selector
[prefixwrap]: https://github.com/dbtedman/postcss-prefixwrap
[Scopify]: https://github.com/pazams/postcss-scopify

## Example

**Options:**

```js
{class: '.my-scope'}
```

**Input CSS:**

```css
.foo {
    /* Input example */
}


.foo .bar,
div.foo .bar {
    /* Input example */
}
```

**Output CSS:**

```css
.my-scope .foo,
.my-scope.foo {
    /* Output example */
}


.my-scope .foo .bar,
.my-scope.foo .bar,
.my-scope div.foo .bar,
div.my-scope.foo .bar {
    /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-scope-at-selector') ])
```

See [PostCSS] docs for examples for your environment.

### Gulp.js _( with babel )_

```js
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import scope from 'postcss-scope-at-selector';

gulp.task('styles', () => {

     // array containing postcss plugins
    var processors = [
        scope({class: '.my-scope'})
    ];

    // source compiled css or scss files
    return gulp.src('./path/to/*.scss')
        .pipe(plumber())
        // scss compiling
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        // postcss processes the compiled css
        .pipe(postcss(processors))
        .pipe(gulp.dest('./path/to/dest'))
        .pipe(reload({ stream: true }));
});
```
