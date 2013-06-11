// While most of the IDB behaviors match between implementations a
// lot of the names still differ. This section tries to normalize the
// different objects & methods.
window.indexedDB = window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB;

window.IDBCursor = window.IDBCursor ||
  window.webkitIDBCursor;

window.IDBKeyRange = window.IDBKeyRange ||
  window.webkitIDBKeyRange;

window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction;

// Newer webkits expect strings for transaction + cursor paramters
// older webkit + older firefox require constants, we can drop
// the constants when both stable releases use strings
IDBTransaction = IDBTransaction || {};
IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
IDBTransaction.READ = IDBTransaction.READ || 'readonly';

IDBCursor = IDBCursor || {};
IDBCursor.NEXT = IDBCursor.NEXT || 'next';
IDBCursor.PREV = IDBCursor.PREV || 'prev';

