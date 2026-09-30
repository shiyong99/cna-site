import { openDb, DB_PATH } from '../lib/db.mjs';

const db = openDb(DB_PATH);

db.exec(`
  DROP TABLE IF EXISTS nav;
  DROP TABLE IF EXISTS ticker;
  DROP TABLE IF EXISTS trending;
  DROP TABLE IF EXISTS sections;
  DROP TABLE IF EXISTS section_facets;
  DROP TABLE IF EXISTS articles;
  DROP TABLE IF EXISTS podcasts;
  DROP TABLE IF EXISTS series;
  DROP TABLE IF EXISTS videos;
  DROP TABLE IF EXISTS schedule;
  DROP TABLE IF EXISTS discover;
  DROP TABLE IF EXISTS fast_stories;
  DROP TABLE IF EXISTS fast_points;
  DROP TABLE IF EXISTS games;
  DROP TABLE IF EXISTS interactives;
  DROP TABLE IF EXISTS rss_feeds;
  DROP TABLE IF EXISTS newsletters;
  DROP TABLE IF EXISTS people;
  DROP TABLE IF EXISTS network_properties;
  DROP TABLE IF EXISTS ad_specs;
  DROP TABLE IF EXISTS ad_stats;
  DROP TABLE IF EXISTS contacts;
  DROP TABLE IF EXISTS search_items;

  CREATE TABLE nav (grp TEXT, label TEXT, href TEXT, position INTEGER, is_current INTEGER DEFAULT 0);
  CREATE TABLE ticker (symbol TEXT, value TEXT, change TEXT, up INTEGER, position INTEGER);
  CREATE TABLE trending (term TEXT, position INTEGER);
  CREATE TABLE sections (key TEXT PRIMARY KEY, title TEXT, dek TEXT);
  CREATE TABLE section_facets (section_key TEXT, facet TEXT, position INTEGER);
  CREATE TABLE articles (
    id INTEGER PRIMARY KEY, block TEXT, section TEXT, category TEXT, title TEXT,
    dek TEXT, age TEXT, tone TEXT, position INTEGER
  );
  CREATE TABLE podcasts (id INTEGER PRIMARY KEY, block TEXT, show TEXT, title TEXT, duration TEXT, tone TEXT, position INTEGER);
  CREATE TABLE series (id INTEGER PRIMARY KEY, block TEXT, name TEXT, dek TEXT, tone TEXT, position INTEGER);
  CREATE TABLE videos (id INTEGER PRIMARY KEY, block TEXT, category TEXT, title TEXT, duration TEXT, tone TEXT, position INTEGER);
  CREATE TABLE schedule (id INTEGER PRIMARY KEY, time TEXT, show TEXT, details TEXT);
  CREATE TABLE discover (id INTEGER PRIMARY KEY, title TEXT, dek TEXT, href TEXT, tone TEXT, position INTEGER);
  CREATE TABLE fast_stories (id INTEGER PRIMARY KEY, cat TEXT, title TEXT, tone TEXT, position INTEGER);
  CREATE TABLE fast_points (id INTEGER PRIMARY KEY, story_id INTEGER, position INTEGER, text TEXT);
  CREATE TABLE games (id INTEGER PRIMARY KEY, label TEXT, tone TEXT, position INTEGER);
  CREATE TABLE interactives (id INTEGER PRIMARY KEY, eyebrow TEXT, title TEXT, tone TEXT, position INTEGER);
  CREATE TABLE rss_feeds (id INTEGER PRIMARY KEY, category TEXT, url TEXT);
  CREATE TABLE newsletters (id INTEGER PRIMARY KEY, cadence TEXT, name TEXT, dek TEXT);
  CREATE TABLE people (id INTEGER PRIMARY KEY, kind TEXT, name TEXT, role TEXT, position INTEGER);
  CREATE TABLE network_properties (id INTEGER PRIMARY KEY, name TEXT, position INTEGER);
  CREATE TABLE ad_specs (id INTEGER PRIMARY KEY, name TEXT, dims TEXT, size TEXT);
  CREATE TABLE ad_stats (id INTEGER PRIMARY KEY, value TEXT, label TEXT);
  CREATE TABLE contacts (id INTEGER PRIMARY KEY, grp TEXT, heading TEXT, detail TEXT, email TEXT);
  CREATE TABLE search_items (id INTEGER PRIMARY KEY, title TEXT, category TEXT, type TEXT, position INTEGER);
`);

