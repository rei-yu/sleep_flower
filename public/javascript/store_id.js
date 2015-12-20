function store_id (id) {
  if(id <= 25) {
    store.set('user_id', id);
  }
}
