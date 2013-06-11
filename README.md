[SundayData](http://github.com/olafura/sundaydata) - The Javascript Database Library that Scales and Syncs *ALPHA*
======================================================

SundayData was born out of the need to handle more data that Todo list and other simple applications.

If you rely complex syncing with CouchDB and don't have a lot of data then I would recommend using [PouchDB](http://pouchdb.com/). They really take care to do things right in replicating to and from CouchDB and it's not a easy job and very expensive. So I don't do that, I take as many shortcuts as I can, I act more like a client library with awesome offline support. This library builds on the great work PouchDB done.

Please consult [CouchDB API](http://wiki.apache.org/couchdb/HTTP_Document_API) to understand the foundation of SundayData api and most return values.

Features
--------

* Did I mention it scales, I've tested it with 25 thousand replicated entries that were then put through a simple view. I would not recommend that for people as it will slow down your computer, for now at least.

* View function caching, the library takes care of running all of your view functions that you saved in the database on all of the new and modified entries. And if you change the view function it runs it on all of them again.

* Supports chaining with deferred actions. So db.get(theID).remove().done() works, with the done at the end writing the result of the action on the console of your browser.

* It tries to be as small as possible, now around 54k (15k gzipped).

* It uses Enyojs core library to make it very readable source, though the inherit nature of IndexedDB adds some complexity that is not easy to get around.

Future
------

Create a simple interface to the library that makes it easy to update the dom as thing change in the database and other nice things. I have a solution for this but I want to keep the core library pretty minimal and well in line with how CouchDB works so not to hide away errors and other things about how it works ( like using rev for changes and other things ).

Make the replication be continuous and faster.

Get things to the point where I can remove the Alpha label of it, a lot of testing and checking how different browsers handle it.

Make it easy to use from Enyojs, the focus until now has to make a really good library with a great api.

Questions
---------

Join the [SundayData Mailing List](https://groups.google.com/forum/#!forum/sundaydata).
