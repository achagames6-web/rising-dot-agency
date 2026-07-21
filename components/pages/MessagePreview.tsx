'use client';

// components/pages/MessagePreview.tsx  (Contact)
//
// A phone that types a real exchange in front of you, so the bar to start
// looks as low as it actually is. For clients who would rather message than
// fill anything in - which, for a retailer or a shop owner, is most of them.

import { useEffect, useRef, useState } from 'react';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

type Msg = { from: 'them' | 'us'; text: string };

const CHAT: Msg[] = [
  {
    from: 'them',
    text: 'Hi — we take laundry orders on WhatsApp and it is chaos. Can that be automated?',
  },
  {
    from: 'us',
    text: 'Yes. Roughly how many a day, and do you already have a booking page?',
  },
  { from: 'them', text: 'About 30. No page.' },
  {
    from: 'us',
    text: 'Then the first piece is a booking flow plus a dashboard. Fixed price, running on your real orders. Want a call this week?',
  },
];

export default function MessagePreview() {
  const [count, setCount] = useState(0);
  const [clock, setClock] = useState('--:--');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      setCount(CHAT.length);
      return;
    }

    const run = () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      setCount(0);
      let at = 400;
      CHAT.forEach((m, i) => {
        // Longer messages take longer to "write", the way a real reply does.
        at += Math.min(2600, m.text.length * 22 + 500);
        timers.current.push(window.setTimeout(() => setCount(i + 1), at));
      });
      timers.current.push(window.setTimeout(run, at + 5000));
    };
    run();

    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  return (
    <section className="ps-sec" aria-labelledby="ph-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="ph-head"
          eyebrow="Or just message"
          title={
            <>
              Two lines
              <br />
            </>
          }
          highlight="is enough"
          lead="No form, no brief. Start the way you would with anyone else."
        />

        <div className="ph">
          <div className="ph__bar">
            <span>WhatsApp</span>
            <span>{clock}</span>
          </div>

          <div className="ph__msgs">
            {CHAT.slice(0, count).map((m) => (
              <p key={m.text} className={`ph__m ph__m--${m.from}`}>
                {m.text}
              </p>
            ))}
            {count < CHAT.length && (
              <span className="ph__typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </div>

          <div className="ph__in">
            <span>Message…</span>
            <StarButton href="/contact">Send</StarButton>
          </div>
        </div>
      </div>
    </section>
  );
}
