import type { Connective } from "../domain/connectives";
import { spokenExpression, truthLabel } from "../domain/connectives";

interface TruthValueTokenProps {
  value: boolean;
  words?: boolean;
}

export function TruthValueToken({ value, words = false }: TruthValueTokenProps) {
  return <span className="truth-value-token">{truthLabel(value, words)}</span>;
}

interface LogicExpressionProps {
  connective: Connective;
  a: boolean;
  b?: boolean;
  symbol: string;
  words?: boolean;
  className?: string;
  accessibleLabel?: string;
}

export function LogicExpression({ connective, a, b, symbol, words = false, className, accessibleLabel }: LogicExpressionProps) {
  const classes = ["logic-expression", className].filter(Boolean).join(" ");
  return (
    <span className={classes} aria-label={accessibleLabel ?? spokenExpression(connective, a, b)}>
      {connective.arity === 1 ? (
        <>
          <span className="connective-symbol" aria-hidden="true">{symbol}</span>
          <TruthValueToken value={a} words={words} />
        </>
      ) : (
        <>
          <TruthValueToken value={a} words={words} />
          <span className="connective-symbol" aria-hidden="true"> {symbol} </span>
          <TruthValueToken value={Boolean(b)} words={words} />
        </>
      )}
    </span>
  );
}

interface FormulaExpressionProps {
  connective: Connective;
  symbol: string;
  className?: string;
}

export function FormulaExpression({ connective, symbol, className }: FormulaExpressionProps) {
  const classes = ["formula-expression", className].filter(Boolean).join(" ");
  const spoken = connective.arity === 1 ? `${connective.spokenName} P` : `P ${connective.spokenName} Q`;
  return <span className={classes} aria-label={spoken}>{connective.arity === 1 ? <><span className="connective-symbol">{symbol}</span>P</> : <>P <span className="connective-symbol">{symbol}</span> Q</>}</span>;
}
