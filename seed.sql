-- ============================================================
-- Belgian Garden Planner — Database Schema + Seed Data
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- ─── SCHEMA ─────────────────────────────────────────────────

CREATE TABLE plants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en         TEXT NOT NULL,
  name_fr         TEXT,
  name_nl         TEXT,
  name_latin      TEXT,
  slug            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('vegetable','fruit','herb','flower','spice')),
  description     TEXT,
  image_url       TEXT,
  outdoor         BOOLEAN DEFAULT true,
  greenhouse      BOOLEAN DEFAULT false,
  difficulty      TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  days_to_harvest INTEGER,
  notes           TEXT
);

CREATE TABLE planting_calendar (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id     UUID REFERENCES plants(id) ON DELETE CASCADE,
  activity     TEXT NOT NULL CHECK (activity IN ('sow_indoor','transplant','sow_outdoor','harvest')),
  month_start  INTEGER NOT NULL CHECK (month_start BETWEEN 1 AND 12),
  month_end    INTEGER NOT NULL CHECK (month_end BETWEEN 1 AND 12),
  location     TEXT CHECK (location IN ('indoor','outdoor','greenhouse')),
  notes        TEXT
);

CREATE TABLE companions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id       UUID REFERENCES plants(id) ON DELETE CASCADE,
  companion_id   UUID REFERENCES plants(id) ON DELETE CASCADE,
  relationship   TEXT NOT NULL CHECK (relationship IN ('beneficial','neutral','harmful')),
  reason         TEXT,
  UNIQUE(plant_id, companion_id)
);

-- Indexes for fast filtering
CREATE INDEX idx_plants_type ON plants(type);
CREATE INDEX idx_calendar_plant ON planting_calendar(plant_id);
CREATE INDEX idx_calendar_month ON planting_calendar(month_start, month_end);
CREATE INDEX idx_companions_plant ON companions(plant_id);


-- ─── SEED: PLANTS ───────────────────────────────────────────
-- Images from Wikimedia Commons (freely licensed)

INSERT INTO plants (name_en, name_fr, name_nl, name_latin, slug, type, description, image_url, outdoor, greenhouse, difficulty, days_to_harvest, notes) VALUES