/* ---------------- Navigation ---------------- */
const nav = [
  // primary
  ...['Top Stories|index.html', 'Latest News|section.html?sec=latest-news', 'Singapore|section.html?sec=singapore', 'Asia|section.html?sec=asia',
      'East Asia|section.html?sec=east-asia', 'Commentary|section.html?sec=commentary', 'Business|section.html?sec=business',
      'CNA Insider|section.html?sec=cna-insider', 'TODAY|section.html?sec=today', 'Watch|watch.html', 'Listen|listen.html']
    .map((s, i) => ({ grp: 'primary', label: s.split('|')[0], href: s.split('|')[1], position: i })),
  // secondary
  ...['CNA Explains|section.html?sec=cna-explains', 'Sustainability|section.html?sec=sustainability', 'Singapore Parliament|section.html?sec=parliament',
      'World|section.html?sec=world', 'Sport|section.html?sec=sport', 'Visual Stories|section.html?sec=visual-stories', 'Interactives|interactives.html',
      'News Reports|watch.html', 'Documentaries & Shows|watch.html', 'TV Schedule|watch.html#schedule', 'CNA938 Live|listen.html',
      'Podcasts|listen.html#podcasts', 'Games|games.html', 'FAST|fast.html', 'Newsletters|newsletters.html', 'RSS|rss.html']
    .map((s, i) => ({ grp: 'secondary', label: s.split('|')[0], href: s.split('|')[1], position: i })),
  // editions
  { grp: 'editions', label: 'World', href: 'index.html', position: 0, is_current: 1 },
  { grp: 'editions', label: 'Singapore', href: 'section.html?sec=singapore', position: 1 },
  { grp: 'editions', label: 'Asia', href: 'section.html?sec=asia', position: 2 },
  { grp: 'editions', label: 'Indonesia', href: 'section.html?sec=asia', position: 3 }
];
const insNav = db.prepare('INSERT INTO nav (grp,label,href,position,is_current) VALUES (?,?,?,?,?)');
nav.forEach((n) => insNav.run(n.grp, n.label, n.href, n.position, n.is_current || 0));

/* ---------------- Ticker ---------------- */
const ticker = [
  ['STI', '3,872.14', '+0.64%', 1], ['S&P 500', '6,481.02', '+0.31%', 1], ['NASDAQ', '21,290.44', '-0.12%', 0],
  ['DOW', '44,915.38', '+0.22%', 1], ['HANG SENG', '25,110.75', '+1.08%', 1], ['NIKKEI 225', '43,670.91', '+0.47%', 1],
  ['KOSPI', '3,144.28', '-0.33%', 0], ['USD/SGD', '1.2874', '+0.02%', 1], ['BRENT', '$82.41', '-1.20%', 0],
  ['GOLD', '$3,312.60', '+0.14%', 1], ['BTC', '$97,420', '+2.15%', 1]
];
const insTicker = db.prepare('INSERT INTO ticker (symbol,value,change,up,position) VALUES (?,?,?,?,?)');
ticker.forEach((t, i) => insTicker.run(t[0], t[1], t[2], t[3], i));

/* ---------------- Trending ---------------- */
const trending = ['Budget 2026', 'Asian Games', 'Iran crisis', 'AI safety', 'PSLE', 'Haze', 'Najib pardon', 'F1 Singapore'];
const insTrend = db.prepare('INSERT INTO trending (term,position) VALUES (?,?)');
trending.forEach((t, i) => insTrend.run(t, i));

