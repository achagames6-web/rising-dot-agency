'use client';

// components/pages/ConversationForm.tsx  (Contact)
//
// The form as a conversation: one question per screen, answers as buttons, and
// a brief that writes itself at the end. Long forms lose people; this asks
// four things and feels like none.
//
// The final step posts to the same /api/contact route the main form uses, so
// it works the moment RESEND_API_KEY is set.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

const STEPS: { q: string; options?: string[] }[] = [
  {
    q: 'What should stop repeating?',
    options: [
      'Orders & admin',
      'Content & SEO',
      'Customer questions',
      'Something else',
    ],
  },
  {
    q: 'How big is it today?',
    options: ['A few a week', 'Dozens a day', 'Hundreds a day', 'Not sure yet'],
  },
  {
    q: 'When would you want it running?',
    options: ['This month', 'This quarter', 'Just exploring'],
  },
  { q: 'Where can we reach you?' },
];

export default function ConversationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const answer = (value: string) => {
    setAnswers((a) => {
      const next = [...a];
      next[step] = value;
      return next;
    });
    setStep((s) => s + 1);
  };

  const send = async () => {
    if (!email) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Website enquiry',
          email,
          subject: `Wants to automate: ${answers[0]}`,
          message: `What should stop repeating: ${answers[0]}\nVolume today: ${answers[1]}\nTimeline: ${answers[2]}`,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error || `Request failed (${res.status})`);
      }
      setDone(true);
      setStep(STEPS.length);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not send. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setEmail('');
    setDone(false);
    setError('');
  };

  return (
    <section className="ps-sec" aria-labelledby="cf-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="cf-head"
          eyebrow="Tell us in four answers"
          title={
            <>
              Not a form.
              <br />
            </>
          }
          highlight="Four questions"
          lead="Answer what you can. The brief writes itself at the end."
        />

        <div className="cf">
          <div className="cf__dots" aria-hidden="true">
            {STEPS.map((s, i) => (
              <i key={s.q} className={i <= step ? 'is-on' : ''} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {step < STEPS.length ? (
                <>
                  <span className="ps-k">
                    Question {step + 1} of {STEPS.length}
                  </span>
                  <h3 className="cf__q">{STEPS[step].q}</h3>

                  {STEPS[step].options ? (
                    <div className="cf__opts">
                      {STEPS[step].options!.map((o) => (
                        <button
                          key={o}
                          type="button"
                          className="cf__o"
                          onClick={() => answer(o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <input
                        className="cf__in"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        aria-label="Your email"
                      />
                      {error && (
                        <p className="cf__err" role="alert">
                          {error}
                        </p>
                      )}
                      <div className="cf__send">
                        <StarButton
                          type="button"
                          onClick={send}
                          disabled={sending || !email}
                        >
                          {sending ? 'Sending…' : 'Send it'}
                        </StarButton>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="ps-k">
                    {done
                      ? 'Sent — we will reply within a working day'
                      : 'Your brief'}
                  </span>
                  <h3 className="cf__q">That is all we need</h3>
                  <p className="cf__sum">
                    You want <b>{answers[0]}</b> to stop being manual. It runs
                    at <b>{answers[1]}</b> today, and you would like it live{' '}
                    <b>{answers[2]}</b>. We will reply with a fixed-scope
                    prototype for exactly that.
                  </p>
                  <div className="cf__send">
                    <StarButton type="button" variant="ghost" onClick={reset}>
                      Start again
                    </StarButton>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
