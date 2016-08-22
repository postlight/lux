export default function routes() {
  this.resource('authors');
  this.resource('posts');
  this.resource('tags');

  this.namespace('admin', function () {
    this.resource('posts');
  });
}