/* ---------------- Sections ---------------- */
const sections = [
  ['latest-news', 'Latest News', 'The newest stories from Singapore, Asia and the world.', ['All', 'Article', 'Video', 'Podcast']],
  ['singapore', 'Singapore', 'Breaking stories and live updates from Singapore.', ['All', 'Politics', 'Transport', 'Education', 'Health']],
  ['asia', 'Asia', 'China, India and Southeast Asia coverage.', ['All', 'Malaysia', 'Indonesia', 'China', 'Thailand']],
  ['east-asia', 'East Asia', 'News from Japan, the Koreas, China and Taiwan.', ['All', 'Japan', 'South Korea', 'China']],
  ['commentary', 'Commentary', 'Sharp analysis and opinion from CNA contributors.', ['All', 'Singapore', 'Malaysia', 'China', 'World', 'Snap Insight']],
  ['business', 'Business', 'Market news, stock updates and company analysis.', ['All', 'Markets', 'Tech', 'Energy', 'Companies']],
  ['world', 'World', 'Global headlines and in-depth analysis.', ['All', 'US', 'Europe', 'Middle East']],
  ['sport', 'Sport', 'Scores, results and highlights.', ['All', 'Badminton', 'Football', 'F1']],
  ['cna-insider', 'CNA Insider', 'Investigative reports and deep dives.', ['All', 'Investigations', 'Documentaries']],
  ['today', 'TODAY', 'In-depth features and columns from Singapore.', ['All', 'Big Read', 'Voices', 'Up Close', 'Ground Up']],
  ['cna-explains', 'CNA Explains', 'Clear, quick explainers on the issues that matter.', ['All', 'Explainer', 'Politics', 'Economy']],
  ['sustainability', 'Sustainability', 'Climate, environment and the energy transition.', ['All', 'Climate', 'Energy', 'Policy']],
  ['parliament', 'Singapore Parliament', 'Sittings, debates and policy from the House.', ['All', 'Debates', 'Video']],
  ['visual-stories', 'Visual Stories', 'Top news in immersive visuals.', ['All', 'Photo', 'Interactive']]
];
const insSec = db.prepare('INSERT INTO sections (key,title,dek) VALUES (?,?,?)');
const insFacet = db.prepare('INSERT INTO section_facets (section_key,facet,position) VALUES (?,?,?)');
sections.forEach((s) => {
  insSec.run(s[0], s[1], s[2]);
  s[3].forEach((f, i) => insFacet.run(s[0], f, i));
});

