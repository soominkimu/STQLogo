import React       from 'react';
import articles    from './articles.json';

export const ArticlesList = prop => {
  const art = articles.items;

  const bullet = date => {
    const dt = new Date(date);
    const diffDays = Math.ceil( ( Date.now() - dt.getTime() ) / (1000*60*60*24) );
    if (diffDays > 30) return "✨";
    else               return "HOT🔥";
  }

  return (
    <div className="artlist">
      <ul>
        {art.map( (a, i) => <li key={i} data-b={bullet(a.date)}><a href={a.url}>{a.title}</a></li> )}
      </ul>
      <p><span>Tips</span> Double Click to change the background scene.</p>
    </div>
  );
}
