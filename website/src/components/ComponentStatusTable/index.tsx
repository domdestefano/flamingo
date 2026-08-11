import React from 'react';
import {
  componentStatusCategories,
  componentStatusRows,
  unmatchedSymbols,
  generatedAt,
  type CodeSymbol,
  type ComponentStatusCategory,
} from './data';
import styles from './styles.module.css';

/**
 * One platform cell. Several symbols stacked means the platform builds that
 * component as separate variants (Android compose); a single symbol with
 * variant groups underneath means one component parameterised by props or
 * enums (iOS, Web).
 */
function SymbolCell({ symbols }: { symbols: CodeSymbol[] }) {
  if (symbols.length === 0) {
    return <span className={styles.empty}>—</span>;
  }
  return (
    <>
      {symbols.map((entry) => (
        <div key={entry.symbol} className={styles.symbolBlock}>
          <code className={styles.symbol}>{entry.symbol}</code>
          {entry.variants?.map((variant) => (
            <span key={variant.group} className={styles.variants}>
              {variant.group}: {variant.values.join(' · ')}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

function CategoryTable({ category }: { category: ComponentStatusCategory }) {
  const covered = category.rows.filter(
    (row) =>
      row.androidCommonUi.length > 0 ||
      row.androidCompose.length > 0 ||
      row.ios.length > 0 ||
      row.web.length > 0
  ).length;

  return (
    <section className={styles.category}>
      <h2 id={category.label.toLowerCase().replace(/\s+/g, '-')}>
        {category.label}
        <span className={styles.categoryCount}>
          {covered} of {category.rows.length} in code
        </span>
      </h2>

      <div className={styles.scroll}>
        <table className={styles.statusTable}>
          {/* Fixed widths so every category's table lines up with the others. */}
          <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '21%' }} />
            <col style={{ width: '21%' }} />
            <col style={{ width: '21%' }} />
            <col style={{ width: '21%' }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Component name</th>
              <th scope="col">
                Android – common-ui
                <span className={styles.subhead}>View classes, old library</span>
              </th>
              <th scope="col">
                Android – rrds-compose
                <span className={styles.subhead}>composable functions</span>
              </th>
              <th scope="col">iOS</th>
              <th scope="col">Web</th>
            </tr>
          </thead>
          <tbody>
            {category.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className={styles.rowName}>
                  {row.displayName}
                  {row.undocumented && (
                    <span className={styles.undocumented} title="Exists in code but has no docs page yet">
                      no docs page
                    </span>
                  )}
                </th>
                <td>
                  <SymbolCell symbols={row.androidCommonUi} />
                </td>
                <td>
                  <SymbolCell symbols={row.androidCompose} />
                </td>
                <td>
                  <SymbolCell symbols={row.ios} />
                </td>
                <td>
                  <SymbolCell symbols={row.web} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ComponentStatusTable(): React.ReactElement {
  const total = componentStatusRows.length;
  const covered = componentStatusRows.filter(
    (row) =>
      row.androidCommonUi.length > 0 ||
      row.androidCompose.length > 0 ||
      row.ios.length > 0 ||
      row.web.length > 0
  ).length;

  return (
    <div>
      <p className={styles.meta}>
        {covered} of {total} documented components found in code. Generated{' '}
        {generatedAt} from the Android, iOS and Web source repositories.
      </p>

      {componentStatusCategories.map((category) => (
        <CategoryTable key={category.label} category={category} />
      ))}

      {unmatchedSymbols.length > 0 && (
        <details className={styles.needsReview}>
          <summary>
            {unmatchedSymbols.length} symbol(s) found in code but not matched to
            a documented component
          </summary>
          <p className={styles.needsReviewHint}>
            These are usually components that exist in code but have no docs
            page yet. If one is actually a variant of an existing row, map it in{' '}
            <code>scripts/component-status-overrides.json</code>.
          </p>
          <ul>
            {unmatchedSymbols.map((item) => (
              <li key={`${item.platform}-${item.symbol}`}>
                <code>{item.symbol}</code>{' '}
                <span className={styles.platformTag}>{item.platform}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
