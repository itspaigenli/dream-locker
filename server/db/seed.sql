INSERT INTO users (username, email, password_hash, role)
VALUES
  ('mara', 'mara@example.com', 'placeholder_hash_mara', 'dreamer'),
  ('sol', 'sol@example.com', 'placeholder_hash_sol', 'dreamer'),
  ('iris', 'iris@example.com', 'placeholder_hash_iris', 'investigator'),
  ('admin', 'admin@example.com', 'placeholder_hash_admin', 'admin');

INSERT INTO dream_reports (
  user_id,
  title,
  description,
  symbols,
  location,
  visibility
)
VALUES
  (
    1,
    'The Red Staircase',
    'I was standing under an old hospital. A red staircase led down into water. Someone kept repeating the number 314, but I could not see who was speaking.',
    'red staircase, hospital, water, 314',
    'unknown hospital basement',
    'private'
  ),
  (
    2,
    'Basement Flood',
    'A hospital basement filled with water while a red warning light flashed above a locked door marked 314.',
    'hospital basement, water, red light, 314',
    'hospital basement',
    'public'
  ),
  (
    1,
    'Glass Moon',
    'The moon looked like cracked glass. Every shard reflected the same empty train platform.',
    'glass moon, train platform, reflection',
    'empty station',
    'public'
  );

INSERT INTO report_links (
  source_report_id,
  target_report_id,
  investigator_id,
  reason
)
VALUES
  (
    1,
    2,
    3,
    'Both reports mention a hospital basement, water, a red structure, and the number 314.'
  );