-- VEGETABLES
('Tomato',       'Tomate',       'Tomaat',        'Solanum lycopersicum',     'tomato',       'vegetable', 'One of the most popular garden vegetables in Belgium. Needs warmth and support.',                                'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/320px-Bright_red_tomato_and_cross_section02.jpg',           true,  true,  'medium', 70,  'Needs staking. Water regularly at the base. Start indoors in Feb-Mar.'),
('Courgette',    'Courgette',    'Courgette',     'Cucurbita pepo',           'courgette',    'vegetable', 'Very productive. One or two plants is usually enough for a family.',                                         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Courgette_de_Nice_%C3%A0_fruit_rond.jpg/320px-Courgette_de_Nice_%C3%A0_fruit_rond.jpg',              true,  false, 'easy',   55,  'Harvest young (15–20cm) for best taste. Watch out for powdery mildew.'),
('Carrot',       'Carotte',      'Wortel',        'Daucus carota',            'carrot',       'vegetable', 'Easy to grow in deep, loose soil. Great for beginners.',                                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Vegetable-Carrot-Bundle-wStalks.jpg/320px-Vegetable-Carrot-Bundle-wStalks.jpg',                     true,  false, 'easy',   75,  'Avoid rocky or compacted soil. Thin seedlings to 5cm apart.'),
('Leek',         'Poireau',      'Prei',          'Allium ampeloprasum',      'leek',         'vegetable', 'Hardy winter vegetable, perfect for Belgian climate. Very frost resistant.',                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Leeks.jpg/320px-Leeks.jpg',                                                                           true,  false, 'easy',   120, 'Can overwinter in the ground. Hill up soil around stem for longer white part.'),
('Potato',       'Pomme de terre','Aardappel',    'Solanum tuberosum',        'potato',       'vegetable', 'A Belgian staple! Easy to grow in any good soil.',                                                          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Potato_je.jpg/320px-Potato_je.jpg',                                                                   true,  false, 'easy',   90,  'Hill up soil as plants grow. Watch for Colorado beetle. Early varieties from March.'),
('Lettuce',      'Laitue',       'Sla',           'Lactuca sativa',           'lettuce',      'vegetable', 'Fast growing, great for beginners. Pick outer leaves for continuous harvest.',                              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Lettuce_cos_Romaine.jpg/320px-Lettuce_cos_Romaine.jpg',                                              true,  true,  'easy',   45,  'Sow every 3 weeks for continuous supply. Bolts in heat — shade in summer.'),
('Spinach',      'Épinard',      'Spinazie',      'Spinacia oleracea',        'spinach',      'vegetable', 'Quick growing cool-season crop. Great for spring and autumn.',                                              'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spinacia_oleracea_Spinach_2013_G2.jpg/320px-Spinacia_oleracea_Spinach_2013_G2.jpg',                  true,  true,  'easy',   40,  'Bolts in summer heat. Best in spring (Mar–May) or autumn (Aug–Oct).'),
('Bean',         'Haricot vert', 'Sperzieboon',   'Phaseolus vulgaris',       'bean',         'vegetable', 'Easy and productive. Bush varieties need no support, climbing varieties need a trellis.',                   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Haricot-blanc_--_Phaseolus_vulgaris.jpg/320px-Haricot-blanc_--_Phaseolus_vulgaris.jpg',             true,  false, 'easy',   60,  'Do not sow before mid-May — beans hate cold soil. Nitrogen-fixing.'),
('Pea',          'Pois',         'Erwt',          'Pisum sativum',            'pea',          'vegetable', 'Sweet and rewarding. Sow early — peas love cool weather.',                                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Illustration_Pisum_sativum0.jpg/240px-Illustration_Pisum_sativum0.jpg',                               true,  false, 'easy',   65,  'Sow directly in March. Needs support netting. Pick frequently to encourage more pods.'),
('Radish',       'Radis',        'Radijs',        'Raphanus sativus',         'radish',       'vegetable', 'Fastest vegetable in the garden — ready in just 3–4 weeks!',                                               'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Radis_rose.jpg/320px-Radis_rose.jpg',                                                                  true,  false, 'easy',   25,  'Perfect for filling gaps between slower crops. Sow every 2 weeks.'),
('Onion',        'Oignon',       'Ui',            'Allium cepa',              'onion',        'vegetable', 'Essential kitchen crop. Best grown from sets (small bulbs) for beginners.',                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Onions.jpg/320px-Onions.jpg',                                                                           true,  false, 'easy',   100, 'Plant sets in March-April. Harvest when tops fall over and turn yellow.'),
('Garlic',       'Ail',          'Knoflook',      'Allium sativum',           'garlic',       'vegetable', 'Plant in autumn for a summer harvest. Very low maintenance.',                                              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Garlic_Deitikon_2011_AMA.jpg/320px-Garlic_Deitikon_2011_AMA.jpg',                                    true,  false, 'easy',   240, 'Plant individual cloves in Oct-Nov, harvest in July. Hang to dry after harvest.'),
('Broccoli',     'Brocoli',      'Broccoli',      'Brassica oleracea italica','broccoli',     'vegetable', 'Nutritious and hardy. Can tolerate light frost.',                                                          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Fresh_broccoli_head_DSC00862.jpg/320px-Fresh_broccoli_head_DSC00862.jpg',                            true,  false, 'medium', 80,  'After cutting the main head, smaller side shoots continue to grow.'),
('Cucumber',     'Concombre',    'Komkommer',     'Cucumis sativus',          'cucumber',     'vegetable', 'Grows best in a greenhouse in Belgium but can do well outdoors in a warm spot.',                           'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Garden_cucumber_fruit.jpg/320px-Garden_cucumber_fruit.jpg',                                            true,  true,  'medium', 55,  'Needs regular watering and warmth. Outdoor varieties are hardier.'),
('Beetroot',     'Betterave',    'Rode biet',     'Beta vulgaris',            'beetroot',     'vegetable', 'Colourful, easy and versatile. Leaves are also edible.',                                                   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bunch_of_beetroot.jpg/320px-Bunch_of_beetroot.jpg',                                                   true,  false, 'easy',   70,  'Thin to one seedling per cluster. Can leave in ground through mild frost.'),
('Kale',         'Chou kale',    'Boerenkool',    'Brassica oleracea sabellica','kale',       'vegetable', 'Superfood and very frost-hardy. Flavour improves after first frost.',                                      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Winterbor_Kale.jpg/320px-Winterbor_Kale.jpg',                                                          true,  false, 'easy',   90,  'Harvest outer leaves from bottom up. Can harvest all winter in Belgium.'),

-- FRUITS
('Strawberry',   'Fraise',       'Aardbei',       'Fragaria × ananassa',      'strawberry',   'fruit',     'Perfect for Belgian gardens and containers. Runners produce new plants freely.',                            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/320px-PerfectStrawberry.jpg',                                                     true,  true,  'easy',   90,  'Mulch with straw to keep fruit clean. Remove runners unless you want new plants.'),
('Raspberry',    'Framboise',    'Framboos',      'Rubus idaeus',             'raspberry',    'fruit',     'Easy to grow. Summer and autumn varieties available. Very productive.',                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Illustration_Rubus_idaeus0.jpg/240px-Illustration_Rubus_idaeus0.jpg',                                   true,  false, 'easy',   365, 'Plant canes in autumn. Cut old canes to ground after fruiting. Needs support.'),
('Blackcurrant', 'Cassis',       'Zwarte bes',    'Ribes nigrum',             'blackcurrant', 'fruit',     'Hardy shrub producing vitamin C-rich berries. Easy and long-lived.',                                       'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Schwarze_Johannisbeere_%28Black_currant%29_%28Ribes_nigrum%29.jpg/320px-Schwarze_Johannisbeere_%28Black_currant%29_%28Ribes_nigrum%29.jpg', true, false, 'easy', 365, 'Plant in autumn. Prune 1/3 of old wood each year. Birds love them — use netting.'),
('Blueberry',    'Myrtille',     'Bosbes',        'Vaccinium corymbosum',     'blueberry',    'fruit',     'Needs acidic soil (pH 4.5–5.5). Worth the effort for delicious berries.',                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Blueberries_Kropp_July_2020.jpg/320px-Blueberries_Kropp_July_2020.jpg',                                 true,  false, 'medium', 365, 'Amend soil with ericaceous compost. Mulch with pine bark. Self-fertile.'),

-- HERBS
('Basil',        'Basilic',      'Basilicum',     'Ocimum basilicum',         'basil',        'herb',      'Fragrant and essential for cooking. Loves warmth — not frost-hardy.',                                      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/01_Basil-Basilico-Ocimum_basilicum.jpg/320px-01_Basil-Basilico-Ocimum_basilicum.jpg',                 false, true,  'medium', 60,  'Keep indoors or in greenhouse in Belgium. Pinch flowers to keep bushy.'),
('Parsley',      'Persil',       'Peterselie',    'Petroselinum crispum',     'parsley',      'herb',      'Biennial herb, very useful in the kitchen. Hardy and easy.',                                               'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Parsley_Closeup.jpg/320px-Parsley_Closeup.jpg',                                                        true,  false, 'easy',   70,  'Slow to germinate (3–5 weeks). Soak seeds overnight to speed germination.'),
('Chives',       'Ciboulette',   'Bieslook',      'Allium schoenoprasum',     'chives',       'herb',      'Hardy perennial. One of the easiest herbs to grow. Pretty purple flowers.',                                'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Allium_schoenoprasum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-009.jpg/240px-Allium_schoenoprasum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-009.jpg', true, false, 'easy', 60, 'Cut back hard to encourage fresh growth. Divide clumps every 2-3 years.'),
('Mint',         'Menthe',       'Munt',          'Mentha spicata',           'mint',         'herb',      'Very vigorous — plant in a container to prevent it spreading everywhere!',                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Spearmint_Mentha_spicata_Habit_2000px.jpg/240px-Spearmint_Mentha_spicata_Habit_2000px.jpg',             true,  false, 'easy',   60,  'Grow in a buried pot or container to contain spreading roots.'),
('Thyme',        'Thym',         'Tijm',          'Thymus vulgaris',          'thyme',        'herb',      'Drought-tolerant Mediterranean herb. Fully hardy in Belgium.',                                             'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Thymus_vulgaris_Sturm_Deutschlands_Flora_in_Abbildungen.jpg/240px-Thymus_vulgaris_Sturm_Deutschlands_Flora_in_Abbildungen.jpg', true, false, 'easy', 90, 'Trim back after flowering to keep compact. Prefers well-drained soil.'),
('Rosemary',     'Romarin',      'Rozemarijn',    'Salvia rosmarinus',        'rosemary',     'herb',      'Evergreen shrub, semi-hardy in Belgium. Protect from severe frost.',                                       'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Rosemary_bush.jpg/320px-Rosemary_bush.jpg',                                                            true,  false, 'medium', 90,  'Plant in a sheltered, sunny spot. Bring indoors or mulch roots in cold winters.'),
('Coriander',    'Coriandre',    'Koriander',     'Coriandrum sativum',       'coriander',    'herb',      'Sow successionally for continuous supply. Both leaves and seeds are useful.',                              'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Coriandrum_sativum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-184.jpg/240px-Coriandrum_sativum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-184.jpg', true, false, 'medium', 50, 'Bolts easily — sow in partial shade in summer. Sow every 3 weeks.'),
('Dill',         'Aneth',        'Dille',         'Anethum graveolens',       'dill',         'herb',      'Feathery herb great with fish. Attracts beneficial insects.',                                              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Dill_%28Anethum_graveolens%29_plants.jpg/320px-Dill_%28Anethum_graveolens%29_plants.jpg',               true,  false, 'easy',   60,  'Do not transplant — sow directly. Avoid planting near fennel (cross-pollinates).'),

-- FLOWERS (companion planting)
('Nasturtium',   'Capucine',     'Oost-Indische kers','Tropaeolum majus',     'nasturtium',   'flower',    'Edible flowers and leaves. Acts as a trap crop for aphids, protecting other plants.',                      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Nasturtium_photograph.jpg/320px-Nasturtium_photograph.jpg',                                            true,  false, 'easy',   50,  'Flowers and leaves are edible. Let aphids gather on them to draw them away from veg.'),
('Marigold',     'Souci',        'Goudsbloem',    'Calendula officinalis',    'marigold',     'flower',    'Excellent companion plant. Deters whitefly and attracts pollinators.',                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Calendula-Orange-Flowers.jpg/320px-Calendula-Orange-Flowers.jpg',                                       true,  false, 'easy',   55,  'Petals are edible. Deadhead regularly to extend flowering. Self-seeds freely.'),
('Borage',       'Bourrache',    'Bernagie',      'Borago officinalis',       'borage',       'flower',    'Star-shaped blue flowers attract bees. Excellent companion for tomatoes and strawberries.',               'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Borage_flowers.jpg/320px-Borage_flowers.jpg',                                                           true,  false, 'easy',   55,  'Self-seeds prolifically. Blue flowers are edible and beautiful in salads.'),
('Lavender',     'Lavande',      'Lavendel',      'Lavandula angustifolia',   'lavender',     'flower',    'Attracts bees and butterflies. Strong scent deters many pests.',                                          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Tabletop.jpg/320px-Above_Tabletop.jpg',                                                           true,  false, 'easy',   365, 'Hardy perennial. Cut back by 1/3 after flowering. Avoid cutting into old wood.'),
('Sunflower',    'Tournesol',    'Zonnebloem',    'Helianthus annuus',        'sunflower',    'flower',    'Tall and cheerful. Attracts pollinators and provides shade for sensitive crops.',                         'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/A_sunflower.jpg/320px-A_sunflower.jpg',                                                                true,  false, 'easy',   80,  'Great at back of borders. Seeds attract birds. Acts as a windbreak.');


-- ─── SEED: PLANTING CALENDAR ────────────────────────────────
-- activity: sow_indoor | transplant | sow_outdoor | harvest
-- location: indoor | outdoor | greenhouse
-- months: 1=Jan ... 12=Dec

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  2, 3, 'indoor',     'Sow in seed trays at 18–22°C'              FROM plants WHERE slug = 'tomato';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  5, 5, 'outdoor',    'After last frost (mid-May in Belgium)'      FROM plants WHERE slug = 'tomato';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 10,'outdoor',    'Pick when fully coloured and slightly soft' FROM plants WHERE slug = 'tomato';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  4, 4, 'indoor',     'Sow 1 seed per pot'                        FROM plants WHERE slug = 'courgette';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  5, 6, 'outdoor',    'After all frost risk has passed'            FROM plants WHERE slug = 'courgette';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 10,'outdoor',    'Harvest at 15-20cm for best flavour'        FROM plants WHERE slug = 'courgette';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 7, 'outdoor',    'Sow direct, thin to 5cm apart'             FROM plants WHERE slug = 'carrot';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 11,'outdoor',    'Harvest when shoulders visible at soil'     FROM plants WHERE slug = 'carrot';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'indoor',     'Sow in modules, transplant when 20cm tall'  FROM plants WHERE slug = 'leek';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  6, 7, 'outdoor',    'Plant deep in holes, do not backfill'       FROM plants WHERE slug = 'leek';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     10,3, 'outdoor',    'Harvest from autumn through winter'         FROM plants WHERE slug = 'leek';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 4, 'outdoor',    'Plant seed potatoes 30cm apart, 10cm deep'  FROM plants WHERE slug = 'potato';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 10,'outdoor',    'Harvest when tops yellow and die back'      FROM plants WHERE slug = 'potato';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 8, 'outdoor',    'Sow every 3 weeks for continuous supply'    FROM plants WHERE slug = 'lettuce';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  1, 2, 'indoor',     'Under glass for early spring harvest'       FROM plants WHERE slug = 'lettuce';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     4, 11,'outdoor',    'Cut-and-come-again or full head harvest'    FROM plants WHERE slug = 'lettuce';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 5, 'outdoor',    'Sow direct in rows, thin to 15cm'           FROM plants WHERE slug = 'spinach';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 8, 9, 'outdoor',    'Autumn sowing for winter harvest'           FROM plants WHERE slug = 'spinach';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     4, 6, 'outdoor',    'Harvest outer leaves or cut whole plant'    FROM plants WHERE slug = 'spinach';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 5, 6, 'outdoor',    'Wait until soil is 12°C minimum'            FROM plants WHERE slug = 'bean';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 9, 'outdoor',    'Pick before seeds swell for tender pods'    FROM plants WHERE slug = 'bean';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 5, 'outdoor',    'Sow direct 5cm deep, 5cm apart'             FROM plants WHERE slug = 'pea';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 8, 'outdoor',    'Pick regularly to extend season'            FROM plants WHERE slug = 'pea';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 8, 'outdoor',    'Sow thinly, 1cm deep. Succession sow.'     FROM plants WHERE slug = 'radish';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     4, 9, 'outdoor',    'Pull as soon as roots form (25-30 days)'   FROM plants WHERE slug = 'radish';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 4, 'outdoor',    'Plant sets 10cm apart, tip just showing'    FROM plants WHERE slug = 'onion';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 8, 'outdoor',    'Harvest when tops fall and turn yellow'     FROM plants WHERE slug = 'onion';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 10,11,'outdoor',    'Plant individual cloves, pointed end up'    FROM plants WHERE slug = 'garlic';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 7, 'outdoor',    'Harvest when lower leaves turn yellow'      FROM plants WHERE slug = 'garlic';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'indoor',     'Sow in modules, transplant at 10cm tall'   FROM plants WHERE slug = 'broccoli';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  5, 6, 'outdoor',    'Plant deep, firm in well'                   FROM plants WHERE slug = 'broccoli';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     8, 11,'outdoor',    'Cut before flowers open. Side shoots follow' FROM plants WHERE slug = 'broccoli';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'greenhouse', 'Needs 20°C+ to germinate'                  FROM plants WHERE slug = 'cucumber';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  5, 6, 'outdoor',    'Only outdoors after last frost'             FROM plants WHERE slug = 'cucumber';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 9, 'outdoor',    'Harvest young for best crunch'              FROM plants WHERE slug = 'cucumber';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 6, 'outdoor',    'Sow clusters of 2-3 seeds, thin to 1'      FROM plants WHERE slug = 'beetroot';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 11,'outdoor',    'Harvest at golf ball size for best taste'   FROM plants WHERE slug = 'beetroot';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 5, 'indoor',     'Sow in modules, prick out at 5cm'          FROM plants WHERE slug = 'kale';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'transplant',  6, 7, 'outdoor',    'Plant deep, firm soil around stem'          FROM plants WHERE slug = 'kale';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     10,3, 'outdoor',    'Harvest outer leaves, frost improves taste' FROM plants WHERE slug = 'kale';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 3, 5, 'outdoor',    'Plant runners or crowns in spring'          FROM plants WHERE slug = 'strawberry';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 8, 'outdoor',    'Pick when fully red. Check daily.'          FROM plants WHERE slug = 'strawberry';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 10,11,'outdoor',    'Plant bare-root canes in autumn'            FROM plants WHERE slug = 'raspberry';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 9, 'outdoor',    'Summer varieties July-Aug, autumn to Oct'   FROM plants WHERE slug = 'raspberry';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'greenhouse', 'Sow at 18°C, keep well watered'            FROM plants WHERE slug = 'basil';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 9, 'greenhouse', 'Pinch out flowers. Harvest regularly.'     FROM plants WHERE slug = 'basil';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 5, 'indoor',     'Slow to germinate — be patient!'           FROM plants WHERE slug = 'parsley';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 6, 'outdoor',    'Direct sow after soaking overnight'        FROM plants WHERE slug = 'parsley';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 11,'outdoor',    'Cut stems from outside of plant'            FROM plants WHERE slug = 'parsley';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'indoor',     'Divide clumps or sow seeds'                FROM plants WHERE slug = 'chives';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     4, 11,'outdoor',    'Cut with scissors 2-3cm above ground'       FROM plants WHERE slug = 'chives';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Plant in a container to contain roots!'    FROM plants WHERE slug = 'mint';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     5, 10,'outdoor',    'Harvest before flowering for best flavour'  FROM plants WHERE slug = 'mint';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Plant in free-draining, sunny spot'        FROM plants WHERE slug = 'thyme';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     5, 11,'outdoor',    'Cut sprigs as needed year-round'            FROM plants WHERE slug = 'thyme';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Plant in sheltered, sunny, well-drained spot' FROM plants WHERE slug = 'rosemary';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     5, 12,'outdoor',    'Snip sprigs as needed throughout the year'  FROM plants WHERE slug = 'rosemary';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 7, 'outdoor',    'Sow direct every 3 weeks for continuity'   FROM plants WHERE slug = 'coriander';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     5, 10,'outdoor',    'Harvest leaves young. Collect seeds when brown' FROM plants WHERE slug = 'coriander';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 6, 'outdoor',    'Sow direct — does not like transplanting'  FROM plants WHERE slug = 'dill';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 9, 'outdoor',    'Harvest leaves before flowering'            FROM plants WHERE slug = 'dill';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 6, 'outdoor',    'Sow direct. Thrives in poor soil.'         FROM plants WHERE slug = 'nasturtium';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     7, 10,'outdoor',    'Harvest flowers and leaves as needed'       FROM plants WHERE slug = 'nasturtium';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_indoor',  3, 4, 'indoor',     'Sow in modules for best germination'       FROM plants WHERE slug = 'marigold';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 5, 5, 'outdoor',    'Direct sow after last frost'               FROM plants WHERE slug = 'marigold';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 10,'outdoor',    'Deadhead regularly to extend blooming'      FROM plants WHERE slug = 'marigold';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Sow direct. Self-seeds the following year' FROM plants WHERE slug = 'borage';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     6, 9, 'outdoor',    'Pick flowers as they open for salads'       FROM plants WHERE slug = 'borage';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Plant in full sun, well-drained soil'      FROM plants WHERE slug = 'lavender';

INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'sow_outdoor', 4, 5, 'outdoor',    'Sow direct or start indoors 4 weeks earlier' FROM plants WHERE slug = 'sunflower';
INSERT INTO planting_calendar (plant_id, activity, month_start, month_end, location, notes)
SELECT id, 'harvest',     8, 10,'outdoor',    'Cut heads when backs turn yellow-brown'     FROM plants WHERE slug = 'sunflower';


-- ─── SEED: COMPANION PLANTING ───────────────────────────────
-- We insert each pair once (A→B), the app should query both directions

INSERT INTO companions (plant_id, companion_id, relationship, reason) VALUES

-- Tomato companions
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='basil'),      'beneficial', 'Basil repels aphids, whitefly and spider mites. Improves tomato flavour.'),
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='marigold'),   'beneficial', 'Marigold deters whitefly and nematodes in the soil.'),
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='borage'),     'beneficial', 'Borage deters tomato hornworm and attracts pollinators.'),
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='nasturtium'), 'beneficial', 'Nasturtium acts as a trap crop for aphids and blackfly.'),
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='carrot'),     'beneficial', 'Carrots loosen soil around tomato roots.'),
((SELECT id FROM plants WHERE slug='tomato'), (SELECT id FROM plants WHERE slug='garlic'),     'beneficial', 'Garlic repels spider mites and aphids.'),

-- Carrot companions
((SELECT id FROM plants WHERE slug='carrot'), (SELECT id FROM plants WHERE slug='leek'),       'beneficial', 'Leeks repel carrot fly; carrots repel leek moth. Classic pairing.'),
((SELECT id FROM plants WHERE slug='carrot'), (SELECT id FROM plants WHERE slug='onion'),      'beneficial', 'Strong onion scent confuses carrot fly.'),
((SELECT id FROM plants WHERE slug='carrot'), (SELECT id FROM plants WHERE slug='chives'),     'beneficial', 'Chives deter aphids and carrot fly.'),
((SELECT id FROM plants WHERE slug='carrot'), (SELECT id FROM plants WHERE slug='rosemary'),   'beneficial', 'Rosemary scent deters carrot fly.'),

-- Bean companions
((SELECT id FROM plants WHERE slug='bean'),   (SELECT id FROM plants WHERE slug='carrot'),     'beneficial', 'Beans fix nitrogen that benefits carrots.'),
((SELECT id FROM plants WHERE slug='bean'),   (SELECT id FROM plants WHERE slug='courgette'),  'beneficial', 'Classic Three Sisters planting (with corn).'),
((SELECT id FROM plants WHERE slug='bean'),   (SELECT id FROM plants WHERE slug='nasturtium'), 'beneficial', 'Nasturtium deters blackfly, a major bean pest.'),
((SELECT id FROM plants WHERE slug='bean'),   (SELECT id FROM plants WHERE slug='onion'),      'harmful',    'Onions inhibit bean growth. Keep separate.'),
((SELECT id FROM plants WHERE slug='bean'),   (SELECT id FROM plants WHERE slug='garlic'),     'harmful',    'Garlic stunts bean growth.'),

-- Pea companions
((SELECT id FROM plants WHERE slug='pea'),    (SELECT id FROM plants WHERE slug='mint'),       'beneficial', 'Mint deters aphids and pea moth.'),
((SELECT id FROM plants WHERE slug='pea'),    (SELECT id FROM plants WHERE slug='radish'),     'beneficial', 'Radishes deter aphids.'),
((SELECT id FROM plants WHERE slug='pea'),    (SELECT id FROM plants WHERE slug='lettuce'),    'beneficial', 'Lettuce benefits from the shade of pea plants.'),
((SELECT id FROM plants WHERE slug='pea'),    (SELECT id FROM plants WHERE slug='onion'),      'harmful',    'Onions inhibit pea growth.'),

-- Strawberry companions
((SELECT id FROM plants WHERE slug='strawberry'), (SELECT id FROM plants WHERE slug='borage'),     'beneficial', 'Borage improves strawberry growth and flavour, and attracts pollinators.'),
((SELECT id FROM plants WHERE slug='strawberry'), (SELECT id FROM plants WHERE slug='chives'),     'beneficial', 'Chives deter aphids and improve berry flavour.'),
((SELECT id FROM plants WHERE slug='strawberry'), (SELECT id FROM plants WHERE slug='marigold'),   'beneficial', 'Marigolds deter nematodes and slugs.'),
((SELECT id FROM plants WHERE slug='strawberry'), (SELECT id FROM plants WHERE slug='spinach'),    'beneficial', 'Spinach as ground cover reduces moisture loss.'),

-- Courgette companions
((SELECT id FROM plants WHERE slug='courgette'), (SELECT id FROM plants WHERE slug='nasturtium'), 'beneficial', 'Nasturtium deters squash bugs and attracts pollinators needed for fruiting.'),
((SELECT id FROM plants WHERE slug='courgette'), (SELECT id FROM plants WHERE slug='marigold'),   'beneficial', 'Deters whitefly and soil pests.'),
((SELECT id FROM plants WHERE slug='courgette'), (SELECT id FROM plants WHERE slug='borage'),     'beneficial', 'Borage attracts pollinators — critical for courgette fruit set.'),
((SELECT id FROM plants WHERE slug='courgette'), (SELECT id FROM plants WHERE slug='dill'),       'beneficial', 'Dill attracts predatory insects that eat courgette pests.'),

-- Brassica (broccoli, kale) companions
((SELECT id FROM plants WHERE slug='broccoli'), (SELECT id FROM plants WHERE slug='nasturtium'), 'beneficial', 'Nasturtium deters cabbage white butterfly.'),
((SELECT id FROM plants WHERE slug='broccoli'), (SELECT id FROM plants WHERE slug='marigold'),   'beneficial', 'Deters aphids and whitefly from brassicas.'),
((SELECT id FROM plants WHERE slug='broccoli'), (SELECT id FROM plants WHERE slug='dill'),       'beneficial', 'Attracts predatory wasps that eat caterpillars.'),
((SELECT id FROM plants WHERE slug='kale'),     (SELECT id FROM plants WHERE slug='nasturtium'), 'beneficial', 'Nasturtium acts as decoy for cabbage white butterflies.'),
((SELECT id FROM plants WHERE slug='kale'),     (SELECT id FROM plants WHERE slug='thyme'),      'beneficial', 'Thyme deters cabbage worm and white butterfly.'),

-- Herb interactions
((SELECT id FROM plants WHERE slug='basil'),    (SELECT id FROM plants WHERE slug='parsley'),    'beneficial', 'Both deter pests when grown together near vegetables.'),
((SELECT id FROM plants WHERE slug='dill'),     (SELECT id FROM plants WHERE slug='coriander'),  'harmful',    'Do not grow together — they cross-pollinate and seeds lose character.'),
((SELECT id FROM plants WHERE slug='mint'),     (SELECT id FROM plants WHERE slug='tomato'),     'beneficial', 'Mint deters aphids and flea beetles near tomatoes.'),
((SELECT id FROM plants WHERE slug='mint'),     (SELECT id FROM plants WHERE slug='broccoli'),   'beneficial', 'Mint deters cabbage moth and aphids.'),

-- Flower beneficial combos
((SELECT id FROM plants WHERE slug='lavender'), (SELECT id FROM plants WHERE slug='rosemary'),   'beneficial', 'Both attract pollinators and grow well in the same dry, sunny conditions.'),
((SELECT id FROM plants WHERE slug='lavender'), (SELECT id FROM plants WHERE slug='thyme'),      'beneficial', 'Perfect companions: same needs, both attract bees.'),
((SELECT id FROM plants WHERE slug='sunflower'),(SELECT id FROM plants WHERE slug='cucumber'),   'beneficial', 'Sunflowers attract pollinators needed for cucumber fruit set.'),
((SELECT id FROM plants WHERE slug='sunflower'),(SELECT id FROM plants WHERE slug='courgette'),  'beneficial', 'Attracts pollinators and provides wind protection.'),

-- Garlic as broad pest deterrent
((SELECT id FROM plants WHERE slug='garlic'),   (SELECT id FROM plants WHERE slug='raspberry'),  'beneficial', 'Garlic deters aphids and other soft-bodied pests on raspberry canes.'),
((SELECT id FROM plants WHERE slug='garlic'),   (SELECT id FROM plants WHERE slug='lettuce'),    'beneficial', 'Garlic deters slugs and aphids.'),

-- Onion / leek family
((SELECT id FROM plants WHERE slug='onion'),    (SELECT id FROM plants WHERE slug='lettuce'),    'beneficial', 'Onions deter aphids that attack lettuce.'),
((SELECT id FROM plants WHERE slug='leek'),     (SELECT id FROM plants WHERE slug='celery'),     'beneficial', 'Classic pairing — mutual pest deterrence.'),

-- Beetroot
((SELECT id FROM plants WHERE slug='beetroot'), (SELECT id FROM plants WHERE slug='lettuce'),    'beneficial', 'Beetroot and lettuce complement each other without competing.'),
((SELECT id FROM plants WHERE slug='beetroot'), (SELECT id FROM plants WHERE slug='onion'),      'beneficial', 'Onions repel pests that affect beetroot.');
