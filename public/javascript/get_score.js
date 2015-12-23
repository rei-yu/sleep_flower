function get_score (id) {
  if (id == 1 || id == 2 || id == 3) {
    console.log('team member');
    score = (300-50-20)/3;
  } else if (id == 4) {
    score = 100-10-10-40;
  } else if (id == 5) {
    score = 100;
  } else if (id == 6) {
    score = 100-30-10-10;
  } else {
    console.log('Invalid id');
    score = 100;
  }
  console.log('score:', score);
  return score;
}
