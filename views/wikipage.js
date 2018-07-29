const html = require("html-template-tag");
const marked = require('marked')
const layout = require("./layout");

module.exports = (page, author) => layout(html`
  <h3>${page.title}
      <small> (<a href="/wiki/${page.slug}/similar">Similar</a>)</small>
  </h3>
  <h4>by <a href="/users/${author.id}">${author.name}</a></h4>
  <hr/>
  <div id='content' class="page-body" >$${page.content}
  </div>
  <hr/>
  <a href="/wiki/${page.slug}/edit" class="btn btn-primary">edit this page</a>
  <a href="/wiki/${page.slug}/delete" class="btn btn-danger">delete this page</a>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    document.getElementById('content').innerHTML =
      marked('$${page.content}');
  </script>

`);
