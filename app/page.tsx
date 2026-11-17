// whyyoufeelsobad.com - the personal way in to Demismatch.
// Copy approved by Maarten on 17 Nov 2026 ("keep the whole thing. publish").
// Lines 8 and 9 were reworded to match Cor (EEA-SUBS-01, EEA-TOUCH-02).

const COR = 'https://cor.demismatch.com/';
const WRI = 'https://whatreally.is/';

type Line = { lead: string; rest: string; cor?: string; page?: [string, string] };

const RIGHT: Line[] = [
  { lead: 'The dread at 8am is right.', rest: 'You are about to leave everyone you love and spend nine hours with people who would replace you in a week.' },
  { lead: 'The low mood is right.', rest: 'Nobody has needed you for anything in three weeks.', page: ['depression/', 'Depression'] },
  { lead: 'The nerves around strangers are right.', rest: 'For most of human history a stranger could get you killed.', cor: 'EEA-SOC-08', page: ['shyness/', 'Shyness'] },
  { lead: 'The exhaustion with your baby is right.', rest: 'You are two adults doing a job that used to take a whole camp.', cor: 'EEA-CARE-01', page: ['parental-burnout/', 'Parental burnout'] },
  { lead: 'The loneliness is right.', rest: 'You have hundreds of contacts and nobody who would notice by tonight if you were gone.', cor: 'EEA-SOC-01' },
  { lead: 'The dread at 3am is right.', rest: 'You are awake alone in the dark, and for most of human history somebody nearby was awake too.' },
  { lead: 'The emptiness after work is right.', rest: 'You worked all week and cannot point at one thing you made.', cor: 'EEA-SUBS-02', page: ['burnout/', 'Burnout'] },
  { lead: 'The restlessness is right.', rest: 'Your body was built to move through the whole day, and you sat for eleven hours.', cor: 'EEA-SUBS-01' },
  { lead: 'The pull toward your crying baby is right.', rest: 'In a study of 173 societies, every one had babies sleeping in the same room as their mother.', cor: 'EEA-TOUCH-02' },
  { lead: 'The resentment at work is right.', rest: 'Someone who barely knows you decides how you spend your days.', cor: 'EEA-SOC-10' },
];

const FAKE: Line[] = [
  { lead: 'The joy when your team wins works fine.', rest: 'It is aimed at eleven men who have never heard of you.', cor: 'EEA-SOC-15', page: ['celebrity/', 'Celebrity'] },
  { lead: 'The warmth you feel for the cast of Friends works fine.', rest: 'None of them know you exist.', cor: 'EEA-SOC-15', page: ['celebrity/', 'Celebrity'] },
  { lead: 'The pride at two thousand likes works fine.', rest: 'Not one of those people would help you move house.', cor: 'EEA-SOC-11' },
  { lead: 'The crush on the singer works fine.', rest: 'She is singing to forty thousand people.', cor: 'EEA-SOC-15' },
  { lead: 'The hunger in the snack aisle works fine.', rest: 'That food was designed so you cannot stop.', cor: 'EEA-DIET-02' },
];

const BIG: Line[] = [
  { lead: 'The fear when you read the news works fine.', rest: 'It was built for danger you could fight or run from, and you can do neither with a war on another continent.', cor: 'EEA-THREAT-02' },
  { lead: 'The envy works fine.', rest: 'It was built to compare you with the people you live with, and you are comparing yourself with everyone alive.', cor: 'EEA-SOC-11' },
  { lead: 'The helplessness in front of a tax form works fine.', rest: 'Nothing in a human was built for rules written by strangers for millions of people.' },
  { lead: 'The feeling that you are behind works fine.', rest: 'You are measuring yourself against the best in the world at everything.', cor: 'EEA-SOC-11' },
];

function Rings() {
  return (
    <svg className="rings" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <circle cx="13.2" cy="13.2" r="7.6" />
      <circle cx="14.4" cy="14.4" r="4.4" />
      <circle className="dot" cx="15.4" cy="15.4" r="2.1" />
    </svg>
  );
}

function Group({ title, lines }: { title: string; lines: Line[] }) {
  return (
    <section className="grp">
      <h2>{title}</h2>
      <ul>
        {lines.map((l) => (
          <li key={l.lead}>
            <p>
              <b>{l.lead}</b> {l.rest}
            </p>
            {(l.page || l.cor) && (
              <p className="more">
                {l.page && <a href={WRI + l.page[0]}>What really is: {l.page[1]}</a>}
                {l.cor && <a href={COR + 'the-gap.html#' + l.cor}>The science</a>}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <nav className="doors" aria-label="Demismatch">
        <div className="d-in">
          <a className="dm" href="https://demismatch.com">Demismatch</a>
          <a href="/" aria-current="page">Why you feel so bad</a>
          <a href={WRI}>whatreally.is</a>
          <a href={COR}>Cor</a>
        </div>
      </nav>

      <div className="cor-ban" role="note">
        <div className="cb-in">
          <p className="cb-h">
            <Rings />
            <span>This is the science, checked without mercy.</span>
          </p>
          <p className="cb-t">
            Every finding in <a href={COR + 'about.html#how-built'}>Cor</a>, the evidence record behind this site, is
            traced to the study itself, graded by how hard it was tested, and marked down at the first doubt. A study
            that failed to replicate never gets in. Cor keeps{' '}
            <a href={COR + 'reference.html#ref-challenges'}>records of the evidence against itself</a>, publishes{' '}
            <a href={COR + 'objections.html'}>the strongest attacks on its own work</a> and names{' '}
            <a href={COR + 'programme.html#falsification'}>the results that would kill it</a>. It&apos;s, in a word,
            really good science.
          </p>
          <p className="cb-go">
            <a className="cb-btn" href={COR}>Open Cor</a>
          </p>
        </div>
      </div>

      <header className="hd">
        <p className="q">Why you feel so bad</p>
        <h1>Your feelings are right.</h1>
        <p className="sum">Look at what they are reacting to.</p>
      </header>

      <main className="cols">
        <Group title="Right about your life" lines={RIGHT} />
        <Group title="The feeling works. What it is aimed at is fake." lines={FAKE} />
        <Group title="The feeling works. What it is aimed at is too big." lines={BIG} />
      </main>

      <section className="next">
        <h2>Humans need a world for humans.</h2>
        <div className="tiles">
          <a className="tile" href={WRI}>
            <span className="t-n">whatreally.is</span>
            <span className="t-a">The debunk machine for the mismatched world.</span>
            <span className="t-go">Open it</span>
          </a>
          <a className="tile" href={COR}>
            <span className="t-n">Cor</span>
            <span className="t-a">The science body. Why humans feel what they feel, and what they really need.</span>
            <span className="t-go">Open it</span>
          </a>
          <a className="tile" href="https://demismatch.com">
            <span className="t-n">Demismatch</span>
            <span className="t-a">The open, independent research project behind all of this.</span>
            <span className="t-go">Open it</span>
          </a>
        </div>
      </section>

      <footer className="ft">
        <p>
          Every line traces to Cor, the evidence atlas at <a href={COR}>cor.demismatch.com</a>. Part of{' '}
          <a href="https://demismatch.com">Demismatch</a>.
        </p>
        <p className="nmd">General information, not medical advice.</p>
      </footer>
    </>
  );
}
