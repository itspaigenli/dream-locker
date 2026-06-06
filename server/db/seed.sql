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
  visibility,
  archived
)
VALUES
  (
    1,
    'The Red Staircase',
    'I was standing under an old hospital. A red staircase led down into water. Someone kept repeating the number 314, but I could not see who was speaking.',
    'red staircase, hospital, water, 314',
    'unknown hospital basement',
    'private',
    false
  ),
  (
    2,
    'Basement Flood',
    'A hospital basement filled with water while a red warning light flashed above a locked door marked 314.',
    'hospital basement, water, red light, 314',
    'hospital basement',
    'public',
    false
  ),
  (
    1,
    'Glass Moon',
    'The moon looked like cracked glass. Every shard reflected the same empty train platform.',
    'glass moon, train platform, reflection',
    'empty station',
    'public',
    false
  ),
  (
    2,
    'The Static Orchard',
    'I walked through an orchard where every tree had a radio nailed to the trunk. Each radio played the same burst of static, then a voice said north gate.',
    'orchard, radios, static, north gate',
    'abandoned orchard',
    'public',
    false
  ),
  (
    1,
    'Room 19 Without Walls',
    'A classroom door said Room 19, but opening it led to a field of desks under a black sky. Every desk had the same wet envelope inside.',
    'room 19, desks, black sky, wet envelope',
    'school field',
    'private',
    false
  ),
  (
    2,
    'The Elevator Below Zero',
    'An elevator in a library went below the basement. The floor display counted down to -7, and the doors opened into a frozen train tunnel.',
    'library, elevator, -7, frozen tunnel',
    'old city library',
    'public',
    false
  ),
  (
    1,
    'Three Knocks From The Lake',
    'I heard three knocks from under a lake surface. A brass key floated up, followed by a red thread tied around a white stone.',
    'three knocks, lake, brass key, red thread',
    'pine lake',
    'public',
    false
  ),
  (
    2,
    'The Clock With No Hands',
    'A courthouse clock had no hands, but everyone in the square knew it was 3:14. The ground shook whenever anyone said the time out loud.',
    'courthouse, clock, 3:14, shaking ground',
    'old courthouse square',
    'public',
    false
  ),
  (
    1,
    'Signal Under The Bridge',
    'A green signal flashed under a bridge while water ran upward along the concrete. Someone had painted the word witness beside a locked service door.',
    'green signal, bridge, upward water, witness',
    'river service bridge',
    'private',
    false
  ),
  (
    2,
    'The Blue Lantern Ferry',
    'A ferry crossed a dry riverbed while a blue lantern swung from the mast. Every passenger carried a sealed map with the same missing island circled.',
    'blue lantern, ferry, dry riverbed, missing island',
    'dry river crossing',
    'public',
    false
  ),
  (
    1,
    'Museum Of Sleeping Bells',
    'A museum room held hundreds of bells under glass. None of them moved, but each one rang when I read the label out loud.',
    'museum, bells, glass cases, labels',
    'closed history museum',
    'public',
    false
  ),
  (
    2,
    'The White Door In The Rain',
    'A white door stood alone in heavy rain. It opened onto a stairwell full of moths and a wall calendar stuck on June 6.',
    'white door, rain, moths, June 6',
    'empty lot',
    'public',
    false
  ),
  (
    1,
    'Resolved Case: The Mirror Train',
    'Archived after investigators matched seven reports to the same closed subway platform and confirmed the mirror-train symbol belonged to a resolved pattern cluster.',
    'mirror train, closed platform, resolved cluster',
    'north terminal platform',
    'public',
    true
  ),
  (
    2,
    'Resolved Case: The Salt Room',
    'Archived after the repeated salt-room reports stopped appearing and the linked witnesses all identified the same coastal warehouse.',
    'salt room, coastal warehouse, linked witnesses',
    'coastal warehouse',
    'public',
    true
  ),
  (
    1,
    'Resolved Case: Lantern Street',
    'Archived after an admin marked the lantern-street investigation complete. The reports all pointed to the same alley, clock time, and blue window light.',
    'lantern street, alley, clock time, blue window',
    'lantern street alley',
    'private',
    true
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
  ),
  (
    1,
    9,
    3,
    'Both reports include the number 314 and a public structure connected to an unexplained event.'
  ),
  (
    3,
    5,
    3,
    'Both reports involve institutional spaces that open into impossible outdoor locations.'
  ),
  (
    6,
    8,
    3,
    'Both reports involve public buildings, impossible number displays, and movement below normal ground level.'
  ),
  (
    4,
    8,
    3,
    'Both reports include location markers that point toward a gate, bridge, or service entrance.'
  );