/* ---------------- Articles ---------------- */
const articles = [
  ['hero', 'asia', 'Asia', 'Anthony Loke’s new resignation offer: what’s next for him, Anwar and Malaysia’s transport projects?', 'The transport minister’s resignation in protest of Najib Razak’s conditional royal pardon took a fresh turn — he says it will take effect only when Najib begins house arrest.', '26 minutes ago', 'ph--c'],
  ['top', 'world', 'World', 'Iran threatens new strikes as it awaits US response to Hormuz plan', 'Tehran intensified its rhetoric, warning that no infrastructure in the region would be safe if its security is not guaranteed.', '4 hours ago', 'ph--b'],
  ['top', 'east-asia', 'East Asia', 'North Korea calls DMZ mine blast a \'farce\' as UN Command cites armistice breach', 'A joint investigation found another active anti-personnel mine on the South Korean side of the Demarcation Line.', '3 minutes ago', 'ph--d'],
  ['top', 'singapore', 'Singapore', 'Around 100 businesses caught buying fake reviews in largest probe by competition watchdog', '45 firms must apologise publicly and remove fabricated reviews posted on Google, Facebook, Tripadvisor and Carousell.', '14 minutes ago', 'ph--e'],
  ['top', 'business', 'Business', 'ChatGPT maker wants to be the App Store for AI as safety concerns grow', 'OpenAI launched a cheaper model and continuous-running tools, aiming to reposition ChatGPT as a platform.', '2 hours ago', 'ph--f'],
  ['top', 'commentary', 'Commentary', 'Commentary: Who in Iran can make a deal with the US — and make it stick?', 'Any deal would need to proceed in smaller, verifiable steps — safe passage through Hormuz is the obvious first test.', '3 hours ago', 'ph--c'],
  ['singapore', 'singapore', 'Singapore', 'Public transport fares to rise by 12 to 13 cents per ride from Dec 26', 'Record hike for adult card users as operating costs climb.', '1 hour ago', 'ph--e'],
  ['singapore', 'singapore', 'Singapore', 'Scrapping PSLE or DSA could create new pressures: David Neo', 'Education minister says changes would send the wrong signals.', '1 hour ago', 'ph--d'],
  ['singapore', 'singapore', 'Singapore', 'From reluctant recyclers to serial collectors: the beverage container scheme', 'How a 10-cent refund is shifting habits.', '3 hours ago', 'ph--b'],
  ['asia', 'asia', 'Asia', '‘Everything is clear now’: What Jokowi’s PSI membership means for his family', 'The ex-president ends months of speculation over his political home.', '5 hours ago', 'ph--c'],
  ['asia', 'asia', 'Asia', 'India was late to the AI chip race. Could cameras and cars offer a way in?', 'Specialised processors may be India’s path to relevance.', '3 hours ago', 'ph--f'],
  ['asia', 'asia', 'Asia', '\'Gift from God\': rain brings relief from Indonesia toxic haze', 'Downpours clear skies over Pontianak after weeks of wildfire smoke.', '17 hours ago', 'ph--b'],
  ['commentary', 'commentary', 'Chua Yeow Hwee', '4,620 retrenchments in Q2 — but that\'s not the only figure to watch', '', 'a day ago', 'ph--f'],
  ['commentary', 'commentary', 'Victor Seah', 'Pressures of platform work push drivers and riders to take risks', '', '2 days ago', 'ph--d'],
  ['commentary', 'commentary', 'Leslie Lopez', 'Anthony Loke\'s resignation offer matters little to DAP\'s fate', '', '4 days ago', 'ph--b'],
  ['commentary', 'commentary', 'Steven R. Okun', 'Snap Insight: though Trump-Xi summit achieves little, 2026 is a high point', '', '4 days ago', 'ph--e'],
  ['visual', 'visual-stories', 'Visual Stories', 'Thai Airways to clear 5,000 bags stranded at Bangkok airport', '', '21 hours ago', 'ph--b'],
  ['visual', 'visual-stories', 'Visual Stories', 'New cat species identified in Bolivia, first in over a century', '', '22 hours ago', 'ph--d'],
  ['visual', 'visual-stories', 'Visual Stories', 'Singapore athletes in action at the 20th Asian Games', '', '2 days ago', 'ph--c'],
  ['lifestyle', 'cna-insider', 'CNA Insider', 'Can I quit my job with S$35K savings? A financial planner reviews Gen Z profiles', '', '2 months ago', 'ph--f'],
  ['lifestyle', 'today', 'TODAY · Big Read', 'AI is creating an economy that can grow without needing more workers', '', '4 days ago', 'ph--e'],
  ['lifestyle', 'lifestyle', 'Lifestyle · Travel', 'Singapore Airlines unveils refreshed in-flight dishes, from lobster to beef rib', '', '22 hours ago', 'ph--c'],
  ['brand', 'brand-studio', 'brand studio', 'Beyond banking: how HSBC Premier Elite serves the aspirations of the affluent', '', '', 'ph--c'],
  ['brand', 'brand-studio', 'brand studio', 'How Pan-United is laying the foundations for the future of concrete', '', '', 'ph--f'],
  ['also', 'asia', 'Asia', 'Ex-Malaysia PM Mahathir says wife was \'quite well\' the night before death', '', '17 hours ago', 'ph--c'],
  ['also', 'asia', 'Asia', '\'Everything is clear now\': what Jokowi\'s PSI membership means', '', '5 hours ago', 'ph--d'],
  ['also', 'singapore', 'Singapore', 'Goh Jin Hian testifies in false trading trial', '', '14 hours ago', 'ph--b'],
  ['section', 'asia', 'Asia', 'Anthony Loke’s new resignation offer: what’s next for him, Anwar and Malaysia?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '26 minutes ago', 'ph--b'],
  ['section', 'world', 'World', 'Iran threatens new strikes as it awaits US response to Hormuz plan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '4 hours ago', 'ph--c'],
  ['section', 'singapore', 'Singapore', 'Around 100 businesses caught buying fake reviews in largest probe by watchdog', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '14 minutes ago', 'ph--d'],
  ['section', 'east-asia', 'East Asia', 'North Korea calls DMZ mine blast a \'farce\' as UN Command cites breach', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '3 minutes ago', 'ph--e'],
  ['section', 'business', 'Business', 'ChatGPT maker wants to be the App Store for AI', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '2 hours ago', 'ph--f'],
  ['section', 'commentary', 'Commentary', 'Commentary: Who in Iran can make a deal with the US — and make it stick?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '3 hours ago', 'ph--b'],
  ['section', 'asia', 'Asia', 'India was late to the AI chip race. Could cameras and cars offer a way in?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '3 hours ago', 'ph--c'],
  ['section', 'singapore', 'Singapore', 'Public transport fares to rise by 12 to 13 cents per ride from Dec 26', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '1 hour ago', 'ph--d'],
  ['section', 'singapore', 'Singapore', 'Scrapping PSLE or DSA could create new pressures: David Neo', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '1 hour ago', 'ph--e'],
  ['section', 'sport', 'Sport', 'Man City guilty of using \'sham\' deals to distort finances', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '2 hours ago', 'ph--f'],
  ['section', 'podcast', 'Podcast', 'Interest rates are up: should you pay down your debt now?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'a day ago', 'ph--b'],
  ['section', 'video', 'Video', 'Singapore Tonight — Tue 29 Sep 2026', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '12 hours ago', 'ph--c']
];
const insArt = db.prepare('INSERT INTO articles (block,section,category,title,dek,age,tone,position) VALUES (?,?,?,?,?,?,?,?)');
articles.forEach((a, i) => insArt.run(a[0], a[1], a[2], a[3], a[4], a[5], a[6], i));

/* ---------------- Podcasts ---------------- */
const podcasts = [
  ['featured', 'CNA Correspondent', 'Foreigners in Malaysia — who gets to stay and who doesn\'t?', '21 mins', 'ph--d'],
  ['featured', 'Money Talks', 'Interest rates are up: should you pay down your debt now?', '27 mins', 'ph--e'],
  ['featured', 'Deep Dive', 'Do racist comments online reflect what Singaporeans think?', '33 mins', 'ph--b'],
  ['featured', 'Work It', 'Retrenched? How outplacement support can help', '22 mins', 'ph--c'],
  ['this-week', 'CNA Correspondent', 'Foreigners in Malaysia — who gets to stay?', '21 mins', 'ph--d'],
  ['this-week', 'Money Talks', 'Interest rates are up: pay down your debt now?', '27 mins', 'ph--b'],
  ['more', 'Money Talks', 'US or UCITS ETFs: which is better for Singapore investors?', '24 mins', 'ph--b'],
  ['more', 'Deep Dive', 'Do racist comments online reflect what Singaporeans think?', '33 mins', 'ph--e'],
  ['more', 'CNA Correspondent', 'Why haze has Southeast Asia in a chokehold', '19 mins', 'ph--d']
];
const insPod = db.prepare('INSERT INTO podcasts (block,show,title,duration,tone,position) VALUES (?,?,?,?,?,?)');
podcasts.forEach((p, i) => insPod.run(p[0], p[1], p[2], p[3], p[4], i));

const series = [
  ['news-features', 'Deep Dive', 'Steven Chia and Tiffany Ang unpack Singapore news.', 'ph--c'],
  ['news-features', 'CNA Correspondent', 'Behind the scenes of the biggest global stories.', 'ph--b'],
  ['news-features', 'CNA Headline News', 'The latest hourly news updates from CNA.', 'ph--e'],
  ['work-money', 'Money Talks', 'Your weekly dose of personal finance with Andrea Heng.', 'ph--d'],
  ['work-money', 'Work It', 'Career tips and workplace advice with Nat and Gerald.', 'ph--f'],
  ['work-money', 'CNA938 Rewind', 'The best interviews from CNA938.', 'ph--c']
];
const insSeries = db.prepare('INSERT INTO series (block,name,dek,tone,position) VALUES (?,?,?,?,?)');
series.forEach((s, i) => insSeries.run(s[0], s[1], s[2], s[3], i));

/* ---------------- Videos ---------------- */
const videos = [
  ['recommended', 'Documentary', 'The Asian Guilt Code — An Emotional Blueprint', '46m', 'ph--b'],
  ['recommended', 'Sport', 'Loh Kean Yew storms into badminton men\'s singles final', '2m', 'ph--d'],
  ['recommended', 'Podcast', 'Foreigners in Malaysia: who gets to stay and who doesn\'t?', '21m', 'ph--e'],
  ['news', 'News Video Reports', 'Asian Games 2026: Loh Kean Yew misses out on badminton gold', '2 mins', 'ph--c'],
  ['news', 'News Video Reports', 'Singapore wins first medal in digital construction at WorldSkills', '6 mins', 'ph--b'],
  ['news', 'News Video Reports', 'Some outdoor fitness classes go on as planned despite haze', '5 mins', 'ph--e'],
  ['news', 'News Video Reports', 'Youth offending rate rises, driven by jump in cheating offences', '3 mins', 'ph--d'],
  ['docs', 'Current Affairs', 'When Titans Clash — China\'s Plan To Create Industries Of The Future', '47m', 'ph--c'],
  ['docs', 'Current Affairs', 'Insight — India\'s Reverse Brain Drain', '46m', 'ph--f'],
  ['docs', 'Documentary', 'Minute By Minute — Fall of Berlin', '47m', 'ph--b'],
  ['shorts', 'Shorts', 'Money Talks: invest it or clear credit card debt?', '42s', 'ph--e'],
  ['shorts', 'Shorts', 'DSA should recognise talent, not be an admissions strategy', '1m 46s', 'ph--b'],
  ['shorts', 'Shorts', 'Loh Kean Yew claims historic Asian Games silver', '2m 34s', 'ph--c'],
  ['latest', 'Watch', 'Asian Games 2026: Loh Kean Yew misses out on badminton gold', '2m', 'ph--b'],
  ['latest', 'Watch', 'Singapore wins first medal in digital construction at WorldSkills', '6m', 'ph--d'],
  ['latest', 'Watch', 'Some outdoor fitness classes go on as planned despite haze', '5m', 'ph--e']
];
const insVid = db.prepare('INSERT INTO videos (block,category,title,duration,tone,position) VALUES (?,?,?,?,?,?)');
videos.forEach((v, i) => insVid.run(v[0], v[1], v[2], v[3], v[4], i));

/* ---------------- Schedule ---------------- */
const schedule = [
  ['06:00', 'Asia First', 'Live morning bulletin with breaking news from across Asia.'],
  ['11:00', 'Asia Now', 'Non-stop breaking stories and expert analysis every hour.'],
  ['20:00', 'East Asia Tonight', 'Evening bulletin covering East Asia.'],
  ['21:00', 'Asia Tonight', 'The day\'s biggest stories from across the region.'],
  ['22:00', 'Singapore Tonight', 'In-depth coverage of Singapore news.'],
  ['22:30', 'Insight', 'Current affairs documentary series.']
];
const insSched = db.prepare('INSERT INTO schedule (time,show,details) VALUES (?,?,?)');
schedule.forEach((s) => insSched.run(s[0], s[1], s[2]));

/* ---------------- Discover ---------------- */
const discover = [
  ['CNA Games', 'Stay sharp and challenge yourself with these puzzles.', 'games.html', 'ph--c'],
  ['CNA App', 'Download now. Available for Android and iOS.', '#', 'ph--d'],
  ['CNA Newsletters', 'Get the best of CNA delivered straight to your inbox.', 'newsletters.html', 'ph--e'],
  ['CNA Interactives', 'Immersive stories, visuals and data.', 'interactives.html', 'ph--b']
];
const insDisc = db.prepare('INSERT INTO discover (title,dek,href,tone,position) VALUES (?,?,?,?,?)');
discover.forEach((d, i) => insDisc.run(d[0], d[1], d[2], d[3], i));

/* ---------------- FAST stories ---------------- */
const fastStories = [
  ['Asia', 'Anthony Loke’s new resignation offer: what’s next for him, Anwar and Malaysia?', 'ph--c',
    ['Loke says his resignation in protest of Najib Razak’s conditional royal pardon will take effect only when Najib begins house arrest.',
     'Analysts say the move is calculated to limit disruption to the Cabinet and ensure continuity for key transport projects.',
     'Observers add Loke has little room to backtrack on a decision made in line with his party’s anti-corruption stance.']],
  ['Singapore', 'Around 100 businesses caught buying fake reviews in largest watchdog probe', 'ph--e',
    ['45 firms must apologise publicly and remove fabricated reviews after admitting they bought bogus ratings from one supplier.',
     'The fake reviews were posted on Google, Facebook, Tripadvisor, Carousell, Yelp and Trustpilot.',
     'CCS is conducting the investigation in two phases.']],
  ['World', 'Iran threatens new strikes as it awaits US response to Hormuz plan', 'ph--b',
    ['Tehran warned no infrastructure in the region would be safe if its security is not guaranteed.',
     'Iran’s foreign minister said he expects a formal US response within a day.',
     'Trump has already dismissed the proposal from Tehran.']],
  ['Business', 'Inside McDonald’s push to have AI price its menus', 'ph--f',
    ['The pricing engine uses machine learning to analyse millions of daily transactions across nearly 14,000 restaurants.',
     'It generates what the company calls the “optimal price” for each item at each location.',
     'The engine has widened price differences between restaurants, franchisees told Reuters.']],
  ['Sport', 'Man City guilty of using “sham” deals to distort finances, Premier League says', 'ph--d',
    ['An independent commission ruled the club guilty of serious breaches over nine seasons.',
     'The club, which denies wrongdoing, said it would appeal.',
     'City was found to have inflated revenue and understated costs by more than £900 million.']]
];
const insFast = db.prepare('INSERT INTO fast_stories (cat,title,tone,position) VALUES (?,?,?,?)');
const insPoint = db.prepare('INSERT INTO fast_points (story_id,position,text) VALUES (?,?,?)');
fastStories.forEach((f, i) => {
  const res = insFast.run(f[0], f[1], f[2], i);
  f[3].forEach((p, j) => insPoint.run(res.lastInsertRowid, j, p));
});

/* ---------------- Games ---------------- */
const games = [
  ['Word Puzzle', 'ph--c'], ['Number Grid', 'ph--d'], ['Daily Quiz', 'ph--b'],
  ['Connections', 'ph--e'], ['Crossword', 'ph--f'], ['Sudoku', 'ph--c']
];
const insGame = db.prepare('INSERT INTO games (label,tone,position) VALUES (?,?,?)');
games.forEach((g, i) => insGame.run(g[0], g[1], i));

/* ---------------- Interactives ---------------- */
const interactives = [
  ['Interactive', 'Can China’s chip ambitions reshape the global tech landscape?', 'ph--b'],
  ['CNA Explains', 'What caused the deadly Nepal-Tibet disaster?', 'ph--d'],
  ['Calculator', 'Singapore Budget 2026 calculator: what’s in it for you?', 'ph--c'],
  ['Interactive', 'Can you get enough protein from hawker food?', 'ph--e'],
  ['Interactive', 'Asia’s EVolution: the true price of electric vehicles', 'ph--f'],
  ['Interactive', 'How far will you go to support your team’s World Cup dream?', 'ph--b']
];
const insInter = db.prepare('INSERT INTO interactives (eyebrow,title,tone,position) VALUES (?,?,?,?)');
interactives.forEach((x, i) => insInter.run(x[0], x[1], x[2], i));

/* ---------------- RSS feeds ---------------- */
const rssFeeds = [
  ['Latest News', '/api/v1/rss-outbound-feed?_format=xml'],
  ['Asia', '/api/v1/rss-outbound-feed?_format=xml&category=6511'],
  ['Business', '/api/v1/rss-outbound-feed?_format=xml&category=6936'],
  ['Singapore', '/api/v1/rss-outbound-feed?_format=xml&category=10416'],
  ['Sport', '/api/v1/rss-outbound-feed?_format=xml&category=10296'],
  ['World', '/api/v1/rss-outbound-feed?_format=xml&category=6311'],
  ['Today', '/api/v1/rss-outbound-feed?_format=xml&category=679471']
];
const insRss = db.prepare('INSERT INTO rss_feeds (category,url) VALUES (?,?)');
rssFeeds.forEach((r) => insRss.run(r[0], r[1]));

/* ---------------- Newsletters ---------------- */
const newsletters = [
  ['Daily', 'Morning Brief', 'An automated feed of our top stories to start your morning.'],
  ['Weekly', 'Week in Review', 'Our chief editor shares analysis and picks of the week\'s biggest news.'],
  ['Weekly', 'CNA TODAY Big Read', 'A deep dive into the big issues that matter.'],
  ['As it happens', 'Recommended Read', 'A handpicked story that we think you shouldn\'t miss.'],
  ['Weekly', 'CNA Insider', 'CNA\'s best current affairs and documentaries with a deeper look at issues affecting Asia.']
];
const insNl = db.prepare('INSERT INTO newsletters (cadence,name,dek) VALUES (?,?,?)');
newsletters.forEach((n) => insNl.run(n[0], n[1], n[2]));

/* ---------------- People ---------------- */
const people = [
  ['presenter', 'Glenda Chong', 'Anchor, Asia Tonight'],
  ['presenter', 'Steve Lai', 'Anchor, Asia First'],
  ['presenter', 'Elizabeth Neo', 'Anchor, Singapore Tonight'],
  ['presenter', 'Cheryl Goh', 'CNA938 Radio'],
  ['correspondent', 'Abigail Ng', 'Singapore'],
  ['correspondent', 'Leslie Lopez', 'Malaysia'],
  ['correspondent', 'Steven R. Okun', 'Commentary'],
  ['correspondent', 'Chua Yeow Hwee', 'Commentary']
];
const insPeople = db.prepare('INSERT INTO people (kind,name,role,position) VALUES (?,?,?,?)');
people.forEach((p, i) => insPeople.run(p[0], p[1], p[2], i));

/* ---------------- Network ---------------- */
const network = ['CNA', 'TODAY', '8world', 'mewatch', 'melisten', 'Berita', '8days', 'Partner Network'];
const insNet = db.prepare('INSERT INTO network_properties (name,position) VALUES (?,?)');
network.forEach((n, i) => insNet.run(n, i));

/* ---------------- Advertise ---------------- */
const adStats = [
  ['10M+', 'unique visitors each month'],
  ['1M', 'viewers in Singapore every week'],
  ['2.3M', 'affluent regional viewers each month']
];
const insStat = db.prepare('INSERT INTO ad_stats (value,label) VALUES (?,?)');
adStats.forEach((s) => insStat.run(s[0], s[1]));

const adSpecs = [
  ['Leaderboard', '728 (w) × 90 (h) — Standard, Expandable, Expandable with video', 'leaderboard'],
  ['Interactive Marketing Unit (IMU)', '300 (w) × 250 (h) — Standard, Video, Expandable', 'imu'],
  ['Newsletter Banners', 'Reach a highly engaged audience, Monday through Saturday', 'leaderboard'],
  ['Microsites', 'Custom-built sites tailored to your advertising needs', 'leaderboard']
];
const insSpec = db.prepare('INSERT INTO ad_specs (name,dims,size) VALUES (?,?,?)');
adSpecs.forEach((s) => insSpec.run(s[0], s[1], s[2]));

/* ---------------- Contacts ---------------- */
const contacts = [
  ['advertise', 'Sales Hotline', '6333 9888', ''],
  ['advertise', 'General Advertising Enquiry', 'For advertising, branding & event opportunities on CNA\'s multiple platforms', 'digitalsalesteam@mediacorp.sg'],
  ['advertise', 'Distribution of CNA', 'For cable, satellite, IPTV or other platform carriage', 'programming@channelnewsasia.com'],
  ['advertise', 'Programme Sales', 'For enquiries on sales of programmes produced by CNA', 'programming@channelnewsasia.com'],
  ['editorial', 'Website editorial', 'For the team running the website', 'digitalnews@mediacorp.com.sg'],
  ['editorial', 'TV newsroom', 'For the TV newsroom', 'SingaporeDesk@mediacorp.com.sg'],
  ['editorial', 'Content licensing / reproduction', 'Rights to reproduce or host content', 'content_dist@mediacorp.com.sg'],
  ['editorial', 'Advertising & promotions', 'Advertising on CNA or promotional opportunities', 'mae@mediacorp.com.sg']
];
const insContact = db.prepare('INSERT INTO contacts (grp,heading,detail,email) VALUES (?,?,?,?)');
contacts.forEach((c) => insContact.run(c[0], c[1], c[2], c[3]));

/* ---------------- Search items ---------------- */
const searchItems = [
  ['Around 100 businesses caught buying fake reviews in largest probe by Singapore’s competition watchdog', 'Singapore', 'Article'],
  ['Anthony Loke’s new resignation offer: what’s next for him, Anwar and Malaysia’s transport projects?', 'Asia', 'Article'],
  ['Commentary: Who in Iran can make a deal with the US — and make it stick?', 'Commentary', 'Article'],
  ['India was late to the AI chip race. Could cameras and cars offer a way in?', 'Asia', 'Article'],
  ['Public transport fares to rise by 12 to 13 cents per ride from Dec 26', 'Singapore', 'Article'],
  ['Interest rates are up: should you pay down your debt now?', 'Podcast', 'Podcast'],
  ['Foreigners in Malaysia: who gets to stay and who doesn’t?', 'Podcast', 'Podcast'],
  ['Singapore Tonight — Tue 29 Sep 2026', 'Watch', 'Video'],
  ['Asian Games 2026: Singapore’s Loh Kean Yew misses out on badminton gold', 'Sport', 'Video'],
  ['Scrapping PSLE could create new pressures for students: David Neo', 'Singapore', 'Video'],
  ['Beyond banking: how HSBC Premier Elite serves the aspirations of the affluent', 'Brand Studio', 'Advertorial'],
  ['8 days of eats: the best new hawker stalls this month', '8days', '8days']
];
const insSearch = db.prepare('INSERT INTO search_items (title,category,type,position) VALUES (?,?,?,?)');
searchItems.forEach((s, i) => insSearch.run(s[0], s[1], s[2], i));

console.log('Seeded', DB_PATH);
