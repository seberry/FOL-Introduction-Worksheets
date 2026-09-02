import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Connective } from "../domain/connectives";
import { FormulaExpression, LogicExpression, TruthValueToken } from "./LogicExpression";

interface CasePromptProps {
  connective: Connective;
  a: boolean;
  b?: boolean;
  symbol: string;
}

export function ExpandedCasePrompt({ connective, a, b, symbol }: CasePromptProps) {
  const question = connective.arity === 1
    ? `P is ${a ? "true" : "false"}. What is the truth value of ${connective.spokenName} P?`
    : `P is ${a ? "true" : "false"} and Q is ${b ? "true" : "false"}. What is the truth value of P ${connective.spokenName} Q?`;
  return (
    <div className="expanded-case-prompt" role="group" aria-label={question}>
      <div className="truth-assignments" aria-hidden="true">
        <p><span className="sentence-letter">P</span> is <TruthValueToken value={a} words /></p>
        {connective.arity === 2 && <p><span className="sentence-letter">Q</span> is <TruthValueToken value={Boolean(b)} words /></p>}
      </div>
      <p className="expanded-question" aria-hidden="true">What is the truth value of <FormulaExpression connective={connective} symbol={symbol} />?</p>
    </div>
  );
}

export function CompactCasePrompt({ connective, a, b, symbol }: CasePromptProps) {
  return <LogicExpression className="problem-expression" connective={connective} a={a} b={b} symbol={symbol} accessibleLabel={`${connective.arity === 1 ? `${connective.spokenName} ${a ? "true" : "false"}` : `${a ? "true" : "false"} ${connective.spokenName} ${b ? "true" : "false"}`} shorthand. What is the resulting truth value?`} />;
}

interface CompactNotationLessonProps extends CasePromptProps {
  onContinue: () => void;
}

export function CompactNotationLesson({ connective, a, b, symbol, onContinue }: CompactNotationLessonProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => titleRef.current?.focus(), []);
  return (
    <main className="focus-shell" id="main-content">
      <section className="notation-lesson" aria-labelledby="notation-lesson-title">
        <p className="eyebrow">Quicker notation</p>
        <h1 id="notation-lesson-title" ref={titleRef} tabIndex={-1}>Quicker notation</h1>
        <p>Logic books often abbreviate TRUE as T and FALSE as F.</p>
        <div className="notation-comparison">
          <div>
            <ExpandedCasePrompt connective={connective} a={a} b={b} symbol={symbol} />
            <p><FormulaExpression connective={connective} symbol={symbol} /> is <TruthValueToken value={connective.evaluate(a, b)} words />.</p>
          </div>
          <ArrowRight aria-hidden="true" />
          <p className="compact-example"><LogicExpression connective={connective} a={a} b={b} symbol={symbol} /> = <TruthValueToken value={connective.evaluate(a, b)} /></p>
        </div>
        <p>Here T and F are truth values, not sentence letters.</p>
        <button className="primary-button" type="button" onClick={onContinue}>Continue with shorthand <ArrowRight aria-hidden="true" /></button>
      </section>
    </main>
  );
}
